import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const QuestionCard = ({ question, onOptionToggle, selectedOptions, isAnswered, onSubmit }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">{question.chapter}</h2>
            <span className="text-xs text-gray-400">ID: {question.id}</span>
        </div>
        <p className="text-xl text-white font-medium mb-8 leading-relaxed">{question.question}</p>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            let buttonStyle = "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300";
            const isSelected = selectedOptions.includes(index);
            
            if (isAnswered) {
              if (question.correct_indices.includes(index)) {
                buttonStyle = "bg-green-500/20 border-green-500 text-green-200";
              } else if (isSelected) {
                buttonStyle = "bg-red-500/20 border-red-500 text-red-200";
              } else {
                buttonStyle = "bg-white/5 opacity-50 border-transparent";
              }
            } else if (isSelected) {
               buttonStyle = "bg-indigo-500/50 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]";
            }

            return (
              <button
                key={index}
                onClick={() => !isAnswered && onOptionToggle(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
              >
                <span>{option}</span>
                {isSelected && !isAnswered && <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
              </button>
            );
          })}
        </div>

        {!isAnswered && selectedOptions.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} /> Submit Answer
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default QuestionCard;
