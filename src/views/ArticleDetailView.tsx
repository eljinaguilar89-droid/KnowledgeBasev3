import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Eye, CheckCircle, User, Download } from "lucide-react";
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
  const viewIncrementedRef = React.useRef<string | null>(null);

  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articlePage]);

  useEffect(() => {
    if (selectedArticle?.id && viewIncrementedRef.current !== selectedArticle.id) {
      viewIncrementedRef.current = selectedArticle.id;
      if (selectedArticle.status === "Published" || selectedArticle.status === "Pending") {
        fetch(`/api/articles/${selectedArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ views: (selectedArticle.views || 0) + 1 }),
        });
        // We do a manual UI bump for seamless experience without needing refresh immediately.
        selectedArticle.views = (selectedArticle.views || 0) + 1;
      }
    }
  }, [selectedArticle?.id]);

  if (!selectedArticle)
    return (
      <div
        className={`p-8 text-center ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
      >
        Article not found
      </div>
    );

  let pages = selectedArticle.content.split(/<p><!-- PAGE_BREAK --><\/p>|<p>&lt;!-- PAGE_BREAK --&gt;<\/p>|<hr class="page-break"[^>]*>/i);
  if (pages.length === 1 && !selectedArticle.content.includes("<")) {
     pages = selectedArticle.content.split(/\n\s*\n/).filter((p: string) => p.trim() !== "");
  }
  const currentArticlePageContent =
    pages[articlePage - 1] || selectedArticle.content;
  const totalArticlePages = pages.length;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const newBadge = selectedArticle.badge === "Draft" ? "" : selectedArticle.badge;
      const res = await fetch(`/api/articles/${selectedArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Published", badge: newBadge }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      if (refreshArticles) await refreshArticles();
      selectedArticle.status = "Published";
      selectedArticle.badge = newBadge;
      handleNavigate("dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to approve article");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setIsApproving(true);
    try {
      const res = await fetch(`/api/articles/${selectedArticle.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      if (refreshArticles) await refreshArticles();
      handleNavigate("dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to delete article");
    } finally {
      setIsApproving(false);
    }
  };

  const handleSubmitDraft = async () => {
    setIsApproving(true);
    try {
      // Check if user is a manager for this category
      let autoApprove = false;
      if (user?.role === "IED Head") autoApprove = true;
      else if (user?.role === "DevOps & Infra Manager") {
        if (["Network", "Cloud & Hybrid", "Databases", "DR/BCP", "Dev Structure", "DevOps", "API Catalog", "Change Mgmt", "Policies & SOPs", "Audit Logs"].includes(selectedArticle.category)) {
          autoApprove = true;
        }
      } else if (user?.role === "Sec & Comp. Manager") {
        if (["Security", "Policies & SOPs", "Audit Logs"].includes(selectedArticle.category)) {
          autoApprove = true;
        }
      }

      const newStatus = autoApprove ? "Published" : "Pending";
      const newBadge = selectedArticle.badge === "Draft" ? "" : selectedArticle.badge;

      const res = await fetch(`/api/articles/${selectedArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, badge: newBadge }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      if (refreshArticles) await refreshArticles();
      selectedArticle.status = newStatus;
      selectedArticle.badge = newBadge;
    } catch (e) {
      console.error(e);
      alert("Failed to submit article");
    } finally {
      setIsApproving(false);
    }
  };

  const getCanApprove = () => {
    if (!user?.role) return false;
    if (selectedArticle.status === "Published") return false;

    let hasRoleAuth = false;
    if (user.role === "IED Head") {
      hasRoleAuth = true;
    } else if (user?.role === "DevOps & Infra Manager") {
      const allowedCategories = [
        "Network",
        "Cloud & Hybrid",
        "Databases",
        "DR/BCP",
        "Dev Structure",
        "DevOps",
        "API Catalog",
        "Change Mgmt",
        "Policies & SOPs",
        "Audit Logs"
      ];
      hasRoleAuth = allowedCategories.includes(selectedArticle.category);
    } else if (user?.role === "Sec & Comp. Manager") {
      const allowedCategories = [
        "Security",
        "Policies & SOPs",
        "Audit Logs"
      ];
      hasRoleAuth = allowedCategories.includes(selectedArticle.category);
    }

    if (!hasRoleAuth) return false;

    // Cannot approve someone else's draft
    if (selectedArticle.status === "Draft" && selectedArticle.author !== user.name) return false;

    return true;
  };

  const canApprove = getCanApprove();

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => handleNavigate("dashboard")}
          className={`flex items-center gap-2 text-sm transition-colors ${isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800"}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          {selectedArticle.status === "Draft" && selectedArticle.author === user?.name && !canApprove && (
            <button
              disabled={isApproving}
              onClick={handleSubmitDraft}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm disabled:opacity-50 ${isDarkMode ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
            >
              Submit for Review
            </button>
          )}
          {canApprove && (
            <button
              disabled={isApproving}
              onClick={handleApprove}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm disabled:opacity-50 ${isDarkMode ? "bg-green-900/30 text-green-400 hover:bg-green-900/50" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
            >
              <CheckCircle className="w-4 h-4" />
              {isApproving ? "Publishing..." : "Approve & Publish"}
            </button>
          )}
          {(user?.role === "IED Head" || (selectedArticle.status === "Draft" && selectedArticle.author === user?.name)) && (
            <button
              disabled={isApproving}
              onClick={handleDelete}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm disabled:opacity-50 ${isDarkMode ? "bg-red-900/30 text-red-400 hover:bg-red-900/50" : "bg-red-50 text-red-700 hover:bg-red-100"}`}
            >
              Delete{selectedArticle.status === "Draft" ? " Draft" : " Article"}
            </button>
          )}
        </div>
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
              <User className="w-4 h-4" /> By {selectedArticle.author}
            </span>
            <span
              className={`text-sm flex items-center gap-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              <Clock className="w-4 h-4" />{" "}
              {selectedArticle.createdAt 
                ? new Date(selectedArticle.createdAt).toLocaleDateString() + " " + new Date(selectedArticle.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                : selectedArticle.date}
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
            className={`text-xl leading-relaxed mb-16 pb-8 border-b ${isDarkMode ? "text-slate-400 border-slate-800" : "text-slate-500 border-slate-100"}`}
          >
            {selectedArticle.excerpt}
          </p>

          <div
            className={`prose max-w-none transition-colors prose-li:marker:text-slate-800 dark:prose-li:marker:text-slate-200 ${isDarkMode ? "prose-invert" : "prose-slate"} flex-1 min-h-0 overflow-auto`}
          >
            <div
              className={`text-lg leading-[1.8] whitespace-pre-wrap font-sans break-words max-w-full ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
              dangerouslySetInnerHTML={{
                __html: currentArticlePageContent.includes("<") 
                        ? currentArticlePageContent 
                        : currentArticlePageContent.replace(/\n/g, '<br/>')
              }}
            >
            </div>
          </div>

        </div>
      </div>

      {(selectedArticle.attachments?.length > 0 || (selectedArticle.attachmentName && selectedArticle.attachmentData)) && (
        <div className={`mb-8 flex flex-col gap-3`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
            Attachments
          </h3>
          {(selectedArticle.attachments && selectedArticle.attachments.length > 0 ? selectedArticle.attachments : [{name: selectedArticle.attachmentName, data: selectedArticle.attachmentData}]).map((att: any, idx: number) => (
            <div key={idx} className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex flex-col truncate mr-4">
                <span className={`text-sm font-semibold mb-1 ${isDarkMode ? "text-slate-200" : "text-slate-800"} truncate`}>
                  Attached Document
                </span>
                <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"} truncate`}>
                  {att.name}
                </span>
              </div>
              <a
                href={att.data}
                download={att.name}
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      )}

      {totalArticlePages > 1 && (
        <div className="mb-8">
          <div
            className={`flex justify-center flex-col items-center gap-4`}
          >
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

              <div className={`flex items-center gap-2 mx-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <span>Page</span>
                <input
                  type="number"
                  min={1}
                  max={totalArticlePages}
                  value={articlePage}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (!isNaN(val)) setArticlePage(Math.min(Math.max(1, val), totalArticlePages));
                  }}
                  className={`w-16 px-2 py-1.5 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-800"}`}
                />
                <span>of {totalArticlePages}</span>
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
  );
};
