import React, { useState } from 'react';
import {
  Bell, Settings, Plus, LayoutDashboard, BookOpen, Search,
  Server, Cloud, Database, ShieldAlert, Activity, Code,
  GitBranch, Blocks, ListChecks, FileText, ClipboardSignature,
  BarChart, Users, History, Info, Filter, Clock, Eye,
  ShieldCheck, Shield, FilePlus, FileSearch, Download, Lock,
  ArrowUpRight
} from 'lucide-react';

// --- Shared Components --- //

const Badge = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
    {children}
  </span>
);

const IconButton = ({ icon: Icon, children, className = '' }: { icon: any, children?: React.ReactNode, className?: string }) => (
  <button className={`flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors ${className}`}>
    <Icon className="w-4 h-4" />
    {children && <span className="text-sm font-medium">{children}</span>}
  </button>
);

// --- Layout Sections --- //

const Topbar = () => (
  <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
    <div className="flex items-center gap-3">
      <div className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md tracking-wider">
        PSBank I&E
      </div>
      <h1 className="text-sm font-semibold text-slate-800">Knowledge Base Portal</h1>
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
        <Plus className="w-4 h-4" /> New Article
      </button>
      <IconButton icon={Bell} />
      <IconButton icon={Settings} />
      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs flex items-center justify-center ml-2 border border-blue-100">
        JD
      </div>
    </div>
  </header>
);

const SidebarItem = ({ icon: Icon, label, active = false, badge }: { icon: any, label: string, active?: boolean, badge?: string }) => (
  <button className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors group ${active ? 'bg-slate-200 text-slate-800 font-medium border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span>{label}</span>
    </div>
    {badge && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded-full font-medium">{badge}</span>}
  </button>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mt-6 mb-2">
    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const Sidebar = () => (
  <aside className="w-60 bg-slate-100 border-r border-slate-200 flex-shrink-0 overflow-y-auto hidden md:block">
    <div className="p-3 space-y-0.5">
      <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
      <SidebarItem icon={BookOpen} label="Browse Articles" />
      <SidebarItem icon={Search} label="Search" />

      <SidebarSection title="Infrastructure">
        <SidebarItem icon={Server} label="Network & Servers" />
        <SidebarItem icon={Cloud} label="Cloud & Hybrid" />
        <SidebarItem icon={Database} label="Databases" />
        <SidebarItem icon={ShieldAlert} label="Security Ops" />
        <SidebarItem icon={Activity} label="DR & BCP" />
      </SidebarSection>

      <SidebarSection title="Engineering">
        <SidebarItem icon={Code} label="Dev Standards" />
        <SidebarItem icon={GitBranch} label="CI/CD & DevOps" />
        <SidebarItem icon={Blocks} label="API Catalog" />
        <SidebarItem icon={ListChecks} label="Change Mgmt" />
      </SidebarSection>

      <SidebarSection title="Governance">
        <SidebarItem icon={FileText} label="Policies & SOPs" />
        <SidebarItem icon={ClipboardSignature} label="Audit Logs" badge="New" />
        <SidebarItem icon={BarChart} label="Analytics" />
      </SidebarSection>

      <SidebarSection title="Admin">
        <SidebarItem icon={Users} label="Access Control" />
        <SidebarItem icon={History} label="Version History" />
      </SidebarSection>
    </div>
  </aside>
);

// --- Dashboard Widgets --- //

const StatCard = ({ title, value, subtext }: { title: string, value: string, subtext: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
    <p className="text-2xl font-serif font-semibold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500 mt-1">{subtext}</p>
  </div>
);

const CategoryCard = ({ icon: Icon, title, count, colorClass }: { icon: any, title: string, count: string, colorClass: string }) => (
  <button className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-sm transition-all text-left">
    <div className={`p-2 rounded-lg mb-3 ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
    <p className="text-xs text-slate-500">{count}</p>
  </button>
);

const ArticleCard = ({ title, version, badge, excerpt, metaBadge, date, views }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full">
    <div>
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{title}</h4>
        {version && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0 font-medium">{version}</span>}
        {badge && <Badge colorClass="bg-red-100 text-red-800 flex-shrink-0">{badge}</Badge>}
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{excerpt}</p>
    </div>
    <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
      <Badge colorClass={`${metaBadge.color}`}>{metaBadge.text}</Badge>
      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {date}</span>
      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {views}</span>
    </div>
  </div>
);

const RightPanel = () => (
  <aside className="w-72 bg-slate-100 border-l border-slate-200 flex-shrink-0 overflow-y-auto hidden lg:block">
    <div className="p-5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {[
          { text: 'JD updated "Core Banking Network Topology"', time: '2 hours ago', color: 'bg-blue-500' },
          { text: 'RS approved "DR Failover SOP v2.0"', time: 'Yesterday', color: 'bg-green-500' },
          { text: 'PCI DSS article flagged for review', time: '3 days ago', color: 'bg-amber-500' },
          { text: 'New P1 runbook published by MR', time: '5 days ago', color: 'bg-red-500' },
          { text: 'ISO 27001 policy article reviewed', time: '1 week ago', color: 'bg-slate-300' },
        ].map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-1.5 relative flex justify-center">
              <div className={`w-2 h-2 rounded-full ${item.color} z-10`}></div>
              {i !== 4 && <div className="absolute top-2 w-px h-full bg-slate-200"></div>}
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
        <SidebarItem icon={FilePlus} label="Submit new article" />
        <SidebarItem icon={FileSearch} label="Request review" />
        <SidebarItem icon={Download} label="Export to PDF" />
        <SidebarItem icon={Lock} label="Manage permissions" />
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
        <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
          Open Editor <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  </aside>
);

// --- Main App Component --- //

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Topbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
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
            <div className="flex gap-6 border-b border-slate-200 mb-6 px-1">
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

            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  placeholder="Search knowledge base... (e.g. firewall policy, DR runbook)" 
                  className="w-full pl-9 pr-4 py-3 text-sm bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <select className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm outline-none cursor-pointer">
                <option>All Categories</option>
                <option>Network</option>
                <option>Security</option>
                <option>Engineering</option>
              </select>
              <button className="flex items-center justify-center p-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>

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
                <CategoryCard icon={Server} title="Network & Infrastructure" count="84 articles · 12 pending" colorClass="bg-blue-100 text-blue-700" />
                <CategoryCard icon={ShieldCheck} title="Security & Compliance" count="71 articles · 3 pending" colorClass="bg-green-100 text-green-700" />
                <CategoryCard icon={Code} title="Engineering Standards" count="58 articles · 1 pending" colorClass="bg-indigo-100 text-indigo-700" />
                <CategoryCard icon={Activity} title="DR & Business Continuity" count="42 articles · 2 pending" colorClass="bg-amber-100 text-amber-700" />
                <CategoryCard icon={Blocks} title="API & Integration Catalog" count="37 articles · 0 pending" colorClass="bg-teal-100 text-teal-700" />
                <CategoryCard icon={ListChecks} title="SOPs & Policies" count="20 articles · 0 pending" colorClass="bg-rose-100 text-rose-700" />
              </div>
            </div>

            {/* Recent Articles */}
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-serif text-slate-800">Recent & Pinned Articles</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">View all</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                <ArticleCard 
                  title="Core Banking Network Topology" version="v3.2" 
                  excerpt="VLAN segmentation, firewall zones, and redundant link configuration for production banking networks."
                  metaBadge={{text: 'Network', color: 'bg-blue-100 text-blue-800'}}
                  date="2d ago" views="148"
                />
                <ArticleCard 
                  title="Incident Response Runbook — P1/P2" badge="Critical"
                  excerpt="Step-by-step escalation matrix, war room setup, comms templates, and regulatory notification timelines."
                  metaBadge={{text: 'Security', color: 'bg-amber-100 text-amber-800'}}
                  date="5d ago" views="312"
                />
                <ArticleCard 
                  title="DR Failover SOP — Core Banking System" version="v2.0"
                  excerpt="RTO/RPO targets, failover triggers, validation checklist, and BSP notification requirements."
                  metaBadge={{text: 'DR/BCP', color: 'bg-green-100 text-green-800'}}
                  date="1w ago" views="96"
                />
                <ArticleCard 
                  title="API Gateway — Auth & Rate Limiting Policy" version="v1.4"
                  excerpt="OAuth 2.0 flow, token expiry settings, rate limit tiers, and PCI DSS compliance mapping."
                  metaBadge={{text: 'Engineering', color: 'bg-indigo-100 text-indigo-800'}}
                  date="2w ago" views="74"
                />
              </div>
            </div>

            {/* Compliance Section */}
            <div className="mb-8">
              <h3 className="text-xl font-serif text-slate-800 mb-4">Compliance Status</h3>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {[
                  { text: 'BSP Circular 1140 — IT Risk Management', status: 'Covered', color: 'bg-green-100 text-green-800' },
                  { text: 'ISO/IEC 27001 — Information Security', status: 'Covered', color: 'bg-green-100 text-green-800' },
                  { text: 'PCI DSS v4.0 — Cardholder Data Environment', status: 'Partial', color: 'bg-amber-100 text-amber-800' },
                  { text: 'BSP MORB — Operational Risk Controls', status: 'Review Due', color: 'bg-red-100 text-red-800' }
                ].map((item, i, arr) => (
                  <div key={i} className={`flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <Shield className="w-4 h-4 text-slate-400" />
                      {item.text}
                    </div>
                    <Badge colorClass={`${item.color}`}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Padding at bottom for spacing */}
            <div className="h-8"></div>

          </div>
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
