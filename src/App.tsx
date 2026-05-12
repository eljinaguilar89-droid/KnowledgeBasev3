import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { mockArticles, mockCategories } from "./data";
import { Topbar, Sidebar, RightPanel } from "./components/layout";
import { DashboardView } from "./views/DashboardView";
import { BrowseView } from "./views/BrowseView";
import { ArticleDetailView } from "./views/ArticleDetailView";
import { EditorView } from "./views/EditorView";
import { AnalyticsView } from "./views/AnalyticsView";
import { AuthView } from "./views/AuthView";
import { UsersView } from "./views/UsersView";
import { ManualView } from "./views/ManualView";
import { SystemLogsView } from "./views/SystemLogsView";
import { useAuth } from "./AuthContext";
import { ApiIntegrationView } from "./views/ApiIntegrationView";
import { AiChatDrawer } from "./components/AiChatDrawer";

export default function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "browse"
    | "article"
    | "editor"
    | "analytics"
    | "users"
    | "api"
    | "manual"
    | "logs"
  >("dashboard");
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [browsePage, setBrowsePage] = useState(1);
  const [articlePage, setArticlePage] = useState(1);
  const [articles, setArticles] = useState<any[]>(mockArticles);
  const [categories, setCategories] = useState<any[]>(mockCategories);
  const ITEMS_PER_PAGE = 9;

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Merge server categories with local mockCategories so
          // important items (e.g. "Audit Logs") aren't lost when
          // the API returns an incomplete list.
          const merged = [...data];
          mockCategories.forEach((mc) => {
            if (!merged.find((c: any) => c.filterCategory === mc.filterCategory)) {
              merged.push(mc);
            }
          });
          setCategories(merged);
        }
      })
      .catch(console.error);
  };

  const fetchArticles = () => {
    return fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (user) {
      fetchArticles();
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    setBrowsePage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setArticlePage(1);
  }, [selectedArticleId]);

  const [showSettings, setShowSettings] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [readNotifs, setReadNotifs] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('readNotifs');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('readNotifs', JSON.stringify(Array.from(readNotifs)));
  }, [readNotifs]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleNavigate = (
    view:
      | "dashboard"
      | "browse"
      | "article"
      | "editor"
      | "analytics"
      | "users"
      | "api"
      | "manual"
      | "logs",
    id?: string,
  ) => {
    // Viewer cannot see editor
    if (view === "editor" && user?.role === "Viewer") return;
    if (view === "users" && user?.role !== "IED Head") return;

    setCurrentView(view);
    if (id) setSelectedArticleId(id);
    else setSelectedArticleId(null);
  };

  if (!user) {
    return <AuthView />;
  }

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  // Derived state based on user role
  let visibleArticles = articles.filter(a => {
    // If author is current user, they can always see it regardless of access level
    if (user && a.author === user.name) return true;

    const level = a.accessLevel || "Public";

    if (level === "Restricted") {
      return false; // only author can see, handled above
    }

    if (level === "Confidential") {
      return user && user.role === "IED Head";
    }

    if (level === "Internal") {
      // open for per category only
      if (user && user.role === "IED Head") return true; // Assuming IED Head sees all internal
      
      const category = a.category;
      if (user && user.role === "DevOps & Infra Manager") {
        return [
          "Network",
          "Cloud & Hybrid",
          "Databases",
          "DR/BCP",
          "Dev Structure",
          "DevOps",
          "API Catalog",
          "Change Mgmt",
          "Policies & SOPs"
        ].includes(category);
      }
      if (user && user.role === "Sec & Comp. Manager") {
        return ["Security", "Policies & SOPs"].includes(category);
      }
      if (user && user.role === "DevOps Engineer") {
        // According to user: "if created under infra subcategory, role that can see infra can only see it"
        // Let's scope DevOps Engineer to these based on their likely coverage:
        return [
          "Dev Structure",
          "DevOps",
          "API Catalog",
          "Change Mgmt"
        ].includes(category);
      }
      
      return false;
    }

    // Public
    return true;
  });

  let filteredArticles = visibleArticles.filter(
    (a) => a.status === "Published",
  );
  if (searchQuery) {
    filteredArticles = filteredArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    // Sort by views descending
    filteredArticles.sort((a, b) => {
      // Parse views which are strings like "1.2k" or "842"
      const parseViews = (v: string | number) => {
        if (typeof v === 'number') return v;
        if (!v) return 0;
        const s = v.toString();
        if (s.endsWith('k')) return parseFloat(s) * 1000;
        return parseFloat(s);
      };
      const vA = parseViews(a.views);
      const vB = parseViews(b.views);
      return vB - vA;
    });
  }
  if (selectedCategory !== "All Categories")
    filteredArticles = filteredArticles.filter(
      (a) => a.category === selectedCategory,
    );

  // Tab filtered articles for dashboard
  let tabArticles = visibleArticles;
  if (activeTab === "My Articles") {
    tabArticles = visibleArticles.filter((a) => a.status === "Published" && a.author === user.name);
  } else if (activeTab === "My Drafts") {
    tabArticles = visibleArticles.filter((a) => a.status === "Draft" && a.author === user.name);
  } else if (activeTab === "My Pending Reviews") {
    tabArticles = visibleArticles.filter((a) => a.status === "Pending" && a.author === user.name);
  } else if (activeTab === "To Review & Publish") {
    tabArticles = visibleArticles.filter((a) => {
      if (a.status !== "Pending") return false;
      if (a.author === user.name) return false;
      
      if (user.role === "IED Head") return true;

      if (user.role === "DevOps & Infra Manager") {
        return [
          "Network",
          "Cloud & Hybrid",
          "Databases",
          "DR/BCP",
          "Dev Structure",
          "DevOps",
          "API Catalog",
          "Change Mgmt",
          "Policies & SOPs"
        ].includes(a.category);
      }
      if (user.role === "Sec & Comp. Manager") {
        return [
          "Security",
          "Policies & SOPs"
        ].includes(a.category);
      }
      return false;
    });
  } else {
    tabArticles = visibleArticles.filter((a) => a.status === "Published");
  }

  let notifications: any[] = [];
  if (user) {
    const publishedMine = articles.filter((a) => a.author === user.name && a.status === "Published");
    publishedMine.forEach((a) => {
      notifications.push({
        id: `pub-${a.id}`,
        title: "Article Published",
        message: `Your article "${a.title}" has been published.`,
        date: a.createdAt || a.date,
        timeMs: new Date(a.createdAt || Date.now()).getTime(),
      });
    });

    const pendingMine = articles.filter((a) => a.author === user.name && a.status === "Pending");
    pendingMine.forEach((a) => {
      notifications.push({
        id: `pend-${a.id}`,
        title: "Article Pending Review",
        message: `Your article "${a.title}" is submitted and pending review.`,
        date: a.createdAt || a.date,
        timeMs: new Date(a.createdAt || Date.now()).getTime(),
      });
    });

    let toReview: any[] = [];
    if (user.role === "IED Head") {
        toReview = articles.filter(a => a.status === "Pending" && a.author !== user.name);
    } else if (user.role === "DevOps & Infra Manager") {
        toReview = articles.filter(a => a.status === "Pending" && a.author !== user.name && ["Network", "Cloud & Hybrid", "Databases", "DR/BCP", "Dev Structure", "DevOps", "API Catalog", "Change Mgmt", "Policies & SOPs"].includes(a.category));
    } else if (user.role === "Sec & Comp. Manager") {
        toReview = articles.filter(a => a.status === "Pending" && a.author !== user.name && ["Security", "Policies & SOPs"].includes(a.category));
    }

    toReview.forEach((a) => {
      notifications.push({
        id: `rev-${a.id}`,
        title: "Review Requested",
        message: `${a.author} requested your review on "${a.title}".`,
        date: a.createdAt || a.date,
        timeMs: new Date(a.createdAt || Date.now()).getTime(),
      });
    });

    notifications = notifications.sort((a,b) => b.timeMs - a.timeMs).slice(0, 10);
  }

  const unreadNotifs = notifications.filter(n => !readNotifs.has(n.id));

  return (
    <div
      className={`flex flex-col h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}
    >
      <Topbar
        handleNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowNotifs={setShowNotifs}
        setShowSettings={setShowSettings}
        setShowAiChat={setShowAiChat}
        isDarkMode={isDarkMode}
        hasNotifs={notificationsEnabled && unreadNotifs.length > 0}
      />

      <div className="flex flex-1 overflow-hidden bg-inherit">
        <Sidebar
          currentView={currentView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleNavigate={handleNavigate}
          isDarkMode={isDarkMode}
          categories={categories}
        />
        <main className="flex-1 overflow-y-auto w-full bg-inherit">
          {currentView === "dashboard" && (
            <DashboardView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabArticles={tabArticles}
              allArticles={visibleArticles}
              handleNavigate={handleNavigate}
              setSelectedCategory={setSelectedCategory}
              isDarkMode={isDarkMode}
              categories={categories}
            />
          )}
          {currentView === "browse" && (
            <BrowseView
              filteredArticles={filteredArticles}
              browsePage={browsePage}
              setBrowsePage={setBrowsePage}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              handleNavigate={handleNavigate}
              isDarkMode={isDarkMode}
            />
          )}
          {currentView === "article" && (
            <ArticleDetailView
              selectedArticle={selectedArticle}
              articlePage={articlePage}
              setArticlePage={setArticlePage}
              handleNavigate={handleNavigate}
              isDarkMode={isDarkMode}
              refreshArticles={fetchArticles}
            />
          )}
          {currentView === "editor" && (
            <EditorView
              onNavigate={handleNavigate}
              isDarkMode={isDarkMode}
              refreshArticles={fetchArticles}
              categories={categories}
            />
          )}
          {currentView === "users" && <UsersView isDarkMode={isDarkMode} />}
          {currentView === "api" && <ApiIntegrationView isDarkMode={isDarkMode} />}
          {currentView === "manual" && <ManualView isDarkMode={isDarkMode} />}
          {currentView === "logs" && <SystemLogsView isDarkMode={isDarkMode} />}
          {currentView === "analytics" && (
            <AnalyticsView isDarkMode={isDarkMode} allArticles={visibleArticles} />
          )}
        </main>
        {currentView !== "editor" && currentView !== "article" && (
          <RightPanel
            handleNavigate={handleNavigate}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            articles={articles}
          />
        )}
      </div>

      <AiChatDrawer 
        isOpen={showAiChat} 
        onClose={() => setShowAiChat(false)} 
        isDarkMode={isDarkMode} 
        articles={articles} 
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className={`${isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all scale-100`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
            >
              <h3
                className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
              >
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label
                  className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"} block mb-2`}
                >
                  Display Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!isDarkMode ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDarkMode ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <div>
                <label
                  className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"} block mb-2`}
                >
                  Notifications
                </label>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 ${notificationsEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
            <div
              className={`p-4 border-t ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} text-right`}
            >
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Popover */}
      {showNotifs && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowNotifs(false)}
        >
          <div
            className={`absolute top-14 right-4 sm:right-16 w-80 ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"} rounded-2xl shadow-2xl border overflow-hidden transition-all`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}
            >
              <h3 className="font-semibold text-sm">Notifications</h3>
              <button
                onClick={() => setShowNotifs(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-slate-100"} max-h-96 overflow-auto`}
            >
              {notifications.length === 0 ? (
                <div className={`p-6 text-center text-sm ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  No new notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setReadNotifs(prev => new Set(prev).add(n.id));
                      if (n.id.startsWith("rev-")) {
                        handleNavigate("dashboard");
                        setActiveTab("To Review & Publish");
                        setShowNotifs(false);
                      } else if (n.id.startsWith("pub-") || n.id.startsWith("pend-")) {
                        handleNavigate("dashboard");
                        setActiveTab(n.id.startsWith("pub-") ? "My Articles" : "My Pending Reviews");
                        setShowNotifs(false);
                      }
                    }}
                    className={`p-4 cursor-pointer transition-colors ${
                      !readNotifs.has(n.id) 
                        ? (isDarkMode ? "bg-slate-800/80 hover:bg-slate-800" : "bg-blue-50/50 hover:bg-blue-50")
                        : (isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50")
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
                        {n.title}
                      </p>
                      {!readNotifs.has(n.id) && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {n.message}
                    </p>
                    <p className={`text-[10px] mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                      {n.date === 'Just now' ? 'Just now' : new Date(n.timeMs).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' - ' + new Date(n.timeMs).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div
              className={`p-3 border-t ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"} text-center`}
            >
              <button 
                onClick={() => {
                  setReadNotifs(new Set(notifications.map(n => n.id)));
                }}
                className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
