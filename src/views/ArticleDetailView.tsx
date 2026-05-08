import React from 'react';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { Badge } from '../components/ui';

export const ArticleDetailView = ({ selectedArticle, articlePage, setArticlePage, handleNavigate }: any) => {
  if (!selectedArticle) return <div>Article not found</div>;
  
  const pages = selectedArticle.content.split(/\n\s*\n/).filter((p: string) => p.trim() !== '');
  const currentArticlePageContent = pages[articlePage - 1] || selectedArticle.content;
  const totalArticlePages = pages.length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <button onClick={() => handleNavigate('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8 flex flex-col min-h-[500px]">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Badge colorClass={selectedArticle.categoryColor}>{selectedArticle.category}</Badge>
            <span className="text-sm text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4"/> {selectedArticle.date}</span>
            <span className="text-sm text-slate-500 flex items-center gap-1"><Eye className="w-4 h-4"/> {selectedArticle.views} views</span>
          </div>
          
          <h1 className="text-3xl font-serif font-semibold text-slate-900 mb-4">{selectedArticle.title}</h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8">{selectedArticle.excerpt}</p>
          
          <div className="border-t border-slate-200 pt-8 mt-8 prose prose-slate">
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
              {totalArticlePages > 1 ? currentArticlePageContent : selectedArticle.content}
            </div>
          </div>
        </div>

        {totalArticlePages > 1 && (
          <div className="mt-auto pt-10 pb-2">
            <div className="flex justify-center flex-col items-center gap-3 border-t border-slate-100 pt-6">
              <div className="text-xs text-slate-400 font-medium tracking-wider">PAGE {articlePage} OF {totalArticlePages}</div>
              <div className="flex justify-center items-center gap-2">
                <button 
                  disabled={articlePage === 1}
                  onClick={() => setArticlePage((prev: number) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalArticlePages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setArticlePage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${articlePage === i + 1 ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'} transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={articlePage === totalArticlePages}
                  onClick={() => setArticlePage((prev: number) => Math.min(totalArticlePages, prev + 1))}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
