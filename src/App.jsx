import React, { useState } from 'react';
import { BrainCircuit, Grid, X } from 'lucide-react';
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
  const [selectedOptions, setSelectedOptions] = useState([]); // Changed to array
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showNav, setShowNav] = useState(false); // For navigation modal

  const currentQuestion = questions[currentIndex];
  const repoUrl = "https://github.com/Joelvdb/Intro-to-Computer-Networks-Midterm-Questions-Bank-2025";

  const handleOptionToggle = (index) => {
    if (isAnswered) return;
    
    setSelectedOptions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;

    // Check if selected options exactly match correct indices
    const correctIndices = currentQuestion.correct_indices;
    const isExactMatch = 
      selectedOptions.length === correctIndices.length &&
      selectedOptions.every(val => correctIndices.includes(val));

    setIsCorrect(isExactMatch);
    setIsAnswered(true);

    if (isExactMatch) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      setShowEndScreen(true);
    }
  };

  const handleJumpTo = (index) => {
    setCurrentIndex(index);
    resetQuestionState();
    setShowNav(false);
  };

  const resetQuestionState = () => {
    setIsAnswered(false);
    setSelectedOptions([]);
    setIsCorrect(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    resetQuestionState();
    setShowEndScreen(false);
  };

  const handleReport = () => {
    const phoneNumber = "0527214041"; // User provided number
    const text = `Report Mistake: Question ID ${currentQuestion.id}\nI found a mistake in question ${currentQuestion.id}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopy = () => {
    const correctOptions = currentQuestion.correct_indices.map(i => currentQuestion.options[i]).join(", ");
    const text = `Question: ${currentQuestion.question}\n\nAnswer: ${correctOptions}\n\nExplanation: ${currentQuestion.explanation}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12 relative z-10">
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
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNav(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Jump to Question"
              >
                <Grid size={20} className="text-gray-300" />
              </button>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
                <span className="text-indigo-400">{currentIndex + 1}</span>
                <span className="text-gray-500 mx-2">/</span>
                <span className="text-gray-400">{questions.length}</span>
              </div>
            </div>
          )}
        </header>

        {/* Navigation Modal */}
        {showNav && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowNav(false)}>
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Select Question</h2>
                <button onClick={() => setShowNav(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => handleJumpTo(idx)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      currentIndex === idx 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
                onOptionToggle={handleOptionToggle}
                selectedOptions={selectedOptions}
                isAnswered={isAnswered}
                onSubmit={handleSubmit}
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
