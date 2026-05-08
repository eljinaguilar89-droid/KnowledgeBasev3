import React, { useState } from 'react';
import {
  Bell, Settings, Plus, LayoutDashboard, BookOpen, Search,
  Server, Cloud, Database, ShieldAlert, Activity, Code,
  GitBranch, Blocks, ListChecks, FileText, ClipboardSignature,
  BarChart as BarChartIcon, Users, History, Info, Filter, Clock, Eye,
  ShieldCheck, Shield, FilePlus, FileSearch, Download, Lock,
  ArrowUpRight, ArrowLeft, Send,
  Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, UploadCloud, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockArticles, mockCategories, mockActivities, mockCompliance, mockAuditLogs } from './data';

// --- Shared Components --- //

const Badge = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
    {children}
  </span>
);

const IconButton = ({ icon: Icon, children, className = '', onClick }: { icon: any, children?: React.ReactNode, className?: string, onClick?: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors ${className}`}>
    <Icon className="w-4 h-4" />
    {children && <span className="text-sm font-medium">{children}</span>}
  </button>
);

// --- Layout Sections --- //

const EditorView = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Network');
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length) setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };
  
  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const handleSave = (status: 'Draft' | 'Pending') => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const contentStr = contentRef.current?.innerText || 'No content provided.';
    
    mockArticles.unshift({
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      version: 'v1.0',
      badge: status === 'Draft' ? 'Draft' : '',
      excerpt: contentStr.substring(0, 80) + '...',
      content: contentStr,
      category: category,
      categoryColor: 'bg-blue-100 text-blue-800',
      categoryIcon: 'FileText',
      author: 'JD',
      status: status,
      date: 'Just now',
      views: 0
    });
    
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-serif text-slate-800 mb-6">Create New Article</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Article Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Setting up VPN on MacOS" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <optgroup label="Infrastructure">
                  <option>Network</option>
                  <option>Cloud & Hybrid</option>
                  <option>Databases</option>
                  <option>Security</option>
                  <option>DR/BCP</option>
                </optgroup>
                <optgroup label="Engineering">
                  <option>Engineering</option>
                  <option>CI/CD & DevOps</option>
                  <option>API Catalog</option>
                  <option>Change Mgmt</option>
                </optgroup>
                <optgroup label="Governance">
                  <option>Policies & SOPs</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
              <input type="text" placeholder="e.g. guides, setup, mac" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Article Content</label>
            <div className="bg-slate-50 border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-b border-slate-300 p-2 bg-slate-100 flex-wrap">
                <select 
                  className="bg-transparent text-sm border border-slate-300 outline-none cursor-pointer hover:bg-slate-200 p-1.5 rounded mr-1 text-slate-700 focus:ring-1 focus:ring-blue-500" 
                  onChange={(e) => { 
                    if(e.target.value) execCmd('formatBlock', e.target.value); 
                    e.target.value = '';
                  }}
                >
                  <option value="">Format...</option>
                  <option value="H1">Heading 1</option>
                  <option value="H2">Subheading 1 (H2)</option>
                  <option value="H3">Subheading 2 (H3)</option>
                  <option value="P">Paragraph</option>
                  <option value="PRE">Code Block</option>
                </select>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <IconButton icon={Bold} onClick={() => execCmd('bold')} className="hover:bg-slate-200" />
                <IconButton icon={Italic} onClick={() => execCmd('italic')} className="hover:bg-slate-200" />
                <IconButton icon={Underline} onClick={() => execCmd('underline')} className="hover:bg-slate-200" />
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <IconButton icon={List} onClick={() => execCmd('insertUnorderedList')} className="hover:bg-slate-200" />
                <IconButton icon={ListOrdered} onClick={() => execCmd('insertOrderedList')} className="hover:bg-slate-200" />
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <IconButton icon={Link} onClick={() => { const url = prompt('URL:'); if(url) execCmd('createLink', url); }} className="hover:bg-slate-200" />
                <IconButton icon={ImageIcon} className="hover:bg-slate-200" />
              </div>
              
              {/* Editable Area */}
              <div 
                ref={contentRef}
                className="w-full min-h-[300px] p-4 bg-white focus:outline-none prose prose-slate max-w-none text-sm cursor-text"
                contentEditable
                suppressContentEditableWarning
                placeholder="Write your article content here..."
              ></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}
            >
              <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => {
                if(e.target.files) setFiles([...files, ...Array.from(e.target.files)]);
              }} />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                <UploadCloud className={`w-10 h-10 mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                <p className="text-sm text-slate-700 mb-1"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">PDF, DOC, images up to 10MB</p>
              </label>
            </div>
            
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <span className="truncate max-w-[80%] text-slate-700 font-medium">{file.name}</span>
                    <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </div>
        
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <button onClick={() => onNavigate('dashboard')} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => handleSave('Draft')} className="px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">Save as Draft</button>
          <button onClick={() => handleSave('Pending')} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Send className="w-4 h-4" /> Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'browse' | 'article' | 'editor' | 'audit' | 'analytics'>('dashboard');
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleNavigate = (view: 'dashboard' | 'browse' | 'article' | 'editor' | 'audit' | 'analytics', id?: string) => {
    setCurrentView(view);
    if (id) setSelectedArticleId(id);
    else setSelectedArticleId(null);
  };

  const selectedArticle = mockArticles.find(a => a.id === selectedArticleId);

  // Derived state
  let filteredArticles = mockArticles.filter(a => a.status === 'Published');
  if (searchQuery) filteredArticles = filteredArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
  if (selectedCategory !== 'All Categories') filteredArticles = filteredArticles.filter(a => a.category === selectedCategory);
  
  // Tab filtered articles for dashboard
  let tabArticles = mockArticles;
  if (activeTab === 'Overview') tabArticles = mockArticles.filter(a => a.status === 'Published');
  if (activeTab === 'My Articles') tabArticles = mockArticles.filter(a => a.author === 'JD');
  if (activeTab === 'Pending Review') tabArticles = mockArticles.filter(a => a.status === 'Pending');

  const renderTopbar = () => (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md tracking-wider">
          PSBank I&E
        </div>
        <h1 className="text-sm font-semibold text-slate-800">Knowledge Base Portal</h1>
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

  const renderSidebarItem = ({ icon: Icon, label, view, tabTarget, categoryTarget, onClickId }: { icon: any, label: string, view?: any, tabTarget?: string, categoryTarget?: string, onClickId?: string }) => {
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

  const renderSidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-6 mb-2">
      <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );

  const renderSidebar = () => (
    <aside className="w-60 bg-slate-100 border-r border-slate-200 flex-shrink-0 overflow-y-auto hidden md:block">
      <div className="p-3 space-y-0.5">
        {renderSidebarItem({ icon: LayoutDashboard, label: "Dashboard", view: "dashboard" })}
        {renderSidebarItem({ icon: Search, label: "Browse Articles", view: "browse", onClickId: "search" })}

        {renderSidebarSection({
          title: "Infrastructure",
          children: (
            <>
              {renderSidebarItem({ icon: Server, label: "Network & Servers", view: "browse", categoryTarget: "Network" })}
              {renderSidebarItem({ icon: Cloud, label: "Cloud & Hybrid", view: "browse", categoryTarget: "Cloud & Hybrid" })}
              {renderSidebarItem({ icon: Database, label: "Databases", view: "browse", categoryTarget: "Databases" })}
              {renderSidebarItem({ icon: ShieldAlert, label: "Security Ops", view: "browse", categoryTarget: "Security" })}
              {renderSidebarItem({ icon: Activity, label: "DR & BCP", view: "browse", categoryTarget: "DR/BCP" })}
            </>
          )
        })}

        {renderSidebarSection({
          title: "Engineering",
          children: (
            <>
              {renderSidebarItem({ icon: Code, label: "Dev Standards", view: "browse", categoryTarget: "Engineering" })}
              {renderSidebarItem({ icon: GitBranch, label: "CI/CD & DevOps", view: "browse", categoryTarget: "CI/CD & DevOps" })}
              {renderSidebarItem({ icon: Blocks, label: "API Catalog", view: "browse", categoryTarget: "API Catalog" })}
              {renderSidebarItem({ icon: ListChecks, label: "Change Mgmt", view: "browse", categoryTarget: "Change Mgmt" })}
            </>
          )
        })}

        {renderSidebarSection({
          title: "Governance",
          children: (
            <>
              {renderSidebarItem({ icon: FileText, label: "Policies & SOPs", view: "browse", categoryTarget: "Policies & SOPs" })}
              {renderSidebarItem({ icon: ClipboardSignature, label: "Audit Logs", view: "audit" })}
              {renderSidebarItem({ icon: BarChartIcon, label: "Analytics", view: "analytics" })}
            </>
          )
        })}
      </div>
    </aside>
  );

  const renderRightPanel = () => (
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

  const renderStatCard = ({ title, value, subtext }: any) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-serif font-semibold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </div>
  );

  const renderArticleCard = ({ article }: any) => (
    <div onClick={() => handleNavigate('article', article.id)} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-2 gap-2">
          <h4 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h4>
          {article.version && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0 font-medium">{article.version}</span>}
          {article.badge && <Badge colorClass="bg-red-100 text-red-800 flex-shrink-0">{article.badge}</Badge>}
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{article.excerpt}</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
        <Badge colorClass={article.categoryColor || 'bg-slate-100 text-slate-800'}>{article.category}</Badge>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.date}</span>
        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.views}</span>
      </div>
    </div>
  );

  // --- Views --- //
  
  const renderAnalyticsView = () => {
    const viewData = [
      { name: 'Mon', views: 400 },
      { name: 'Tue', views: 300 },
      { name: 'Wed', views: 550 },
      { name: 'Thu', views: 450 },
      { name: 'Fri', views: 700 },
      { name: 'Sat', views: 200 },
      { name: 'Sun', views: 150 },
    ];
    
    const categoryData = [
      { name: 'Network', value: 84 },
      { name: 'Security', value: 71 },
      { name: 'Engineering', value: 58 },
      { name: 'DR/BCP', value: 42 },
    ];
    const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];

    return (
      <div className="max-w-5xl mx-auto py-8 px-6">
        <h2 className="text-2xl font-serif text-slate-800 mb-6">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-800 mb-4">Views Over Past 7 Days</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-800 mb-4">Articles by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAuditView = () => (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <h2 className="text-2xl font-serif text-slate-800 mb-6">Audit Trail</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
              <th className="px-6 py-4 font-semibold tracking-wider">User</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Action</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Item</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {mockAuditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.date}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{log.user}</td>
                <td className="px-6 py-4 text-blue-600 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-slate-800">{log.item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderArticleDetailView = () => {
    if (!selectedArticle) return <div>Article not found</div>;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 120; // Simulated large file

    return (
      <div className="max-w-3xl mx-auto py-8 px-6">
        <button onClick={() => handleNavigate('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge colorClass={selectedArticle.categoryColor}>{selectedArticle.category}</Badge>
            <span className="text-sm text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4"/> {selectedArticle.date}</span>
            <span className="text-sm text-slate-500 flex items-center gap-1"><Eye className="w-4 h-4"/> {selectedArticle.views} views</span>
          </div>
          
          <h1 className="text-3xl font-serif font-semibold text-slate-900 mb-4">{selectedArticle.title}</h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8">{selectedArticle.excerpt}</p>
          
          <div className="border-t border-slate-200 pt-8 mt-8 prose prose-slate">
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
              {currentPage > 1 ? `[Simulated Content for Page ${currentPage}]\n\n` : ''}
              {selectedArticle.content}
            </div>
          </div>
          
          {/* Pagination selector for large files */}
          <div className="border-t border-slate-200 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage <= 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="px-3 py-1.5 text-sm font-medium border border-slate-300 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
                Prev
              </button>
              
              <div className="flex items-center gap-2 mx-2">
                <span className="text-sm text-slate-500">Go to:</span>
                <input 
                  type="number" 
                  min={1} 
                  max={totalPages} 
                  value={currentPage} 
                  onChange={(e) => {
                    if(e.target.value === '') return;
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) setCurrentPage(Math.min(totalPages, Math.max(1, val)));
                  }}
                  className="w-16 px-2 py-1 text-sm border border-slate-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="px-3 py-1.5 text-sm font-medium border border-slate-300 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBrowseView = () => (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      <h2 className="text-2xl font-serif text-slate-800 mb-6">Browse Knowledge Base</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
          <input 
            id="main-search-input"
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles... (e.g. firewall, DR)" 
            className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 shadow-sm outline-none cursor-pointer"
        >
          <option>All Categories</option>
          <optgroup label="Infrastructure">
            <option>Network</option>
            <option>Cloud & Hybrid</option>
            <option>Databases</option>
            <option>Security</option>
            <option>DR/BCP</option>
          </optgroup>
          <optgroup label="Engineering">
            <option>Engineering</option>
            <option>CI/CD & DevOps</option>
            <option>API Catalog</option>
            <option>Change Mgmt</option>
          </optgroup>
          <optgroup label="Governance">
            <option>Policies & SOPs</option>
          </optgroup>
        </select>
        <button className="flex items-center justify-center p-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <React.Fragment key={article.id}>{renderArticleCard({ article })}</React.Fragment>
        ))}
      </div>
      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-slate-500">No articles found matching criteria.</div>
      )}
    </div>
  );

  const renderDashboardView = () => (
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
              {/* Search Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <form 
                  className="relative flex-1 group"
                  onSubmit={(e) => { e.preventDefault(); handleNavigate('browse'); }}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                  <input 
                    id="main-search-input-dashboard"
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search knowledge base... press ENTER to search" 
                    className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                  />
                </form>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {renderStatCard({ title: "Total Articles", value: "312", subtext: "↑ 14 this month" })}
                {renderStatCard({ title: "Pending Review", value: "18", subtext: "5 overdue" })}
                {renderStatCard({ title: "Compliance Coverage", value: "94%", subtext: "BSP, ISO 27001" })}
                {renderStatCard({ title: "Active Contributors", value: "27", subtext: "Across 4 teams" })}
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
                {tabArticles.slice(0, activeTab === 'Overview' ? 4 : undefined).map(article => (
                  <React.Fragment key={article.id}>{renderArticleCard({ article })}</React.Fragment>
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

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {renderTopbar()}
      
      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}
        <main className="flex-1 overflow-y-auto w-full">
          {currentView === 'dashboard' && renderDashboardView()}
          {currentView === 'browse' && renderBrowseView()}
          {currentView === 'article' && renderArticleDetailView()}
          {currentView === 'editor' && <EditorView onNavigate={handleNavigate} />}
          {currentView === 'audit' && renderAuditView()}
          {currentView === 'analytics' && renderAnalyticsView()}
        </main>
        {currentView !== 'editor' && currentView !== 'article' && renderRightPanel()}
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

