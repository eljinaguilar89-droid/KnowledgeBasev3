import React from 'react';
import { Filter } from 'lucide-react';
import { ArticleCard } from '../components/ui';

export const BrowseView = ({ filteredArticles, browsePage, setBrowsePage, selectedCategory, setSelectedCategory, ITEMS_PER_PAGE, handleNavigate }: any) => {
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((browsePage - 1) * ITEMS_PER_PAGE, browsePage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      <h2 className="text-2xl font-serif text-slate-800 mb-6">Browse Knowledge Base</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-between">
        <div className="flex items-center gap-3">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 shadow-sm outline-none cursor-pointer min-w-[200px]"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.map((article: any) => (
          <React.Fragment key={article.id}>
            <ArticleCard article={article} onClick={() => handleNavigate('article', article.id)} />
          </React.Fragment>
        ))}
      </div>
      
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No articles found matching criteria.</div>
      ) : (
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button 
              disabled={browsePage === 1}
              onClick={() => setBrowsePage((prev: number) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBrowsePage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${browsePage === i + 1 ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'} transition-colors`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={browsePage === totalPages}
              onClick={() => setBrowsePage((prev: number) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        )
      )}
    </div>
  );
};
