import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { mockArticles } from './data';
import { Topbar, Sidebar, RightPanel } from './components/layout';
import { DashboardView } from './views/DashboardView';
import { BrowseView } from './views/BrowseView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { EditorView } from './views/EditorView';
import { AuditView } from './views/AuditView';
import { AnalyticsView } from './views/AnalyticsView';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'browse' | 'article' | 'editor' | 'audit' | 'analytics'>('dashboard');
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [browsePage, setBrowsePage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);
  const [articles, setArticles] = useState<any[]>(mockArticles);
  const ITEMS_PER_PAGE = 6;

  const fetchArticles = () => {
    return fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    setBrowsePage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setArticlePage(1);
  }, [selectedArticleId]);

  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleNavigate = (view: 'dashboard' | 'browse' | 'article' | 'editor' | 'audit' | 'analytics', id?: string) => {
    setCurrentView(view);
    if (id) setSelectedArticleId(id);
    else setSelectedArticleId(null);
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  // Derived state
  let filteredArticles = articles.filter(a => a.status === 'Published');
  if (searchQuery) filteredArticles = filteredArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
  if (selectedCategory !== 'All Categories') filteredArticles = filteredArticles.filter(a => a.category === selectedCategory);
  
  // Tab filtered articles for dashboard
  let tabArticles = articles;
  if (activeTab === 'My Articles') tabArticles = articles.filter(a => a.author === 'JD');
  else if (activeTab === 'Pending Review') tabArticles = articles.filter(a => a.status === 'Pending');
  else tabArticles = articles.filter(a => a.status === 'Published');

  return (
    <div className={`flex flex-col h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      <Topbar 
        handleNavigate={handleNavigate} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setShowNotifs={setShowNotifs} 
        setShowSettings={setShowSettings} 
        isDarkMode={isDarkMode}
      />
      
      <div className="flex flex-1 overflow-hidden bg-inherit">
        <Sidebar 
          currentView={currentView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleNavigate={handleNavigate}
          isDarkMode={isDarkMode}
        />
        <main className="flex-1 overflow-y-auto w-full bg-inherit">
          {currentView === 'dashboard' && (
            <DashboardView 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabArticles={tabArticles}
              handleNavigate={handleNavigate}
              setSelectedCategory={setSelectedCategory}
              isDarkMode={isDarkMode}
            />
          )}
          {currentView === 'browse' && (
            <BrowseView 
              filteredArticles={filteredArticles}
              browsePage={browsePage}
              setBrowsePage={setBrowsePage}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              handleNavigate={handleNavigate}
              isDarkMode={isDarkMode}
            />
          )}
          {currentView === 'article' && (
            <ArticleDetailView 
              selectedArticle={selectedArticle}
              articlePage={articlePage}
              setArticlePage={setArticlePage}
              handleNavigate={handleNavigate}
              isDarkMode={isDarkMode}
            />
          )}
          {currentView === 'editor' && <EditorView onNavigate={handleNavigate} isDarkMode={isDarkMode} refreshArticles={fetchArticles} />}
          {currentView === 'audit' && <AuditView isDarkMode={isDarkMode} />}
          {currentView === 'analytics' && <AnalyticsView isDarkMode={isDarkMode} />}
        </main>
        {currentView !== 'editor' && currentView !== 'article' && (
          <RightPanel 
            handleNavigate={handleNavigate}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all scale-100`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} block mb-2`}>Display Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!isDarkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <div>
                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} block mb-2`}>Email Notifications</label>
                 <select className={`w-full ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300'} border rounded-xl text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}>
                  <option>All activity</option>
                  <option>Mentions only</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
            <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'} text-right`}>
              <button onClick={() => setShowSettings(false)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Popover */}
      {showNotifs && (
        <div className="fixed inset-0 z-50" onClick={() => setShowNotifs(false)}>
          <div className={`absolute top-14 right-4 sm:right-16 w-80 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'} rounded-2xl shadow-2xl border overflow-hidden transition-all`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
              <h3 className="font-semibold text-sm">Notifications</h3>
              <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4"/></button>
            </div>
            <div className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'} max-h-96 overflow-auto`}>
              <div className={`p-4 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} cursor-pointer transition-colors`}>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Article Approved</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your article "Setting up VPN" has been approved by Security.</p>
                <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>10m ago</p>
              </div>
              <div className={`p-4 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} cursor-pointer transition-colors`}>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Review Requested</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AT requested your review on "Multi-Region Azure Deployment Guide".</p>
                <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>1h ago</p>
              </div>
              <div className={`p-4 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} cursor-pointer transition-colors`}>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>New Policy Published</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Please review the updated "Information Security Policy 2026".</p>
                <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>1d ago</p>
              </div>
            </div>
            <div className={`p-3 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'} text-center`}>
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">Mark all as read</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
