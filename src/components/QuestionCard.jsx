import React from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, onOptionSelect, selectedOption, isAnswered }) => {
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

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonStyle = "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300";
            
            if (isAnswered) {
              if (question.correct_indices.includes(index)) {
                buttonStyle = "bg-green-500/20 border-green-500 text-green-200";
              } else if (selectedOption === index) {
                buttonStyle = "bg-red-500/20 border-red-500 text-red-200";
              } else {
                buttonStyle = "bg-white/5 opacity-50 border-transparent";
              }
            } else if (selectedOption === index) {
               buttonStyle = "bg-indigo-500/50 border-indigo-500 text-white";
            }

            return (
              <button
                key={index}
                onClick={() => !isAnswered && onOptionSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${buttonStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionCard;
