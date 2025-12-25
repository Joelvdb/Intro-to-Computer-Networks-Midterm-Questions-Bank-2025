import React from 'react';
import { motion } from 'framer-motion';
import { Copy, MessageCircle, ArrowRight } from 'lucide-react';

const Feedback = ({ isCorrect, explanation, onNext, onReport, onCopy }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 p-6 rounded-2xl border backdrop-blur-sm ${
        isCorrect 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${isCorrect ? 'bg-green-400' : 'bg-red-400'}`} />
        <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
      </div>
      
      <p className="text-gray-300 mb-6 leading-relaxed">{explanation}</p>

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={onCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors border border-white/10"
          >
            <Copy size={16} /> <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={onReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-sm text-green-400 transition-colors border border-green-500/20"
          >
            <MessageCircle size={16} /> <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
        
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-500/20"
        >
          Next <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default Feedback;
