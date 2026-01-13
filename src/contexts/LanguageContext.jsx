import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

const translations = {
  en: {
    appName: "Turbo Exam",
    login: {
      signInGoogle: "Sign in with Google",
      subtitle: "Practice questions for any exam"
    },
    dashboard: {
      title: "Dashboard",
      yourQuizzes: "Your Quizzes",
      newQuiz: "New Quiz from PDF",
      official: "Official",
      custom: "Custom",
      midtermTitle: "Example Quiz",
      midtermDesc: "A sample set of questions to demonstrate the app features.",
      generatedFrom: "Generated from",
      loading: "Loading your quizzes...",
      deleteTitle: "Delete Quiz?",
      deleteConfirm: "Are you sure you want to delete",
      cancel: "Cancel",
      delete: "Delete Quiz",
      editTitle: "Edit Quiz Title",
      enterTitle: "Title",
      save: "Save Changes",
      logout: "Log Out"
    },
    upload: {
      title: "Upload Exam",
      clickUpload: "Click to upload",
      dragDrop: "or drag and drop",
      fileType: "PDF files only (max 10MB)",
      quizTitle: "Quiz Title",
      enterQuizTitle: "Enter quiz title",
      generate: "Generate Quiz",
      cancel: "Cancel",
      uploading: "Uploading and analyzing PDF with AI...",
      saving: "Saving quiz...",
      error: "Failed to process file. Please try again."
    },
    quiz: {
      back: "Back to Dashboard",
      jump: "Jump to Question",
      select: "Select Question",
      submit: "Submit Answer",
      correct: "Correct!",
      incorrect: "Incorrect",
      next: "Next",
      copy: "Copy",
      whatsapp: "WhatsApp",
      report: "Report Mistake",
      return: "Return to Dashboard",
      notFound: "Quiz not found or empty",
      restart: "Restart Quiz",
      score: "Your Score",
      completed: "Quiz Completed!"
    },
    footer: {
      buyCoffee: "Buy me a coffee",
      builtWith: "Built with React & Tailwind"
    }
  },
  he: {
    appName: "מערבל מבחנים",
    login: {
      signInGoogle: "התחבר עם Google",
      subtitle: "תרגול שאלות לכל סוגי המבחנים"
    },
    dashboard: {
      title: "לוח בקרה",
      yourQuizzes: "המבחנים שלך",
      newQuiz: "מבחן חדש מ-PDF",
      official: "רשמי",
      custom: "מותאם אישית",
      midtermTitle: "מבחן לדוגמה",
      midtermDesc: "ערכת שאלות לדוגמה להדגמת יכולות האפליקציה.",
      generatedFrom: "נוצר מתוך",
      loading: "טוען מבחנים...",
      deleteTitle: "מחיקת מבחן?",
      deleteConfirm: "האם אתה בטוח שברצונך למחוק את",
      cancel: "ביטול",
      delete: "מחק מבחן",
      editTitle: "ערוך כותרת מבחן",
      enterTitle: "כותרת",
      save: "שמור שינויים",
      logout: "התנתק"
    },
    upload: {
      title: "העלאת מבחן",
      clickUpload: "לחץ להעלאה",
      dragDrop: "או גרור ושחרר",
      fileType: "קובצי PDF בלבד (עד 10MB)",
      quizTitle: "כותרת המבחן",
      enterQuizTitle: "הכנס כותרת למבחן",
      generate: "צור מבחן",
      cancel: "ביטול",
      uploading: "מעלה ומנתח את ה-PDF עם AI...",
      saving: "שומר מבחן...",
      error: "נכשל בעיבוד הקובץ. אנא נסה שוב."
    },
    quiz: {
      back: "חזרה ללוח הבקרה",
      jump: "קפוץ לשאלה",
      select: "בחר שאלה",
      submit: "הגש תשובה",
      correct: "נכון!",
      incorrect: "לא נכון",
      next: "הבא",
      copy: "העתק",
      whatsapp: "וואטסאפ",
      report: "דווח על טעות",
      return: "חזרה ללוח הבקרה",
      notFound: "מבחן לא נמצא או ריק",
      restart: "התחל מחדש",
      score: "הציון שלך",
      completed: "המבחן הושלם!"
    },
    footer: {
      buyCoffee: "קנה לי קפה",
      builtWith: "נבנה באמצעות React & Tailwind"
    }
  }
};

export function LanguageProvider({ children }) {
  // Default to Hebrew
  const [language, setLanguage] = useState('he');

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'he' ? 'en' : 'he');
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    
    return current;
  };

  const value = {
    language,
    toggleLanguage,
    t,
    isRTL: language === 'he'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
