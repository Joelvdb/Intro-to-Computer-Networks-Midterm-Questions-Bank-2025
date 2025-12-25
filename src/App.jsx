import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import Feedback from './components/Feedback';
import EndScreen from './components/EndScreen';
import Footer from './components/Footer';
import questionsData from './data/questions.json';

function App() {
  const [questions] = useState(questionsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const currentQuestion = questions[currentIndex];
  // Placeholder repo URL - user should update this
  const repoUrl = "https://github.com/Joel-H-96/Intro-to-Computer-Networks-Midterm-Questions-Bank-2025"; 

  const handleOptionSelect = (index) => {
    if (isAnswered) return;

    const correct = currentQuestion.correct_indices.includes(index);
    setIsCorrect(correct);
    setSelectedOption(index);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setIsCorrect(false);
    } else {
      setShowEndScreen(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setShowEndScreen(false);
  };

  const handleReport = () => {
    const subject = `Report Mistake: Question ID ${currentQuestion.id}`;
    const body = `I found a mistake in question ${currentQuestion.id}.\n\nDetails:`;
    window.open(`mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleCopy = () => {
    const text = `Question: ${currentQuestion.question}\n\nAnswer: ${currentQuestion.options[currentQuestion.correct_indices[0]]}\n\nExplanation: ${currentQuestion.explanation}`;
    navigator.clipboard.writeText(text);
    // Optional: Show toast
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <BrainCircuit className="text-indigo-400" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NetQuiz</h1>
              <p className="text-xs text-indigo-300/70">Computer Networks Midterm</p>
            </div>
          </div>
          
          {!showEndScreen && (
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-indigo-400">{currentIndex + 1}</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-400">{questions.length}</span>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
          {showEndScreen ? (
            <EndScreen 
              score={score} 
              totalQuestions={questions.length} 
              onRestart={handleRestart}
              repoUrl={repoUrl}
            />
          ) : (
            <div className="w-full">
              <QuestionCard 
                question={currentQuestion}
                onOptionSelect={handleOptionSelect}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
              />
              
              {isAnswered && (
                <Feedback 
                  isCorrect={isCorrect}
                  explanation={currentQuestion.explanation}
                  onNext={handleNext}
                  onReport={handleReport}
                  onCopy={handleCopy}
                />
              )}
            </div>
          )}
        </main>

        <Footer repoUrl={repoUrl} />
      </div>
    </div>
  );
}

export default App;
