import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Github, RefreshCw, Home } from 'lucide-react';

const EndScreen = ({ score, totalQuestions, onRestart, repoUrl, t }) => {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
        {t('quiz.completed')}
      </h1>
      
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl mb-8 w-full max-w-md">
        <p className="text-gray-300 mb-2">{t('quiz.score')}</p>
        <div className="text-6xl font-bold text-white mb-4">
          {score} <span className="text-2xl text-gray-400">/ {totalQuestions}</span>
        </div>
        <p className="text-indigo-200">
          {score === totalQuestions ? 'Perfect Score! 🎉' : 'Great job! Keep learning.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10"
        >
          <RefreshCw size={20} /> {t('quiz.restart')}
        </button>
        
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10"
        >
          <Home size={20} /> {t('quiz.return')}
        </button>

        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Github size={20} /> Star on GitHub
        </a>
      </div>
    </div>
  );
};

export default EndScreen;
