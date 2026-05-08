import React, { useState } from 'react';
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
  const ITEMS_PER_PAGE = 6;

  React.useEffect(() => {
    setBrowsePage(1);
  }, [searchQuery, selectedCategory]);

  React.useEffect(() => {
    setArticlePage(1);
  }, [selectedArticleId]);

  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleNavigate = (view: 'dashboard' | 'browse' | 'article' | 'editor' | 'audit' | 'analytics', id?: string) => {
    setCurrentView(view);
    if (id) setSelectedArticleId(id);
    else setSelectedArticleId(null);
  };

  const selectedArticle = mockArticles.find(a => a.id === selectedArticleId);

  // Derived state
  let filteredArticles = mockArticles;
  if (searchQuery) filteredArticles = filteredArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
  if (selectedCategory !== 'All Categories') filteredArticles = filteredArticles.filter(a => a.category === selectedCategory);
  
  // Tab filtered articles for dashboard
  let tabArticles = mockArticles;
  if (activeTab === 'My Articles') tabArticles = mockArticles.filter(a => a.author === 'JD');
  if (activeTab === 'Pending Review') tabArticles = mockArticles.filter(a => a.status === 'Pending');

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Topbar 
        handleNavigate={handleNavigate} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setShowNotifs={setShowNotifs} 
        setShowSettings={setShowSettings} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentView={currentView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleNavigate={handleNavigate}
        />
        <main className="flex-1 overflow-y-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabArticles={tabArticles}
              handleNavigate={handleNavigate}
              setSelectedCategory={setSelectedCategory}
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
            />
          )}
          {currentView === 'article' && (
            <ArticleDetailView 
              selectedArticle={selectedArticle}
              articlePage={articlePage}
              setArticlePage={setArticlePage}
              handleNavigate={handleNavigate}
            />
          )}
          {currentView === 'editor' && <EditorView onNavigate={handleNavigate} />}
          {currentView === 'audit' && <AuditView />}
          {currentView === 'analytics' && <AnalyticsView />}
        </main>
        {currentView !== 'editor' && currentView !== 'article' && (
          <RightPanel 
            handleNavigate={handleNavigate}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Theme</label>
                <select className="w-full border-slate-300 rounded-lg text-sm p-2 bg-slate-50">
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                  <option>System Default</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email Notifications</label>
                 <select className="w-full border-slate-300 rounded-lg text-sm p-2 bg-slate-50">
                  <option>All activity</option>
                  <option>Mentions only</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Popover */}
      {showNotifs && (
        <div className="fixed inset-0 z-50" onClick={() => setShowNotifs(false)}>
          <div className="absolute top-14 right-16 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
              <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-auto">
              <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                <p className="text-sm text-slate-800 font-medium mb-0.5">Article Approved</p>
                <p className="text-xs text-slate-500">Your article "Setting up VPN" has been approved by Security.</p>
                <p className="text-[10px] text-slate-400 mt-2">10m ago</p>
              </div>
              <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                <p className="text-sm text-slate-800 font-medium mb-0.5">Review Requested</p>
                <p className="text-xs text-slate-500">AT requested your review on "Multi-Region Azure Deployment Guide".</p>
                <p className="text-[10px] text-slate-400 mt-2">1h ago</p>
              </div>
              <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                <p className="text-sm text-slate-800 font-medium mb-0.5">New Policy Published</p>
                <p className="text-xs text-slate-500">Please review the updated "Information Security Policy 2026".</p>
                <p className="text-[10px] text-slate-400 mt-2">1d ago</p>
              </div>
            </div>
            <div className="p-2 border-t border-slate-200 bg-slate-50 text-center">
              <button className="text-xs font-medium text-blue-600 hover:text-blue-800">Mark all as read</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
