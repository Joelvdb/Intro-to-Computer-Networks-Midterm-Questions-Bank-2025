const functions = require("firebase-functions");
const admin = require("firebase-admin");
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();

exports.generateQuiz = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = context.auth.uid;
  const userRef = admin.firestore().collection("users").doc(uid);
  const userDoc = await userRef.get();

  // 2. Rate Limiting (1 upload per 10 minutes)
  if (userDoc.exists) {
    const lastUpload = userDoc.data().lastUpload;
    if (lastUpload) {
      const lastUploadTime = lastUpload.toDate();
      const now = new Date();
      const diffMinutes = (now - lastUploadTime) / 1000 / 60;

      if (diffMinutes < 10) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          `Please wait ${Math.ceil(10 - diffMinutes)} minutes before generating another quiz.`
        );
      }
    }
  }

  // 3. Gemini API Call
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new functions.https.HttpsError(
      "internal",
      "Gemini API key not configured."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      temperature: 0.1
    }
  });

  const prompt = `
    You are an expert exam creator. Analyze the attached PDF document and extract all multiple choice questions from it.
    Return ONLY a valid JSON array of objects. Do not include markdown formatting (like \`\`\`json).
    Do not change any question or answer, be strict about it.
    The questions you will get can be in english or in hebrew. If the question is in hebrew, make sure to keep it in hebrew. with the same text.
    dont invent any questions or answers.
    In the PDF document, answer for each question is always the first choise! do not change it.
    Each object must have this structure:
    {
      "id": number,
      "question": "string",
      "options": ["string", "string", ...],
      "correct_indices": [number], // 0-based indices of correct options
      "explanation": "string" // brief explanation of the answer
    }
  `;

  try {
    const pdfPart = {
      inlineData: {
        data: data.fileBase64,
        mimeType: "application/pdf",
      },
    };

    const result = await model.generateContent([prompt, pdfPart]);
    const response = await result.response;
    const textResponse = response.text();
    
    // Clean up potential markdown formatting
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleanJson);

    // 4. Save to Firestore (Server-side)
    const quizData = {
      userId: uid,
      title: data.title || "Untitled Quiz",
      fileName: "uploaded_file.pdf", // We don't have the original filename here easily, or we can pass it
      questions: questions,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const quizRef = await admin.firestore().collection("quizzes").add(quizData);

    // 5. Update Rate Limit Timestamp
    await userRef.set({ lastUpload: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    return { quizId: quizRef.id };

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate quiz: " + error.message
    );
  }
});
