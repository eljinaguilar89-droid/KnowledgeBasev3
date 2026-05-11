import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  Bold,
  Italic,
  Underline,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";
import { IconButton } from "../components/ui";
import { mockArticles } from "../data";
import { useAuth } from "../AuthContext";

export const EditorView = ({
  onNavigate,
  isDarkMode,
  refreshArticles,
  categories = [],
}: {
  onNavigate: (view: any) => void;
  isDarkMode?: boolean;
  refreshArticles?: () => void;
  categories?: any[];
}) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Network");
  const [accessLevel, setAccessLevel] = useState("Public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length)
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const handleSave = async (status: "Draft" | "Pending") => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const contentStr = contentRef.current?.innerText || "No content provided.";
    setIsSubmitting(true);

    let finalStatus: "Draft" | "Pending" | "Published" = status;
    if (status === "Pending" && user?.role) {
      if (user.role === "IED Head") {
        finalStatus = "Published";
      } else if (user.role === "DevOps & Infra Manager") {
        const allowed = [
          "Network",
          "Cloud & Hybrid",
          "Databases",
          "DR/BCP",
          "Dev Structure",
          "DevOps",
          "API Catalog",
          "Change Mgmt",
          "Policies & SOPs"
        ];
        if (allowed.includes(category)) finalStatus = "Published";
      } else if (user.role === "Sec & Comp. Manager") {
        const allowed = ["Security", "Policies & SOPs"];
        if (allowed.includes(category)) finalStatus = "Published";
      }
    }

    try {
      const newArticle = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        badge: status === "Draft" ? "Draft" : "",
        excerpt: contentStr.substring(0, 80) + "...",
        content: contentStr,
        category: category,
        accessLevel: accessLevel,
        categoryColor: "bg-blue-100 text-blue-800",
        categoryIcon: "FileText",
        author: user?.name || "Anonymous",
        status: finalStatus,
        date: "Just now",
        views: 0,
      };

      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });

      if (refreshArticles) await refreshArticles();
      onNavigate("dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to save article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isManager = user?.role && ["DevOps & Infra Manager", "Sec & Comp. Manager"].includes(user.role);
  const isHead = user?.role === "IED Head";
  
  let willPublishDirectly = false;
  if (isHead) willPublishDirectly = true;
  else if (user?.role === "DevOps & Infra Manager") {
    willPublishDirectly = [
      "Network", "Cloud & Hybrid", "Databases", "DR/BCP", "Dev Structure", "DevOps", "API Catalog", "Change Mgmt", "Policies & SOPs"
    ].includes(category);
  } else if (user?.role === "Sec & Comp. Manager") {
    willPublishDirectly = ["Security", "Policies & SOPs"].includes(category);
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 transition-colors">
      <button
        onClick={() => onNavigate("dashboard")}
        className={`flex items-center gap-2 text-sm mb-6 transition-colors ${isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800"}`}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div
        className={`rounded-2xl border shadow-sm p-8 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        <h2
          className={`text-2xl font-serif mb-6 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
        >
          Create New Article
        </h2>

        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
            >
              Article Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="e.g. Setting up VPN on MacOS"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600" : "bg-slate-50 border-slate-300 text-slate-800"}`}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-800"}`}
              >
                {Array.from(new Set(categories.map((c: any) => c.group))).map((groupName: any) => (
                  <optgroup key={groupName} label={groupName}>
                    {categories.filter((c: any) => c.group === groupName).map((c: any) => (
                      <option key={c.id || c.filterCategory} value={c.filterCategory}>{c.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
              >
                Access Level
              </label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-800"}`}
              >
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
                <option value="Confidential">Confidential</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>
            <div className="hidden md:block">
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. guides, setup, mac"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-600" : "bg-slate-50 border-slate-300 text-slate-800"}`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
            >
              Article Content
            </label>
            <div
              className={`border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all ${isDarkMode ? "border-slate-700" : "border-slate-300"}`}
            >
              {/* Toolbar */}
              <div
                className={`flex items-center gap-1 border-b p-2 flex-wrap transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}
              >
                <IconButton
                  icon={Bold}
                  onClick={() => execCmd("bold")}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
                <IconButton
                  icon={Italic}
                  onClick={() => execCmd("italic")}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
                <IconButton
                  icon={Underline}
                  onClick={() => execCmd("underline")}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
                <div
                  className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}
                ></div>
                <IconButton
                  icon={List}
                  onClick={() => execCmd("insertUnorderedList")}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
                <IconButton
                  icon={ListOrdered}
                  onClick={() => execCmd("insertOrderedList")}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
                <div
                  className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}
                ></div>
                <IconButton
                  icon={Link}
                  onClick={() => {
                    const url = prompt("URL:");
                    if (url) execCmd("createLink", url);
                  }}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
                <IconButton
                  icon={ImageIcon}
                  className={
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Editable Area */}
              <div
                ref={contentRef}
                className={`w-full min-h-[350px] p-6 focus:outline-none prose prose-sm max-w-none cursor-text transition-colors ${isDarkMode ? "bg-slate-950 text-slate-300 prose-invert" : "bg-white text-slate-800 prose-slate"}`}
                contentEditable
                suppressContentEditableWarning
                placeholder="Write your article content here..."
              ></div>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
            >
              Attachments
            </label>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? isDarkMode
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-blue-500 bg-blue-50"
                  : isDarkMode
                    ? "border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/60"
                    : "border-slate-300 hover:border-blue-400 bg-slate-50"
              }`}
            >
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files)
                    setFiles([...files, ...Array.from(e.target.files)]);
                }}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center w-full h-full"
              >
                <UploadCloud
                  className={`w-10 h-10 mb-4 ${isDragging ? "text-blue-500" : isDarkMode ? "text-slate-600" : "text-slate-300"}`}
                />
                <p
                  className={`text-sm mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}
                >
                  <span className="font-semibold text-blue-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-slate-400">
                  PDF, DOC, images up to 10MB
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center justify-between text-sm p-3 rounded-lg border shadow-sm transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}
                  >
                    <span className="truncate max-w-[80%] font-medium">
                      {file.name}
                    </span>
                    <button
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== idx))
                      }
                      className="p-1 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          className={`mt-8 flex items-center justify-end gap-3 border-t pt-6 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
        >
          <button
            disabled={isSubmitting}
            onClick={() => onNavigate("dashboard")}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => handleSave("Draft")}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50" : "text-blue-700 bg-blue-100 hover:bg-blue-200"}`}
          >
            Save as Draft
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => handleSave("Pending")}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              willPublishDirectly ? "Publishing..." : "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4" /> {willPublishDirectly ? "Publish Article" : "Submit for Review"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
