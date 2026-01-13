import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BrainCircuit, Globe } from 'lucide-react';

export default function Login() {
  const { login, currentUser } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to log in", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Language Toggle */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium z-10"
      >
        <Globe size={18} />
        <span>{language === 'he' ? 'English' : 'עברית'}</span>
      </button>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-500/20 rounded-2xl mb-4 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-500/30">
            <BrainCircuit className="text-indigo-400" size={48} />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-center">
            {t('appName')}
          </h1>
          <p className="text-gray-400 mt-2 text-center">
            {t('login.subtitle')}
          </p>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {t('login.signInGoogle')}
        </button>
      </div>
    </div>
  );
}
