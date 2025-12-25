import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Github, Star, RefreshCw } from 'lucide-react';

const EndScreen = ({ score, totalQuestions, onRestart, repoUrl }) => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
        Quiz Completed!
      </h1>
      
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl mb-8 w-full max-w-md">
        <p className="text-gray-300 mb-2">Your Score</p>
        <div className="text-6xl font-bold text-white mb-4">
          {score} <span className="text-2xl text-gray-400">/ {totalQuestions}</span>
        </div>
        <p className="text-indigo-200">
          {score === totalQuestions ? 'Perfect Score! 🎉' : 'Great job! Keep learning.'}
        </p>
      </div>

      <p className="text-xl text-gray-300 mb-8">Hope you enjoyed the quiz!</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10"
        >
          <RefreshCw size={20} /> Restart Quiz
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
