import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BrainCircuit, Grid, X, ArrowLeft, Loader2, Globe } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import QuestionCard from '../components/QuestionCard';
import Feedback from '../components/Feedback';
import EndScreen from '../components/EndScreen';
import Footer from '../components/Footer';
import defaultQuestions from '../data/questions.json';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useLanguage();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      let loadedQuestions = [];
      
      if (id === 'default') {
        loadedQuestions = defaultQuestions;
      } else {
        try {
          const docRef = doc(db, "quizzes", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            loadedQuestions = docSnap.data().questions;
          } else {
            console.error("No such quiz!");
          }
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      }

      // Shuffle options for each question
      const shuffledQuestions = loadedQuestions.map(q => {
        if (!q.options || !q.correct_indices) return q;

        // Create an array of indices [0, 1, 2, 3...]
        const indices = q.options.map((_, i) => i);
        
        // Shuffle the indices
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Create new options array based on shuffled indices
        const newOptions = indices.map(i => q.options[i]);

        // Map old correct indices to new positions
        const newCorrectIndices = [];
        indices.forEach((oldIndex, newIndex) => {
          if (q.correct_indices.includes(oldIndex)) {
            newCorrectIndices.push(newIndex);
          }
        });

        return {
          ...q,
          options: newOptions,
          correct_indices: newCorrectIndices
        };
      });

      setQuestions(shuffledQuestions);
      setLoading(false);
    }
    loadQuestions();
  }, [id]);

  const currentQuestion = questions[currentIndex];

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



  const handleCopy = () => {
    const correctOptions = currentQuestion.correct_indices.map(i => currentQuestion.options[i]).join(", ");
    const text = `Question: ${currentQuestion.question}\n\nAnswer: ${correctOptions}\n\nExplanation: ${currentQuestion.explanation}`;
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">{t('quiz.notFound')}</h2>
          <button onClick={() => navigate('/dashboard')} className="text-indigo-400 hover:underline">{t('quiz.return')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${language === 'he' ? 'ml-2' : 'mr-2'}`}
              title={t('quiz.back')}
            >
              <ArrowLeft size={24} className={`text-gray-300 ${language === 'he' ? 'rotate-180' : ''}`} />
            </button>
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <BrainCircuit className="text-indigo-400" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('appName')}</h1>
              <p className="text-xs text-indigo-300/70">
                {id === 'default' ? t('dashboard.official') : t('dashboard.custom')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white flex items-center gap-2"
              title="Switch Language"
            >
              <Globe size={20} />
              <span className="text-xs hidden sm:inline">{language === 'he' ? 'EN' : 'עב'}</span>
            </button>

            {!showEndScreen && (
              <>
                <button 
                  onClick={() => setShowNav(true)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  title={t('quiz.jump')}
                >
                  <Grid size={20} className="text-gray-300" />
                </button>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="text-indigo-400">{currentIndex + 1}</span>
                  <span className="text-gray-500 mx-2">/</span>
                  <span className="text-gray-400">{questions.length}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Navigation Modal */}
        {showNav && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowNav(false)}>
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">{t('quiz.select')}</h2>
                <button onClick={() => setShowNav(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
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
              t={t}
            />
          ) : (
            <div className="w-full">
              <QuestionCard 
                question={currentQuestion}
                onOptionToggle={handleOptionToggle}
                selectedOptions={selectedOptions}
                isAnswered={isAnswered}
                onSubmit={handleSubmit}
                t={t}
              />
              
              {isAnswered && (
                <Feedback 
                  isCorrect={isCorrect}
                  explanation={currentQuestion.explanation}
                  onNext={handleNext}
                  onCopy={handleCopy}
                  t={t}
                  language={language}
                />
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
