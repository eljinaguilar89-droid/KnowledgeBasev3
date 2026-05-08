import React, { useState } from 'react';
import { ArrowLeft, Send, Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { IconButton } from '../components/ui';
import { mockArticles } from '../data';

export const EditorView = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Network');
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length) setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };
  
  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const handleSave = (status: 'Draft' | 'Pending') => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    const contentStr = contentRef.current?.innerText || 'No content provided.';
    
    mockArticles.unshift({
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      version: 'v1.0',
      badge: status === 'Draft' ? 'Draft' : '',
      excerpt: contentStr.substring(0, 80) + '...',
      content: contentStr,
      category: category,
      categoryColor: 'bg-blue-100 text-blue-800',
      categoryIcon: 'FileText',
      author: 'JD',
      status: status,
      date: 'Just now',
      views: 0
    });
    
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-serif text-slate-800 mb-6">Create New Article</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Article Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Setting up VPN on MacOS" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50">
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
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
              <input type="text" placeholder="e.g. guides, setup, mac" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Article Content</label>
            <div className="bg-slate-50 border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-b border-slate-300 p-2 bg-slate-100 flex-wrap">
                <IconButton icon={Bold} onClick={() => execCmd('bold')} className="hover:bg-slate-200" />
                <IconButton icon={Italic} onClick={() => execCmd('italic')} className="hover:bg-slate-200" />
                <IconButton icon={Underline} onClick={() => execCmd('underline')} className="hover:bg-slate-200" />
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <IconButton icon={List} onClick={() => execCmd('insertUnorderedList')} className="hover:bg-slate-200" />
                <IconButton icon={ListOrdered} onClick={() => execCmd('insertOrderedList')} className="hover:bg-slate-200" />
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <IconButton icon={Link} onClick={() => { const url = prompt('URL:'); if(url) execCmd('createLink', url); }} className="hover:bg-slate-200" />
                <IconButton icon={ImageIcon} className="hover:bg-slate-200" />
              </div>
              
              {/* Editable Area */}
              <div 
                ref={contentRef}
                className="w-full min-h-[300px] p-4 bg-white focus:outline-none prose prose-slate max-w-none text-sm cursor-text"
                contentEditable
                suppressContentEditableWarning
                placeholder="Write your article content here..."
              ></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`}
            >
              <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => {
                if(e.target.files) setFiles([...files, ...Array.from(e.target.files)]);
              }} />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                <UploadCloud className={`w-10 h-10 mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                <p className="text-sm text-slate-700 mb-1"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">PDF, DOC, images up to 10MB</p>
              </label>
            </div>
            
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <span className="truncate max-w-[80%] text-slate-700 font-medium">{file.name}</span>
                    <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </div>
        
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <button onClick={() => onNavigate('dashboard')} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => handleSave('Draft')} className="px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">Save as Draft</button>
          <button onClick={() => handleSave('Pending')} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Send className="w-4 h-4" /> Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};
