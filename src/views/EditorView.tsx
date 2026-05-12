import React, { useState, useEffect } from "react";
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
  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Network");
  const [accessLevel, setAccessLevel] = useState("Public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([""]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const previousScrollHeight = React.useRef<number>(0);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      setFileProgress((prev) => ({ ...prev, [file.name]: 0 }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgress((prev) => ({ ...prev, [file.name]: progress }));
      }, 50);
    });
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRange) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const pageContent = pages[currentPage - 1] || "";
      let didUpdate = false;
      if (contentRef.current.innerHTML !== pageContent) {
        contentRef.current.innerHTML = pageContent;
        didUpdate = true;
      }
      contentRef.current.focus({ preventScroll: true });
      if (didUpdate) {
        try {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(contentRef.current);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        } catch (e) {}
      }
    }
  }, [currentPage]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length)
      handleAddFiles(Array.from(e.dataTransfer.files));
  };

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const handleSave = async (status: "Draft" | "Pending") => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const currentPages = [...pages];
    if (contentRef.current) {
      currentPages[currentPage - 1] = contentRef.current.innerHTML;
    }
    const contentStr = currentPages.join("<p><!-- PAGE_BREAK --></p>");
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
          "Policies & SOPs",
          "Audit Logs"
        ];
        if (allowed.includes(category)) finalStatus = "Published";
      } else if (user.role === "Sec & Comp. Manager") {
        const allowed = ["Security", "Policies & SOPs", "Audit Logs"];
        if (allowed.includes(category)) finalStatus = "Published";
      }
    }

    let attachmentNameVal = null;
    let attachmentDataVal = null;
    let attachmentsArray: {name: string, data: string}[] = [];

    if (files.length > 0) {
      for (const file of files) {
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          attachmentsArray.push({ name: file.name, data: dataUrl });
        } catch (err) {
          console.error(`Failed to read file ${file.name}`, err);
        }
      }
      
      if (attachmentsArray.length > 0) {
        attachmentNameVal = attachmentsArray[0].name;
        attachmentDataVal = attachmentsArray[0].data;
      }
    }

    try {
      const newArticle = {
        title: title,
        badge: status === "Draft" ? "Draft" : "",
        excerpt: (contentRef.current?.innerText || "").substring(0, 80) + "...",
        content: contentStr,
        category: category,
        accessLevel: accessLevel,
        categoryColor: "bg-blue-100 text-blue-800",
        categoryIcon: "FileText",
        author: user?.name || "Anonymous",
        status: finalStatus,
        date: "Just now",
        views: 0,
        attachmentName: attachmentNameVal,
        attachmentData: attachmentDataVal,
        attachments: attachmentsArray,
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
      "Network", "Cloud & Hybrid", "Databases", "DR/BCP", "Dev Structure", "DevOps", "API Catalog", "Change Mgmt", "Policies & SOPs", "Audit Logs"
    ].includes(category);
  } else if (user?.role === "Sec & Comp. Manager") {
    willPublishDirectly = ["Security", "Policies & SOPs", "Audit Logs"].includes(category);
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
                <select
                  onChange={(e) => {
                     restoreSelection();
                     execCmd("formatBlock", e.target.value);
                     saveSelection();
                  }}
                  className={`text-sm rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${isDarkMode ? "bg-slate-700 text-slate-200 border-none hover:bg-slate-600" : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"}`}
                >
                  <option value="P">Normal text</option>
                  <option value="H1">Title</option>
                  <option value="H2">Heading</option>
                  <option value="H3">Subheading</option>
                </select>

                <div className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}></div>

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
                <div
                  className={`w-px h-4 mx-1 ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}
                ></div>
              </div>

              {/* Editable Area */}
              <div
                ref={contentRef}
                className={`w-full max-w-[816px] h-[1248px] overflow-hidden mx-auto p-12 focus:outline-none prose max-w-none cursor-text transition-colors shadow-lg border prose-li:marker:text-slate-800 dark:prose-li:marker:text-slate-200 ${isDarkMode ? "bg-slate-900 text-slate-300 prose-invert border-slate-800" : "bg-white text-slate-800 prose-slate border-slate-200"}`}
                contentEditable
                suppressContentEditableWarning
                placeholder="Write your article content here..."
                onBlur={saveSelection}
                onMouseUp={saveSelection}
                onKeyUp={(e) => {
                  saveSelection();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const el = e.currentTarget;
                    if (el.scrollHeight > el.clientHeight) {
                       e.preventDefault();
                       const newPages = [...pages];
                       newPages[currentPage - 1] = el.innerHTML;
                       if (currentPage === newPages.length) {
                         newPages.push("<p><br></p>");
                       }
                       setPages(newPages);
                       setCurrentPage(currentPage + 1);
                    }
                  }
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  const newPages = [...pages];
                  newPages[currentPage - 1] = el.innerHTML;
                  setPages(newPages);
                  
                  if (el.scrollHeight > el.clientHeight) {
                     if (currentPage < newPages.length) {
                       setCurrentPage(currentPage + 1);
                     } else {
                       newPages.push("<p><br></p>");
                       setPages(newPages);
                       setCurrentPage(newPages.length);
                     }
                  }
                }}
              ></div>
            </div>

            {/* Pagination Controls */}
            {pages.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                      const newPages = [...pages];
                      if (contentRef.current) newPages[currentPage - 1] = contentRef.current.innerHTML;
                      setPages(newPages);
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50"}`}
                >
                  Previous
                </button>

                <div className={`flex items-center gap-2 mx-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <span>Page</span>
                  <input
                    type="number"
                    min={1}
                    max={pages.length}
                    value={currentPage}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                          const target = Math.min(Math.max(1, val), pages.length);
                          const newPages = [...pages];
                          if (contentRef.current) newPages[currentPage - 1] = contentRef.current.innerHTML;
                          setPages(newPages);
                          setCurrentPage(target);
                      }
                    }}
                    className={`w-16 px-2 py-1.5 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-800"}`}
                  />
                  <span>of {pages.length}</span>
                </div>

                <button
                  disabled={currentPage === pages.length}
                  onClick={() => {
                      const newPages = [...pages];
                      if (contentRef.current) newPages[currentPage - 1] = contentRef.current.innerHTML;
                      setPages(newPages);
                      setCurrentPage((prev) => Math.min(pages.length, prev + 1));
                  }}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-800" : "bg-white border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50"}`}
                >
                  Next
                </button>
              </div>
            )}

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
                    handleAddFiles(Array.from(e.target.files));
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
                {files.map((file, idx) => {
                  const progress = fileProgress[file.name] ?? 0;
                  return (
                    <li
                      key={idx}
                      className={`flex flex-col text-sm p-3 rounded-lg border shadow-sm transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[80%] font-medium">
                          {file.name}
                        </span>
                        <button
                          onClick={() => {
                            setFiles(files.filter((_, i) => i !== idx));
                            setFileProgress((prev) => {
                              const newP = { ...prev };
                              delete newP[file.name];
                              return newP;
                            });
                          }}
                          className="p-1 text-slate-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                         <div 
                            className={`h-full transition-all duration-75 ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${progress}%` }}
                         ></div>
                      </div>
                    </li>
                  )
                })}
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
