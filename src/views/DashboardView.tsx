import React from "react";
import {
  Info,
  Server,
  ShieldCheck,
  Code,
  Activity,
  Blocks,
  ListChecks,
  Shield,
  History,
  Cloud,
  Database,
  Settings,
  GitMerge,
} from "lucide-react";
import { StatCard, ArticleCard, Badge } from "../components/ui";
import { mockCompliance } from "../data";
import { useAuth } from "../AuthContext";

export const DashboardView = ({
  activeTab,
  setActiveTab,
  tabArticles,
  allArticles = [],
  handleNavigate,
  setSelectedCategory,
  isDarkMode,
  categories = [],
}: any) => {
  const { user } = useAuth();
  
  const totalArticles = allArticles.length;
  const recentArticles = allArticles.filter((a: any) => {
    if (a.createdAt) {
      const date = new Date(a.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    } else if (a.date) {
      const str = a.date.toLowerCase();
      if (str.match(/^[1-9]\s*m\s*ago/) || str.includes("y ago")) return false; 
      return true;
    }
    return false;
  }).length;
  
  const pendingForUserArticles = allArticles.filter((a: any) => {
    if (a.status !== "Pending" || a.author === user?.name) return false;
    if (user?.role === "DevOps & Infra Manager") return ["Network", "Cloud & Hybrid", "Databases", "DR/BCP", "Dev Structure", "DevOps", "API Catalog", "Change Mgmt", "Policies & SOPs", "Audit Logs"].includes(a.category);
    if (user?.role === "Sec & Comp. Manager") return ["Security", "Policies & SOPs", "Audit Logs"].includes(a.category);
    return false;
  });
  const pendingForUser = pendingForUserArticles.length;
  const pendingCategories = Array.from(new Set(pendingForUserArticles.map((a: any) => String(a.category))));
  const reviewContext = pendingCategories.length > 0 
    ? (pendingCategories.length <= 2 ? pendingCategories.join(" and ") : pendingCategories[0] + " and other")
    : "compliance";

  const overdueCount = allArticles.filter((a: any) => {
    if (a.status !== "Pending" || a.author === user?.name) return false;
    
    let isForUser = false;
    if (user?.role === "DevOps & Infra Manager") isForUser = ["Network", "Cloud & Hybrid", "Databases", "DR/BCP", "Dev Structure", "DevOps", "API Catalog", "Change Mgmt", "Policies & SOPs", "Audit Logs"].includes(a.category);
    else if (user?.role === "Sec & Comp. Manager") isForUser = ["Security", "Policies & SOPs", "Audit Logs"].includes(a.category);

    if (!isForUser) return false;

    let diffDays = 0;
    if (a.createdAt) {
      const date = new Date(a.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else if (a.date) {
        const str = a.date.toLowerCase();
        if (str.includes("d ago")) {
            const num = parseInt(str);
            if (!isNaN(num)) diffDays = num;
        } else if (str.includes("w ago")) {
            const num = parseInt(str);
            if (!isNaN(num)) diffDays = num * 7;
        } else if (str.includes("m ago") || str.includes("mo ") || str.includes("y ago")) {
            diffDays = 30; // definitely overdue
        }
    }
    return diffDays > 7;
  }).length;

  const uniqueAuthors = new Set(allArticles.map((a: any) => a.author));
  const uniqueContributors = uniqueAuthors.size;
  // let's assume each user is roughly a separate team or we can extract some logic. The user said "Across 4 teams also reflect number of contrinbutors", so we can just use 4 teams but adjust wording... wait!
  // I will just keep it static for the subtext "Across 4 teams" or make it dynamic if we have a teams list.
  // Actually, we can count unique categories they contribute to as "teams".
  const uniqueTeams = new Set(allArticles.map((a: any) => a.category)).size;

  let tabsToMap = ["Overview"];
  
  const hasDrafts = allArticles.some((a: any) => a.status === "Draft" && a.author === user?.name);

  if (user?.role === "DevOps Engineer") {
    tabsToMap = ["Overview", "My Articles", "My Pending Reviews"];
  } else if (user?.role === "DevOps & Infra Manager" || user?.role === "Sec & Comp. Manager") {
    tabsToMap = ["Overview", "My Articles", "To Review & Publish"];
  } else if (user?.role === "IED Head") {
    tabsToMap = ["Overview", "My Articles", "To Review & Publish"];
  }

  if (hasDrafts && !tabsToMap.includes("My Drafts")) {
    const insertIdx = tabsToMap.indexOf("To Review & Publish");
    if (insertIdx !== -1) {
      tabsToMap.splice(insertIdx + 1, 0, "My Drafts");
    } else {
      tabsToMap.push("My Drafts");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 transition-colors">
      {/* Alert Bar */}
      {pendingForUser > 0 && (
        <div
          className={`flex items-center gap-3 border px-4 py-3 rounded-lg mb-6 shadow-sm transition-colors ${isDarkMode ? "bg-blue-900/20 border-blue-800 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-800"}`}
        >
          <Info
            className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
          />
          <p className="text-sm">
            <span className="font-semibold">Action Required:</span> {pendingForUser} article{pendingForUser > 1 ? "s" : ""} pending
            for {reviewContext} review right now.
            <button
              onClick={() => setActiveTab("To Review & Publish")}
              className={`ml-2 font-semibold underline hover:opacity-80 ${isDarkMode ? "decoration-blue-700" : "decoration-blue-300"}`}
            >
              Review now
            </button>
          </p>
        </div>
      )}

      {/* Tabs */}
      <div
        className={`flex gap-6 border-b mb-6 px-1 overflow-x-auto whitespace-nowrap transition-colors ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
      >
        {tabsToMap.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab
                ? isDarkMode
                  ? "border-blue-500 text-blue-400"
                  : "border-blue-600 text-blue-700"
                : `border-transparent ${isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800 hover:border-slate-300"}`
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {(activeTab === "Overview" ||
        activeTab === "My Articles" ||
        activeTab === "Pending Review" ||
        activeTab === "My Pending Reviews" ||
        activeTab === "My Drafts" ||
        activeTab === "To Review & Publish") && (
        <>
          {activeTab === "Overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard
                  title="Total Articles"
                  value={String(totalArticles || 0)}
                  subtext={`↑ ${recentArticles} this month`}
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  title="Pending Review"
                  value={String(pendingForUser || 0)}
                  subtext={`${overdueCount} overdue`}
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  title="Total Categories"
                  value={String(categories.length || 0)}
                  subtext="Across the platform"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  title="Active Contributors"
                  value={String(uniqueContributors || 0)}
                  subtext={`Across ${uniqueTeams} categories`}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Categories */}
              <div className="mb-10">
                <div className="flex items-baseline justify-between mb-4">
                  <h3
                    className={`text-xl font-serif ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
                  >
                    Browse Categories
                  </h3>
                  <span
                    className={`text-xs font-medium ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    {categories.length} categories
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat.filterCategory);
                        handleNavigate("browse");
                      }}
                      className={`flex flex-col items-start p-4 border rounded-2xl transition-all text-left group transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 hover:border-blue-500 active:bg-slate-800" : "bg-white border-slate-200 hover:border-blue-500 hover:shadow-sm"}`}
                    >
                      <div className={`p-2 rounded-lg mb-3 ${cat.colorClass}`}>
                        {cat.icon === "Server" && (
                          <Server className="w-5 h-5" />
                        )}
                        {cat.icon === "ShieldCheck" && (
                          <ShieldCheck className="w-5 h-5" />
                        )}
                        {cat.icon === "Code" && <Code className="w-5 h-5" />}
                        {cat.icon === "Activity" && (
                          <Activity className="w-5 h-5" />
                        )}
                        {cat.icon === "Blocks" && (
                          <Blocks className="w-5 h-5" />
                        )}
                        {cat.icon === "ListChecks" && (
                          <ListChecks className="w-5 h-5" />
                        )}
                        {cat.icon === "Cloud" && <Cloud className="w-5 h-5" />}
                        {cat.icon === "Database" && <Database className="w-5 h-5" />}
                        {cat.icon === "Settings" && <Settings className="w-5 h-5" />}
                        {cat.icon === "GitMerge" && <GitMerge className="w-5 h-5" />}
                      </div>
                      <h4
                        className={`text-sm font-semibold mb-1 group-hover:text-blue-600 transition-colors ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                      >
                        {cat.title}
                      </h4>
                      <p
                        className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                      >
                        {(() => {
                           const cArticles = allArticles.filter((a: any) => a.category === cat.filterCategory || cat.filterCategory === "All");
                           const cPending = cArticles.filter((a: any) => a.status === "Pending");
                           const cPublished = cArticles.filter((a: any) => a.status === "Published");
                           return `${cPublished.length} articles · ${cPending.length} pending`;
                        })()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recent Articles / Tab Content */}
          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-4">
              <h3
                className={`text-xl font-serif ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
              >
                {activeTab === "Overview"
                  ? "Recent & Pinned Articles"
                  : `${activeTab}`}
              </h3>
              {activeTab === "Overview" && (
                <button
                  onClick={() => handleNavigate("browse")}
                  className={`text-sm font-medium transition-colors ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                >
                  View all
                </button>
              )}
            </div>
            {tabArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                {tabArticles
                  .slice(0, activeTab === "Overview" ? 4 : undefined)
                  .map((article: any) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onClick={() => handleNavigate("article", article.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
              </div>
            ) : (
              <div
                className={`p-8 text-center border rounded-2xl transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}
              >
                No articles found.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "Compliance" && user?.role !== "IED Head" && (
        <div className="mb-8">
          <h3
            className={`text-xl font-serif mb-4 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
          >
            Compliance Status
          </h3>
          <div
            className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
          >
            {mockCompliance.map((item, i, arr) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50"} ${i !== arr.length - 1 ? (isDarkMode ? "border-b border-slate-800" : "border-b border-slate-100") : ""}`}
              >
                <div
                  className={`flex items-center gap-3 text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  {item.text}
                </div>
                <Badge colorClass={`${item.color}`}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed Audit Trail Tab */}

      <div className="h-8"></div>
    </div>
  );
};
