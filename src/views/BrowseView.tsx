import React from 'react';
import { Filter } from 'lucide-react';
import { ArticleCard } from '../components/ui';

export const BrowseView = ({ filteredArticles, browsePage, setBrowsePage, selectedCategory, setSelectedCategory, ITEMS_PER_PAGE, handleNavigate, isDarkMode }: any) => {
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((browsePage - 1) * ITEMS_PER_PAGE, browsePage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 transition-colors">
      <h2 className={`text-2xl font-serif mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Browse Knowledge Base</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-between">
        <div className="flex items-center gap-3">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className={`px-3 py-2 text-sm border rounded-lg shadow-sm outline-none cursor-pointer min-w-[200px] transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-700'}`}
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
          <button className={`flex items-center justify-center p-2 border rounded-lg shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.map((article: any) => (
          <ArticleCard key={article.id} article={article} onClick={() => handleNavigate('article', article.id)} isDarkMode={isDarkMode} />
        ))}
      </div>
      
      {filteredArticles.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No articles found matching criteria.</div>
      ) : (
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button 
              disabled={browsePage === 1}
              onClick={() => setBrowsePage((prev: number) => Math.max(1, prev - 1))}
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50'}`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1.5 mx-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBrowsePage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-all ${browsePage === i + 1 
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' 
                    : (isDarkMode ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 line-height-1')}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={browsePage === totalPages}
              onClick={() => setBrowsePage((prev: number) => Math.min(totalPages, prev + 1))}
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50'}`}
            >
              Next
            </button>
          </div>
        )
      )}
    </div>
  );
};
