import React from 'react';
import {
  Bell, Settings, Plus, LayoutDashboard, Search,
  Server, Cloud, Database, ShieldAlert, Activity, Code,
  GitBranch, Blocks, ListChecks, FileText, ClipboardSignature,
  BarChart as BarChartIcon, FilePlus, FileSearch, History, ArrowUpRight
} from 'lucide-react';
import { IconButton } from './ui';
import { mockActivities } from '../data';

export const Topbar = ({ handleNavigate, searchQuery, setSearchQuery, setShowNotifs, setShowSettings }: any) => (
  <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-10 w-full">
    <div className="flex items-center gap-3">
      <div className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md tracking-wider">
        PSBank I&E
      </div>
      <form 
        onSubmit={(e) => { e.preventDefault(); handleNavigate('browse'); }} 
        className="relative group hidden sm:block ml-4"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
        <input 
          id="main-search-input"
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search knowledge base..." 
          className="w-64 pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
        />
      </form>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={() => handleNavigate('editor')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
        <Plus className="w-4 h-4" /> New Article
      </button>
      <IconButton icon={Bell} onClick={() => setShowNotifs(true)} />
      <IconButton icon={Settings} onClick={() => setShowSettings(true)} />
      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs flex items-center justify-center ml-2 border border-blue-100">
        JD
      </div>
    </div>
  </header>
);

const SidebarItem = ({ icon: Icon, label, view, tabTarget, categoryTarget, onClickId, currentView, activeTab, setActiveTab, selectedCategory, setSelectedCategory, handleNavigate }: any) => {
  let active = false;
  if (view === 'dashboard') {
    active = currentView === 'dashboard' && (tabTarget ? activeTab === tabTarget : activeTab === 'Overview');
  } else if (view === 'browse') {
    active = currentView === 'browse' && (categoryTarget ? selectedCategory === categoryTarget : selectedCategory === 'All Categories');
  } else if (view) {
    active = currentView === view;
  }

  return (
    <button 
      onClick={() => {
        if (view) handleNavigate(view);
        if (tabTarget) {
          handleNavigate('dashboard');
          setActiveTab(tabTarget);
        }
        if (categoryTarget) {
          setSelectedCategory(categoryTarget);
        } else if (view === 'browse') {
          setSelectedCategory('All Categories');
        } else if (view === 'dashboard' && !tabTarget) {
          setActiveTab('Overview');
        }
        if (onClickId === 'search') {
          setTimeout(() => document.getElementById('main-search-input')?.focus(), 50);
        }
      }}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors group ${active ? 'bg-slate-200 text-slate-800 font-medium border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span>{label}</span>
      </div>
    </button>
  );
};

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mt-6 mb-2">
    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

export const Sidebar = (props: any) => {
  const itemProps = {
    currentView: props.currentView,
    activeTab: props.activeTab,
    setActiveTab: props.setActiveTab,
    selectedCategory: props.selectedCategory,
    setSelectedCategory: props.setSelectedCategory,
    handleNavigate: props.handleNavigate
  };

  return (
    <aside className="w-60 bg-slate-100 border-r border-slate-200 flex-shrink-0 overflow-y-auto hidden md:block">
      <div className="p-3 space-y-0.5">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" view="dashboard" {...itemProps} />
        <SidebarItem icon={Search} label="Browse Articles" view="browse" onClickId="search" {...itemProps} />

        <SidebarSection title="Infrastructure">
          <SidebarItem icon={Server} label="Network & Servers" view="browse" categoryTarget="Network" {...itemProps} />
          <SidebarItem icon={Cloud} label="Cloud & Hybrid" view="browse" categoryTarget="Cloud & Hybrid" {...itemProps} />
          <SidebarItem icon={Database} label="Databases" view="browse" categoryTarget="Databases" {...itemProps} />
          <SidebarItem icon={ShieldAlert} label="Security Ops" view="browse" categoryTarget="Security" {...itemProps} />
          <SidebarItem icon={Activity} label="DR & BCP" view="browse" categoryTarget="DR/BCP" {...itemProps} />
        </SidebarSection>

        <SidebarSection title="Engineering">
          <SidebarItem icon={Code} label="Dev Standards" view="browse" categoryTarget="Engineering" {...itemProps} />
          <SidebarItem icon={GitBranch} label="CI/CD & DevOps" view="browse" categoryTarget="CI/CD & DevOps" {...itemProps} />
          <SidebarItem icon={Blocks} label="API Catalog" view="browse" categoryTarget="API Catalog" {...itemProps} />
          <SidebarItem icon={ListChecks} label="Change Mgmt" view="browse" categoryTarget="Change Mgmt" {...itemProps} />
        </SidebarSection>

        <SidebarSection title="Governance">
          <SidebarItem icon={FileText} label="Policies & SOPs" view="browse" categoryTarget="Policies & SOPs" {...itemProps} />
          <SidebarItem icon={ClipboardSignature} label="Audit Logs" view="audit" {...itemProps} />
          <SidebarItem icon={BarChartIcon} label="Analytics" view="analytics" {...itemProps} />
        </SidebarSection>
      </div>
    </aside>
  );
};

export const RightPanel = ({ handleNavigate, setActiveTab }: any) => (
  <aside className="w-72 bg-slate-100 border-l border-slate-200 flex-shrink-0 overflow-y-auto hidden lg:block">
    <div className="p-5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {mockActivities.map((item, i) => (
          <div key={item.id} className="flex gap-3">
            <div className="mt-1.5 relative flex justify-center">
              <div className={`w-2 h-2 rounded-full ${item.color} z-10`}></div>
              {i !== mockActivities.length - 1 && <div className="absolute top-2 w-px h-full bg-slate-200"></div>}
            </div>
            <div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.text}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-3">Quick Links</h3>
      <div className="space-y-1">
        <button onClick={() => handleNavigate('editor')} className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-200 text-slate-600 transition-colors">
          <div className="flex items-center gap-3"><FilePlus className="w-4 h-4 text-slate-400" /><span>Submit new article</span></div>
        </button>
        <button onClick={() => { handleNavigate('dashboard'); setActiveTab('Pending Review'); }} className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-200 text-slate-600 transition-colors">
          <div className="flex items-center gap-3"><FileSearch className="w-4 h-4 text-slate-400" /><span>Request review</span></div>
        </button>
        <button onClick={() => handleNavigate('audit')} className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-200 text-slate-600 transition-colors">
          <div className="flex items-center gap-3"><History className="w-4 h-4 text-slate-400" /><span>View audit trail</span></div>
        </button>
      </div>

      <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <h3 className="text-xs font-semibold text-slate-800 mb-3">Your Contributions</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-200">
            <span className="text-slate-600">Authored</span>
            <span className="font-semibold text-slate-800">8</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200">
            <span className="text-slate-600">Pending review</span>
            <span className="font-semibold text-slate-800">2</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600">Drafts</span>
            <span className="font-semibold text-slate-800">1</span>
          </div>
        </div>
        <button onClick={() => handleNavigate('editor')} className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
          Open Editor <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  </aside>
);
