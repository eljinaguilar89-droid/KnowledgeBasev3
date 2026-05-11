import React, { useState } from "react";
import { Filter } from "lucide-react";
import { ArticleCard } from "../components/ui";

export const BrowseView = ({
  filteredArticles,
  browsePage,
  setBrowsePage,
  selectedCategory,
  setSelectedCategory,
  ITEMS_PER_PAGE,
  handleNavigate,
  isDarkMode,
}: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [dateFilter, setDateFilter] = useState("all");

  let processedArticles = [...filteredArticles];

  // Apply Date Filter
  if (dateFilter !== "all") {
    const now = new Date();
    processedArticles = processedArticles.filter((a: any) => {
      if (!a.createdAt) return true; // keep articles without date if any
      const articleDate = new Date(a.createdAt);
      if (dateFilter === "today") {
        return articleDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const diff = now.getTime() - articleDate.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === "month") {
        return articleDate.getMonth() === now.getMonth() && articleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }

  // Apply Sort
  processedArticles.sort((a: any, b: any) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt || Date.now()).getTime() - new Date(b.createdAt || Date.now()).getTime();
    } else if (sortOrder === "views") {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(processedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = processedArticles.slice(
    (browsePage - 1) * ITEMS_PER_PAGE,
    browsePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2
          className={`text-2xl font-serif ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
        >
          Browse Knowledge Base
        </h2>
        <div className="flex items-center gap-3 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-2 text-sm border rounded-lg shadow-sm outline-none cursor-pointer min-w-[200px] transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-white border-slate-300 text-slate-700"}`}
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
              <option>Dev Structure</option>
              <option>DevOps</option>
              <option>API Catalog</option>
              <option>Change Mgmt</option>
            </optgroup>
            <optgroup label="Governance">
              <option>Policies & SOPs</option>
              <option>Audit Logs</option>
            </optgroup>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center p-2 border rounded-lg shadow-sm transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"} ${showFilters ? 'bg-slate-100' : ''}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          
          {showFilters && (
            <div className={`absolute top-full right-0 mt-2 p-4 border rounded-xl shadow-xl w-64 z-10 flex flex-col gap-4 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Sort By</label>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none ${isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Upload Date</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none ${isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                >
                  <option value="all">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">Past 7 days</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.map((article: any) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => handleNavigate("article", article.id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div
          className={`text-center py-12 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}
        >
          No articles found matching criteria.
        </div>
      ) : (
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button
              disabled={browsePage === 1}
              onClick={() =>
                setBrowsePage((prev: number) => Math.max(1, prev - 1))
              }
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50"}`}
            >
              Previous
            </button>

            <div className={`flex items-center gap-2 mx-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={browsePage}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (!isNaN(val)) setBrowsePage(Math.min(Math.max(1, val), totalPages));
                }}
                className={`w-16 px-2 py-1.5 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-800"}`}
              />
              <span>of {totalPages}</span>
            </div>

            <button
              disabled={browsePage === totalPages}
              onClick={() =>
                setBrowsePage((prev: number) => Math.min(totalPages, prev + 1))
              }
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50"}`}
            >
              Next
            </button>
          </div>
        )
      )}
    </div>
  );
};
