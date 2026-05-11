import React from "react";
import { Clock, Eye, User } from "lucide-react";

export const Badge = ({
  children,
  colorClass,
}: {
  children: React.ReactNode;
  colorClass: string;
}) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
  >
    {children}
  </span>
);

export const IconButton = ({
  icon: Icon,
  children,
  className = "",
  onClick,
  isDarkMode,
  hasNotifs,
}: {
  icon: any;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isDarkMode?: boolean;
  hasNotifs?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 p-1.5 rounded-md transition-colors relative ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"} ${className}`}
  >
    <Icon className="w-4 h-4" />
    {hasNotifs && (
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
    )}
    {children && <span className="text-sm font-medium">{children}</span>}
  </button>
);

export const StatCard = ({ title, value, subtext, isDarkMode }: any) => (
  <div
    className={`p-4 rounded-2xl border shadow-sm transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
  >
    <p
      className={`text-xs font-medium mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}
    >
      {title}
    </p>
    <p
      className={`text-2xl font-serif font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
    >
      {value}
    </p>
    <p
      className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
    >
      {subtext}
    </p>
  </div>
);

export const ArticleCard = ({ article, onClick, isDarkMode }: any) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-full ${isDarkMode ? "bg-slate-900 border-slate-800 hover:border-blue-500 active:bg-slate-800/80" : "bg-white border-slate-200 hover:border-blue-500 hover:shadow-md"}`}
  >
    <div>
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4
          className={`text-sm font-semibold leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
        >
          {article.title}
        </h4>
        {article.badge && (
          <Badge
            colorClass={
              isDarkMode
                ? "bg-red-900/30 text-red-400"
                : "bg-red-100 text-red-800"
            }
          >
            {article.badge}
          </Badge>
        )}
      </div>
      <p
        className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
      >
        {article.excerpt}
      </p>
    </div>
    <div
      className={`flex items-center gap-3 text-xs mt-auto pt-3 border-t ${isDarkMode ? "text-slate-500 border-slate-800/50" : "text-slate-400 border-slate-50"}`}
    >
      <Badge
        colorClass={
          article.categoryColor ||
          (isDarkMode
            ? "bg-slate-800 text-slate-300"
            : "bg-slate-100 text-slate-800")
        }
      >
        {article.category}
      </Badge>
      <span className="flex items-center gap-1 min-w-0" title={article.author}>
        <User className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{article.author}</span>
      </span>
      <span className="flex items-center gap-1 shrink-0">
        <Eye className="w-3.5 h-3.5" /> {article.views}
      </span>
    </div>
  </div>
);
