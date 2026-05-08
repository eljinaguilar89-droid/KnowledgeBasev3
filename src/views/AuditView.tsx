import React from 'react';
import { mockAuditLogs } from '../data';

export const AuditView = ({ isDarkMode }: { isDarkMode?: boolean }) => (
  <div className="max-w-5xl mx-auto py-8 px-6 transition-colors">
    <h2 className={`text-2xl font-serif mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Audit Trail</h2>
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`border-b text-xs uppercase transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">Date</th>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">User</th>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">Action</th>
            <th className="px-6 py-4 font-bold tracking-[0.1em]">Item</th>
          </tr>
        </thead>
        <tbody className={`divide-y transition-colors ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
          {mockAuditLogs.map(log => (
            <tr key={log.id} className={`transition-colors text-sm ${isDarkMode ? 'hover:bg-slate-800/40 text-slate-400' : 'hover:bg-slate-50'}`}>
              <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{log.date}</td>
              <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.user}</td>
              <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{log.action}</td>
              <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{log.item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
