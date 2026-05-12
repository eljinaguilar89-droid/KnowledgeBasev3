import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Settings,
  Plus,
  LayoutDashboard,
  Search,
  Server,
  Cloud,
  Database,
  ShieldAlert,
  Activity,
  Code,
  GitBranch,
  Blocks,
  ListChecks,
  FileText,
  ClipboardSignature,
  BarChart as BarChartIcon,
  FilePlus,
  FileSearch,
  History,
  ArrowUpRight,
  LogOut,
  UserCog,
  Book,
  Terminal,
  Sparkles
} from "lucide-react";
import { IconButton } from "./ui";
import { mockActivities } from "../data";
import { useAuth } from "../AuthContext";

export const Topbar = ({
  handleNavigate,
  searchQuery,
  setSearchQuery,
  setShowNotifs,
  setShowSettings,
  setShowAiChat,
  isDarkMode,
  hasNotifs,
}: any) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 border-b sticky top-0 z-10 w-full transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md tracking-wider shadow-sm shadow-blue-500/20">
          IED
        </div>
        <div
          className={`text-sm font-semibold tracking-wide hidden sm:block ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
        >
          PSBank Knowledge Base Deck
        </div>
      </div>
      <div className="flex items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNavigate("browse");
          }}
          onClick={() => {
            handleNavigate("browse");
            setTimeout(
              () => document.getElementById("main-search-input")?.focus(),
              50,
            );
          }}
          className="relative group hidden sm:block mr-2"
        >
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-blue-500 transition-colors ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
          />
          <input
            id="main-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className={`w-64 pl-9 pr-4 py-1.5 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"}`}
          />
        </form>
        {user?.role !== "NEO" && (
          <button
            onClick={() => handleNavigate("editor")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${isDarkMode ? "text-slate-300 border-slate-700 hover:bg-slate-800" : "text-slate-600 border-slate-200 hover:bg-slate-50"}`}
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        )}
        <IconButton
          icon={Bell}
          onClick={() => setShowNotifs(true)}
          isDarkMode={isDarkMode}
          hasNotifs={hasNotifs}
        />
        <IconButton
          icon={Settings}
          onClick={() => setShowSettings(true)}
          isDarkMode={isDarkMode}
        />
        <IconButton
          icon={Sparkles}
          onClick={() => setShowAiChat && setShowAiChat(true)}
          isDarkMode={isDarkMode}
        />
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-8 h-8 rounded-full font-semibold text-xs flex items-center justify-center ml-2 border transition-colors ${isDarkMode ? "bg-blue-900/40 text-blue-400 border-blue-900/50 hover:bg-blue-900/60" : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"}`}
            title={user?.name}
          >
            {user?.name.substring(0, 2).toUpperCase()}
          </button>
          
          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
              <div className={`px-4 py-2 border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>{user?.name}</p>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? "text-slate-300 hover:bg-slate-700 text-red-400 hover:text-red-300" : "text-slate-700 hover:bg-slate-100 text-red-600 hover:text-red-700"}`}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  view,
  tabTarget,
  categoryTarget,
  onClickId,
  currentView,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  handleNavigate,
  isDarkMode,
}: any) => {
  let active = false;
  if (view === "dashboard") {
    active =
      currentView === "dashboard" &&
      (tabTarget ? activeTab === tabTarget : activeTab === "Overview");
  } else if (view === "browse") {
    active =
      currentView === "browse" &&
      (categoryTarget
        ? selectedCategory === categoryTarget
        : selectedCategory === "All Categories");
  } else if (view) {
    active = currentView === view;
  }

  return (
    <button
      onClick={() => {
        if (view) handleNavigate(view);
        if (tabTarget) {
          handleNavigate("dashboard");
          setActiveTab(tabTarget);
        }
        if (categoryTarget) {
          setSelectedCategory(categoryTarget);
        } else if (view === "browse") {
          setSelectedCategory("All Categories");
        } else if (view === "dashboard" && !tabTarget) {
          setActiveTab("Overview");
        }
        if (onClickId === "search") {
          setTimeout(
            () => document.getElementById("main-search-input")?.focus(),
            50,
          );
        }
      }}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all group border-l-4 ${
        active
          ? isDarkMode
            ? "bg-slate-800 text-blue-400 font-semibold border-blue-500"
            : "bg-slate-200 text-slate-800 font-medium border-blue-600"
          : `border-transparent ${isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 transition-colors ${active ? (isDarkMode ? "text-blue-500" : "text-blue-600") : isDarkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}
        />
        <span>{label}</span>
      </div>
    </button>
  );
};

const SidebarSection = ({
  title,
  children,
  isDarkMode,
}: {
  title: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
}) => (
  <div className="mt-6 mb-2">
    <h3
      className={`px-3 text-[10px] font-bold uppercase tracking-[0.1em] mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
    >
      {title}
    </h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

export const Sidebar = (props: any) => {
  const { user } = useAuth();
  const itemProps = {
    currentView: props.currentView,
    activeTab: props.activeTab,
    setActiveTab: props.setActiveTab,
    selectedCategory: props.selectedCategory,
    setSelectedCategory: props.setSelectedCategory,
    handleNavigate: props.handleNavigate,
    isDarkMode: props.isDarkMode,
  };

  return (
    <aside
      className={`w-60 flex-shrink-0 overflow-y-auto hidden md:block transition-colors border-r ${props.isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}
    >
      <div className="p-3 space-y-0.5">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          view="dashboard"
          {...itemProps}
        />
        <SidebarItem
          icon={Search}
          label="Browse Articles"
          view="browse"
          onClickId="search"
          {...itemProps}
        />

        <SidebarSection title="Infrastructure" isDarkMode={props.isDarkMode}>
          <SidebarItem
            icon={Server}
            label="Network & Servers"
            view="browse"
            categoryTarget="Network"
            {...itemProps}
          />
          <SidebarItem
            icon={Cloud}
            label="Cloud & Hybrid"
            view="browse"
            categoryTarget="Cloud & Hybrid"
            {...itemProps}
          />
          <SidebarItem
            icon={Database}
            label="Databases"
            view="browse"
            categoryTarget="Databases"
            {...itemProps}
          />
          <SidebarItem
            icon={ShieldAlert}
            label="Security Ops"
            view="browse"
            categoryTarget="Security"
            {...itemProps}
          />
          <SidebarItem
            icon={Activity}
            label="DR & BCP"
            view="browse"
            categoryTarget="DR/BCP"
            {...itemProps}
          />
        </SidebarSection>

        <SidebarSection title="Engineering" isDarkMode={props.isDarkMode}>
          <SidebarItem
            icon={Code}
            label="Dev Structure"
            view="browse"
            categoryTarget="Dev Structure"
            {...itemProps}
          />
          <SidebarItem
            icon={GitBranch}
            label="DevOps"
            view="browse"
            categoryTarget="DevOps"
            {...itemProps}
          />
          <SidebarItem
            icon={Blocks}
            label="API Catalog"
            view="browse"
            categoryTarget="API Catalog"
            {...itemProps}
          />
          <SidebarItem
            icon={ListChecks}
            label="Change Mgmt"
            view="browse"
            categoryTarget="Change Mgmt"
            {...itemProps}
          />
        </SidebarSection>

        <SidebarSection title="Governance" isDarkMode={props.isDarkMode}>
          <SidebarItem
            icon={FileText}
            label="Policies & SOPs"
            view="browse"
            categoryTarget="Policies & SOPs"
            {...itemProps}
          />
          {user?.role && ["IED Head", "DevOps & Infra Manager", "Sec & Comp. Manager"].includes(user.role) && (
            <SidebarItem
              icon={ClipboardSignature}
              label="Audit Logs"
              view="browse"
              categoryTarget="Audit Logs"
              {...itemProps}
            />
          )}
          {user?.role === "IED Head" && (
            <SidebarItem
              icon={UserCog}
              label="User Management"
              view="users"
              {...itemProps}
            />
          )}
          <SidebarItem
            icon={BarChartIcon}
            label="Analytics"
            view="analytics"
            {...itemProps}
          />
        </SidebarSection>
        
        <SidebarSection title="Help & Resources" isDarkMode={props.isDarkMode}>
          <SidebarItem
            icon={Book}
            label="Platform Manual"
            view="manual"
            {...itemProps}
          />
          <SidebarItem
            icon={Terminal}
            label="System Logs"
            view="logs"
            {...itemProps}
          />
          <SidebarItem
            icon={Server}
            label="API Integration"
            view="api"
            {...itemProps}
          />
        </SidebarSection>
      </div>
    </aside>
  );
};

export const RightPanel = ({
  handleNavigate,
  setActiveTab,
  isDarkMode,
  articles = [],
}: any) => {
  const { user } = useAuth();
  
  const userArticles = articles.filter((a: any) => a.author === user?.name);
  const authoredCount = userArticles.filter((a: any) => a.status === "Published").length;
  const pendingCount = userArticles.filter((a: any) => a.status === "Pending").length;
  const draftCount = userArticles.filter((a: any) => a.status === "Draft").length;

  // Generate recent activity from articles
  // Generate recent activity from articles (deterministic across pages)
  const parseRelativeTime = (s?: string) => {
    if (!s) return 0;
    const str = String(s).trim().toLowerCase();
    if (str === "just now") return Date.now();
    if (str === "yesterday") return Date.now() - 24 * 60 * 60 * 1000;
    const m = str.match(/^(\d+)\s*([hdwmy])/);
    if (m) {
      const n = parseInt(m[1], 10);
      const unit = m[2];
      const multipliers: any = {
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,
        m: 30 * 24 * 60 * 60 * 1000,
        y: 365 * 24 * 60 * 60 * 1000,
      };
      return Date.now() - n * (multipliers[unit] || 0);
    }
    const parsed = Date.parse(s);
    return isNaN(parsed) ? 0 : parsed;
  };

  const itemsWithTs = articles.map((a: any) => ({
    ...a,
    ts: a.createdAt ? new Date(a.createdAt).getTime() : parseRelativeTime(a.date),
  }));

  const recentActivity = itemsWithTs
    .sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 4)
    .map((a: any, i: number) => {
      let actionStr = "published a new article";
      if (a.status === "Pending") actionStr = "submitted an article for review";
      if (a.status === "Draft") actionStr = "saved a draft";

      const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
      const actor = a.author === user?.name ? "You" : a.author;
      return {
        id: a.id,
        text: `${actor} ${actionStr}: ${a.title}`,
        time: a.date || "Just now",
        color: colors[i % colors.length],
      };
    });

  if (recentActivity.length === 0) {
    recentActivity.push({
      id: "none",
      text: "No recent activity",
      time: "",
      color: "bg-slate-400",
    });
  }

  return (
    <aside
      className={`w-72 flex-shrink-0 overflow-y-auto hidden lg:block transition-colors border-l ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}
    >
      <div className="p-5">
        <h3
          className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
        >
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div key={item.id} className="flex gap-3">
              <div className="mt-1.5 relative flex justify-center">
                <div
                  className={`w-2 h-2 rounded-full ${item.color} z-10`}
                ></div>
                {i !== recentActivity.length - 1 && (
                  <div
                    className={`absolute top-2 w-px h-full ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
                  ></div>
                )}
              </div>
              <div>
                <p
                  className={`text-xs leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  {item.text}
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                >
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {user?.role && user.role !== "NEO" && (
          <>
            <h3
              className={`text-[10px] font-bold uppercase tracking-[0.1em] mt-8 mb-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Quick Links
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate("editor")}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-3">
                  <FilePlus className="w-4 h-4 text-slate-500" />
                  <span>Submit new article</span>
                </div>
              </button>
              <button
                onClick={() => {
                  handleNavigate("dashboard");
                  if (user.role === "DevOps Engineer") {
                    setActiveTab("My Pending Reviews");
                  } else {
                    setActiveTab("To Review & Publish");
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-3">
                  <FileSearch className="w-4 h-4 text-slate-500" />
                  <span>{user.role === "DevOps Engineer" ? "My Pending Reviews" : "Review Articles"}</span>
                </div>
              </button>
              {/* Removed audit quick link */}
              {user.role === "IED Head" && (
                <button
                  onClick={() => handleNavigate("users")}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <div className="flex items-center gap-3">
                    <UserCog className="w-4 h-4 text-slate-500" />
                    <span>Manage Users</span>
                  </div>
                </button>
              )}
            </div>

            <div
              className={`mt-6 p-4 rounded-xl border transition-colors ${isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200/60"}`}
            >
              <h3
                className={`text-xs font-semibold mb-3 ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
              >
                Your Contributions
              </h3>
              <div
                className={`space-y-2 text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                <div
                  className={`flex justify-between items-center py-1 border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                >
                  <span>Authored</span>
                  <span
                    className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    {authoredCount}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center py-1 border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
                >
                  <span>Pending review</span>
                  <span
                    className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                  >
                    {pendingCount}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Drafts</span>
                  <span
                    className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
                  >
                    {draftCount}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleNavigate("editor")}
                className={`w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${isDarkMode ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50" : "text-blue-700 bg-blue-100 hover:bg-blue-200"}`}
              >
                Open Editor <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
