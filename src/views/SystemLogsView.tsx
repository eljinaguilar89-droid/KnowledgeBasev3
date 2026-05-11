import React, { useState } from 'react';
import { Terminal, Download, Calendar } from 'lucide-react';

export const SystemLogsView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock logs for demonstration
  const generateLogsForDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (date !== today && date !== "2026-05-10") { // just today and an arbitrary past date for demo
      return "";
    }
    return `[${date} 00:00:01] INFO  System startup complete
[${date} 00:05:23] WARN  API rate limit approached for endpoint /api/articles
[${date} 01:12:45] ERROR Auth service timeout - Retrying...
[${date} 01:12:47] INFO  Auth service connected
[${date} 02:30:10] INFO  User 'admin' uploaded attachment
[${date} 03:45:00] WARN  Database query slow (500ms) - SELECT * FROM articles
[${date} 05:22:15] INFO  Background sync completed normally
[${date} 06:10:05] ERROR UI Render Error in ArticleDetailView - invalid prop
[${date} 07:05:44] INFO  System health check: OK
`;
  };

  const currentLogs = generateLogsForDate(selectedDate);

  const handleDownload = () => {
    const blob = new Blob([currentLogs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${selectedDate}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`max-w-4xl mx-auto py-8 px-6 transition-colors ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
      <h1 className={`text-3xl font-serif font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-slate-900"} flex items-center gap-3`}>
        Web System Logs
      </h1>
      
      <p className="text-lg mb-8 leading-relaxed">
        Access technical system logs for debugging and error tracing. Select a date to view the logs for that day.
      </p>

      <div className={`p-6 border rounded-xl shadow-sm mb-6 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className={`w-5 h-5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`} />
            <input 
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-700"}`}
            />
          </div>
          {currentLogs ? (
            <button 
               onClick={handleDownload}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
               <Download className="w-4 h-4" /> Download Logs
            </button>
          ) : (
            <div className={`text-sm py-2 italic ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              No logs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
