import React from 'react';
import { Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto py-6 text-center text-gray-400 border-t border-white/10 w-full">
      <div className="flex justify-center items-center gap-6">
        <a
          href="https://www.bitpay.co.il/app/me/A0201943-552D-9A21-0580-54BA6B7D9A77D4C3" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full transition-all border border-yellow-400/20 hover:border-yellow-400/50"
        >
          <Coffee size={18} />
          <span className="font-medium">{t('footer.buyCoffee')}</span>
        </a>
      </div>
      <p className="text-xs mt-4 opacity-50">{t('footer.builtWith')}</p>
    </footer>
  );
};

export default Footer;
