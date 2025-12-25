import React from 'react';
import { Github, Star } from 'lucide-react';

const Footer = ({ repoUrl }) => {
  return (
    <footer className="mt-12 py-6 text-center text-gray-400 border-t border-white/10">
      <div className="flex justify-center items-center gap-6">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Github size={18} />
          <span>View Source</span>
        </a>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
        >
          <Star size={18} />
          <span>Star Repo</span>
        </a>
      </div>
      <p className="text-xs mt-4 opacity-50">Built with React & Tailwind</p>
    </footer>
  );
};

export default Footer;
