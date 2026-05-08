import React from 'react';
import { Info, Server, ShieldCheck, Code, Activity, Blocks, ListChecks, Shield, History } from 'lucide-react';
import { StatCard, ArticleCard, Badge } from '../components/ui';
import { mockCategories, mockCompliance } from '../data';

export const DashboardView = ({ activeTab, setActiveTab, tabArticles, handleNavigate, setSelectedCategory, isDarkMode }: any) => (
  <div className="max-w-5xl mx-auto p-6 lg:p-8 transition-colors">
    {/* Alert Bar */}
    <div className={`flex items-center gap-3 border px-4 py-3 rounded-lg mb-6 shadow-sm transition-colors ${isDarkMode ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
      <Info className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <p className="text-sm">
        <span className="font-semibold">Action Required:</span> 3 articles due for BSP compliance review this quarter. 
        <button className={`ml-2 font-semibold underline hover:opacity-80 ${isDarkMode ? 'decoration-blue-700' : 'decoration-blue-300'}`}>Review now</button>
      </p>
    </div>

    {/* Tabs */}
    <div className={`flex gap-6 border-b mb-6 px-1 overflow-x-auto whitespace-nowrap transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      {['Overview', 'My Articles', 'Pending Review', 'Compliance', 'Audit Trail'].map(tab => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab 
            ? (isDarkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-700') 
            : `border-transparent ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}`}
        >
          {tab}
        </button>
      ))}
    </div>

    {(activeTab === 'Overview' || activeTab === 'My Articles' || activeTab === 'Pending Review') && (
      <>
        {activeTab === 'Overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard title="Total Articles" value="312" subtext="↑ 14 this month" isDarkMode={isDarkMode} />
              <StatCard title="Pending Review" value="18" subtext="5 overdue" isDarkMode={isDarkMode} />
              <StatCard title="Compliance Coverage" value="94%" subtext="BSP, ISO 27001" isDarkMode={isDarkMode} />
              <StatCard title="Active Contributors" value="27" subtext="Across 4 teams" isDarkMode={isDarkMode} />
            </div>

            {/* Categories */}
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className={`text-xl font-serif ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Browse Categories</h3>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>6 categories</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCategories.map((cat, idx) => (
                  <button key={idx} onClick={() => { setSelectedCategory(cat.filterCategory); handleNavigate('browse'); }} className={`flex flex-col items-start p-4 border rounded-2xl transition-all text-left group transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500 active:bg-slate-800' : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-sm'}`}>
                    <div className={`p-2 rounded-lg mb-3 ${cat.colorClass}`}>
                      {cat.icon === 'Server' && <Server className="w-5 h-5" />}
                      {cat.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                      {cat.icon === 'Code' && <Code className="w-5 h-5" />}
                      {cat.icon === 'Activity' && <Activity className="w-5 h-5" />}
                      {cat.icon === 'Blocks' && <Blocks className="w-5 h-5" />}
                      {cat.icon === 'ListChecks' && <ListChecks className="w-5 h-5" />}
                    </div>
                    <h4 className={`text-sm font-semibold mb-1 group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{cat.title}</h4>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{cat.count}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent Articles / Tab Content */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className={`text-xl font-serif ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {activeTab === 'Overview' ? 'Recent & Pinned Articles' : `${activeTab}`}
            </h3>
            {activeTab === 'Overview' && <button onClick={() => handleNavigate('browse')} className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>View all</button>}
          </div>
          {tabArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
              {tabArticles.slice(0, activeTab === 'Overview' ? 4 : undefined).map((article: any) => (
                <ArticleCard key={article.id} article={article} onClick={() => handleNavigate('article', article.id)} isDarkMode={isDarkMode} />
              ))}
            </div>
          ) : (
              <div className={`p-8 text-center border rounded-2xl transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                No articles found.
              </div>
          )}
        </div>
      </>
    )}

    {activeTab === 'Compliance' && (
      <div className="mb-8">
        <h3 className={`text-xl font-serif mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Compliance Status</h3>
        <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {mockCompliance.map((item, i, arr) => (
            <div key={item.id} className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'} ${i !== arr.length - 1 ? (isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100') : ''}`}>
              <div className={`flex items-center gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Shield className="w-4 h-4 text-slate-400" />
                {item.text}
              </div>
              <Badge colorClass={`${item.color}`}>{item.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'Audit Trail' && (
      <div className={`border rounded-xl p-8 text-center shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <History className={`w-10 h-10 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-200'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Audit Trail</h3>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>View complete history of article modifications, approvals, and flags.</p>
        <button onClick={() => handleNavigate('audit')} className={`px-6 py-2.5 transition-colors rounded-lg text-sm font-semibold ${isDarkMode ? 'bg-blue-900/40 text-blue-400 hover:bg-blue-900/60' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>Open full trail</button>
      </div>
    )}

    <div className="h-8"></div>
  </div>
);
