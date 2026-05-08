import React from 'react';
import { Clock, Eye } from 'lucide-react';

export const Badge = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
    {children}
  </span>
);

export const IconButton = ({ icon: Icon, children, className = '', onClick }: { icon: any, children?: React.ReactNode, className?: string, onClick?: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors ${className}`}>
    <Icon className="w-4 h-4" />
    {children && <span className="text-sm font-medium">{children}</span>}
  </button>
);

export const StatCard = ({ title, value, subtext }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
    <p className="text-2xl font-serif font-semibold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500 mt-1">{subtext}</p>
  </div>
);

export const ArticleCard = ({ article, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full">
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
