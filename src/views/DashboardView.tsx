import React from 'react';
import { Info, Server, ShieldCheck, Code, Activity, Blocks, ListChecks, Shield, History } from 'lucide-react';
import { StatCard, ArticleCard, Badge } from '../components/ui';
import { mockCategories, mockCompliance } from '../data';

export const DashboardView = ({ activeTab, setActiveTab, tabArticles, handleNavigate, setSelectedCategory }: any) => (
  <div className="max-w-5xl mx-auto p-6 lg:p-8">
    {/* Alert Bar */}
    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
      <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />
      <p className="text-sm">
        <span className="font-semibold">Action Required:</span> 3 articles due for BSP compliance review this quarter. 
        <button className="ml-2 font-semibold underline decoration-blue-300 hover:text-blue-900">Review now</button>
      </p>
    </div>

    {/* Tabs */}
    <div className="flex gap-6 border-b border-slate-200 mb-6 px-1 overflow-x-auto whitespace-nowrap">
      {['Overview', 'My Articles', 'Pending Review', 'Compliance', 'Audit Trail'].map(tab => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
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
              <StatCard title="Total Articles" value="312" subtext="↑ 14 this month" />
              <StatCard title="Pending Review" value="18" subtext="5 overdue" />
              <StatCard title="Compliance Coverage" value="94%" subtext="BSP, ISO 27001" />
              <StatCard title="Active Contributors" value="27" subtext="Across 4 teams" />
            </div>

            {/* Categories */}
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-serif text-slate-800">Browse Categories</h3>
                <span className="text-xs text-slate-500 font-medium">6 categories</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCategories.map((cat, idx) => (
                  <button key={idx} onClick={() => { setSelectedCategory(cat.filterCategory); handleNavigate('browse'); }} className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-sm transition-all text-left group">
                    <div className={`p-2 rounded-lg mb-3 ${cat.colorClass}`}>
                      {cat.icon === 'Server' && <Server className="w-5 h-5" />}
                      {cat.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                      {cat.icon === 'Code' && <Code className="w-5 h-5" />}
                      {cat.icon === 'Activity' && <Activity className="w-5 h-5" />}
                      {cat.icon === 'Blocks' && <Blocks className="w-5 h-5" />}
                      {cat.icon === 'ListChecks' && <ListChecks className="w-5 h-5" />}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{cat.title}</h4>
                    <p className="text-xs text-slate-500">{cat.count}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent Articles / Tab Content */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-xl font-serif text-slate-800">
              {activeTab === 'Overview' ? 'Recent & Pinned Articles' : `${activeTab}`}
            </h3>
            {activeTab === 'Overview' && <button onClick={() => handleNavigate('browse')} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">View all</button>}
          </div>
          {tabArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
              {tabArticles.slice(0, activeTab === 'Overview' ? 4 : undefined).map((article: any) => (
                <React.Fragment key={article.id}>
                  <ArticleCard article={article} onClick={() => handleNavigate('article', article.id)} />
                </React.Fragment>
              ))}
            </div>
          ) : (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
                No articles found.
              </div>
          )}
        </div>
      </>
    )}

    {activeTab === 'Compliance' && (
      <div className="mb-8">
        <h3 className="text-xl font-serif text-slate-800 mb-4">Compliance Status</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {mockCompliance.map((item, i, arr) => (
            <div key={item.id} className={`flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
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
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
        <History className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-2">Audit Trail</h3>
        <p className="text-sm text-slate-500 mb-4">View complete history of article modifications, approvals, and flags.</p>
        <button onClick={() => handleNavigate('audit')} className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors rounded-lg text-sm font-medium">Open full trail</button>
      </div>
    )}

    <div className="h-8"></div>
  </div>
);
