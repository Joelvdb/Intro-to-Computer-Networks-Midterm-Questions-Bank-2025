import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db, functions } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { BrainCircuit, Upload as UploadIcon, Loader2, AlertCircle, FileText, Globe } from 'lucide-react';

export default function Upload() {
  const { currentUser } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setTitle(droppedFile.name.replace('.pdf', ''));
        setError("");
      } else {
        setError(t('upload.fileType'));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.replace('.pdf', ''));
      setError("");
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const generateQuestions = async (file, title) => {
    const fileBase64 = await fileToBase64(file);
    const generateQuizFn = httpsCallable(functions, 'generateQuiz');
    
    const result = await generateQuizFn({ 
      fileBase64,
      title: title || file.name.replace('.pdf', '')
    });
    return result.data.quizId;
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError("");
    
    try {
      setStatus(t('upload.uploading'));
      // The backend now handles generation AND saving to Firestore
      const quizId = await generateQuestions(file, title);
      
      setStatus(t('upload.saving'));
      // No need to write to DB here anymore

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(t('upload.error') + " " + err.message);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white font-sans flex items-center justify-center p-4">
      
      {/* ... (Language Toggle) ... */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white flex items-center gap-2"
        title="Switch Language"
      >
        <Globe size={20} />
        <span className="text-xs hidden sm:inline">{language === 'he' ? 'EN' : 'עב'}</span>
      </button>

      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <BrainCircuit className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold">{t('upload.title')}</h1>
        </div>

        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : 'border-white/20 hover:border-indigo-500/50 bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="hidden" 
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4 w-full h-full">
              <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-indigo-500 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                <UploadIcon size={32} />
              </div>
              <div>
                <span className="text-indigo-400 font-bold hover:underline">{t('upload.clickUpload')}</span>
                <span className="text-gray-400"> {t('upload.dragDrop')}</span>
              </div>
              <p className="text-xs text-gray-500">{t('upload.fileType')}</p>
            </label>
          </div>

          {file && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center text-red-400 text-xs font-bold">PDF</div>
                <span className="text-sm truncate flex-grow">{file.name}</span>
                <button onClick={() => { setFile(null); setTitle(""); }} className="text-gray-400 hover:text-white">×</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload.quizTitle')}</label>
                <div className="relative">
                  <FileText className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${language === 'he' ? 'right-3' : 'left-3'}`} size={16} />
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors ${language === 'he' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    placeholder={t('upload.enterQuizTitle')}
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3">
             <button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            >
              {t('upload.cancel')}
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`flex-[2] py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                !file || loading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>{status}</span>
                </>
              ) : (
                t('upload.generate')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
