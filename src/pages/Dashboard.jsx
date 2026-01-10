import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { BrainCircuit, Plus, FileText, LogOut, Trash2, Edit2, X, AlertTriangle, Globe } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [deletingQuiz, setDeletingQuiz] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, [currentUser]);

  async function fetchQuizzes() {
    if (!currentUser) return;
    
    try {
      const q = query(collection(db, "quizzes"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });
      // Sort by createdAt desc locally since we don't have a composite index yet
      quizzes.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setUserQuizzes(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  async function handleDelete() {
    if (!deletingQuiz) return;
    
    try {
      await deleteDoc(doc(db, "quizzes", deletingQuiz.id));
      setUserQuizzes(prev => prev.filter(q => q.id !== deletingQuiz.id));
      setDeletingQuiz(null);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  }

  async function handleUpdateTitle() {
    if (!editingQuiz || !newTitle.trim()) return;

    try {
      await updateDoc(doc(db, "quizzes", editingQuiz.id), {
        title: newTitle.trim()
      });
      
      setUserQuizzes(prev => prev.map(q => 
        q.id === editingQuiz.id ? { ...q, title: newTitle.trim() } : q
      ));
      
      setEditingQuiz(null);
      setNewTitle("");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  }

  const openEditModal = (e, quiz) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingQuiz(quiz);
    setNewTitle(quiz.title);
  };

  const openDeleteModal = (e, quiz) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingQuiz(quiz);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <BrainCircuit className="text-indigo-400" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('appName')}</h1>
              <p className="text-xs text-indigo-300/70">{t('dashboard.title')}</p>
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
            <span className="text-sm text-gray-400 hidden sm:inline">{currentUser?.email}</span>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
              title={t('dashboard.logout')}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t('dashboard.yourQuizzes')}</h2>
            <Link 
              to="/upload" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus size={20} />
              <span>{t('dashboard.newQuiz')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Quiz */}
            <Link to="/quiz/default" className="group">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:border-indigo-500/50 h-full flex flex-col relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                    {t('dashboard.official')}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition-colors">{t('dashboard.midtermTitle')}</h3>
                <p className="text-sm text-gray-400 mb-4 flex-grow">{t('dashboard.midtermDesc')}</p>
                <div className="text-xs text-gray-500">
                  ~150 Questions
                </div>
              </div>
            </Link>

            {/* User Quizzes */}
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">{t('dashboard.loading')}</div>
            ) : (
              userQuizzes.map(quiz => (
                <Link key={quiz.id} to={`/quiz/${quiz.id}`} className="group relative">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:border-emerald-500/50 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <FileText size={24} />
                      </div>
                      <div className="flex gap-2">
                         <button 
                          onClick={(e) => openEditModal(e, quiz)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title={t('dashboard.editTitle')}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => openDeleteModal(e, quiz)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title={t('dashboard.delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors pr-8">{quiz.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 flex-grow truncate">{t('dashboard.generatedFrom')} {quiz.fileName}</p>
                    <div className="text-xs text-gray-500 flex justify-between items-center">
                      <span>{new Date(quiz.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400">{quiz.questions?.length || 0} Qs</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {deletingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setDeletingQuiz(null)}>
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-6 text-red-400">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">{t('dashboard.deleteTitle')}</h2>
              </div>
              <p className="text-gray-300 mb-6">
                {t('dashboard.deleteConfirm')} <span className="font-bold text-white">"{deletingQuiz.title}"</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeletingQuiz(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                >
                  {t('dashboard.cancel')}
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-500/20"
                >
                  {t('dashboard.delete')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Title Modal */}
        {editingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setEditingQuiz(null)}>
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">{t('dashboard.editTitle')}</h2>
                <button onClick={() => setEditingQuiz(null)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('dashboard.enterTitle')}</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setEditingQuiz(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                >
                  {t('dashboard.cancel')}
                </button>
                <button 
                  onClick={handleUpdateTitle}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                  {t('dashboard.save')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
