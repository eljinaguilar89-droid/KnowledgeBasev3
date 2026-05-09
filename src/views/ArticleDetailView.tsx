import React, { useState } from "react";
import { ArrowLeft, Clock, Eye, CheckCircle } from "lucide-react";
import { Badge } from "../components/ui";
import { useAuth } from "../AuthContext";

export const ArticleDetailView = ({
  selectedArticle,
  articlePage,
  setArticlePage,
  handleNavigate,
  isDarkMode,
  refreshArticles,
}: any) => {
  const { user } = useAuth();
  const [isApproving, setIsApproving] = useState(false);

  if (!selectedArticle)
    return (
      <div
        className={`p-8 text-center ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
      >
        Article not found
      </div>
    );

  const pages = selectedArticle.content
    .split(/\n\s*\n/)
    .filter((p: string) => p.trim() !== "");
  const currentArticlePageContent =
    pages[articlePage - 1] || selectedArticle.content;
  const totalArticlePages = pages.length;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/articles/${selectedArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Published" }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      if (refreshArticles) await refreshArticles();
      handleNavigate("dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to approve article");
    } finally {
      setIsApproving(false);
    }
  };

  const canApprove =
    user?.role &&
    ["Approver", "Admin"].includes(user.role) &&
    selectedArticle.status === "Pending" &&
    selectedArticle.author !== user.name;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => handleNavigate("dashboard")}
          className={`flex items-center gap-2 text-sm transition-colors ${isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800"}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        {canApprove && (
          <button
            disabled={isApproving}
            onClick={handleApprove}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm disabled:opacity-50`}
          >
            <CheckCircle className="w-4 h-4" />
            {isApproving ? "Approving..." : "Approve & Publish"}
          </button>
        )}
      </div>

      {selectedArticle.status === "Pending" && (
        <div
          className={`mb-6 flex items-center justify-center p-3 rounded-xl border ${isDarkMode ? "bg-amber-900/20 border-amber-800/50 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-800"}`}
        >
          <span className="text-sm font-medium">
            This article is currently pending review.
          </span>
        </div>
      )}

      <div
        className={`rounded-2xl border shadow-sm p-8 lg:p-12 mb-8 flex flex-col min-h-[600px] transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div>
          <div className="flex items-center gap-3">
            <Badge colorClass={selectedArticle.categoryColor}>
              {selectedArticle.category}
            </Badge>
            <span
              className={`text-sm flex items-center gap-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              <Clock className="w-4 h-4" /> {selectedArticle.date}
            </span>
            <span
              className={`text-sm flex items-center gap-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              <Eye className="w-4 h-4" /> {selectedArticle.views} views
            </span>
          </div>

          <h1
            className={`text-4xl font-serif font-bold mb-6 leading-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
          >
            {selectedArticle.title}
          </h1>
          <p
            className={`text-xl leading-relaxed mb-10 pb-8 border-b ${isDarkMode ? "text-slate-400 border-slate-800" : "text-slate-500 border-slate-100"}`}
          >
            {selectedArticle.excerpt}
          </p>

          <div
            className={`prose max-w-none transition-colors ${isDarkMode ? "prose-invert" : "prose-slate"}`}
          >
            <div
              className={`text-lg leading-[1.8] whitespace-pre-wrap font-sans ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              {totalArticlePages > 1
                ? currentArticlePageContent
                : selectedArticle.content}
            </div>
          </div>
        </div>

        {totalArticlePages > 1 && (
          <div className="mt-auto pt-16 pb-4">
            <div
              className={`flex justify-center flex-col items-center gap-4 border-t pt-8 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}
              >
                PAGE {articlePage} OF {totalArticlePages}
              </div>
              <div className="flex justify-center items-center gap-2">
                <button
                  disabled={articlePage === 1}
                  onClick={() =>
                    setArticlePage((prev: number) => Math.max(1, prev - 1))
                  }
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50"}`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalArticlePages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setArticlePage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-all ${
                        articlePage === i + 1
                          ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                          : isDarkMode
                            ? "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800"
                            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 line-height-1"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={articlePage === totalArticlePages}
                  onClick={() =>
                    setArticlePage((prev: number) =>
                      Math.min(totalArticlePages, prev + 1),
                    )
                  }
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50"}`}
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
