import React, { useState, useEffect } from 'react';
import { Terminal, Download, Calendar } from 'lucide-react';

export const SystemLogsView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/logs?date=${selectedDate}&track=true`);
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [selectedDate]);

  const dbLogsStr = logs.length > 0 
    ? logs.map(l => `[${new Date(l.createdAt).toISOString().replace('T', ' ').substring(0, 19)}] ${l.level.padEnd(5)} ${l.message}`).join('\n')
    : "";

  const handleDownload = () => {
    const textToDownload = dbLogsStr || "No logs recorded for this date.";
    const blob = new Blob([textToDownload], { type: 'text/plain' });
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
        System Logs
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
          {isLoading ? (
            <div className={`text-sm py-2 italic flex items-center gap-2 border rounded-lg px-4 ${isDarkMode ? "text-slate-400 border-slate-700" : "text-slate-500 border-slate-200"}`}>
               Loading...
            </div>
          ) : dbLogsStr ? (
            <button 
               onClick={handleDownload}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
               <Download className="w-4 h-4" /> Download Logs
            </button>
          ) : (
            <div className={`text-sm py-2 px-4 italic border rounded-lg ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
              No logs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
