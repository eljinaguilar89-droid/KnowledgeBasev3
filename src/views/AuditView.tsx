import React from "react";
import { mockAuditLogs } from "../data";
import { Download } from "lucide-react";
import { useAuth } from "../AuthContext";

export const AuditView = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-serif ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
        >
          Audit Trail
        </h2>
        
        {(user?.role === "IED Head" || user?.role === "DevOps & Infra Manager" || user?.role === "Sec & Comp. Manager") && (
          <button 
            onClick={() => alert("CSV Download Initiated")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm ${isDarkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"}`}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className={`border-b text-xs uppercase transition-colors ${isDarkMode ? "bg-slate-800/50 border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-500"}`}
          >
            <th className="px-6 py-4 font-bold tracking-[0.1em]">Date</th>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">User</th>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">Action</th>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">Item</th>
          </tr>
        </thead>
        <tbody
          className={`divide-y transition-colors ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}
        >
          {mockAuditLogs.map((log) => (
            <tr
              key={log.id}
              className={`transition-colors text-sm ${isDarkMode ? "hover:bg-slate-800/40 text-slate-400" : "hover:bg-slate-50"}`}
            >
              <td
                className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}
              >
                {log.date}
              </td>
              <td
                className={`px-6 py-4 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                {log.user}
              </td>
              <td
                className={`px-6 py-4 font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                {log.action}
              </td>
              <td
                className={`px-6 py-4 ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}
              >
                {log.item}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};
