import React from 'react';
import { mockAuditLogs } from '../data';

export const AuditView = () => (
  <div className="max-w-5xl mx-auto py-8 px-6">
    <h2 className="text-2xl font-serif text-slate-800 mb-6">Audit Trail</h2>
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
            <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
            <th className="px-6 py-4 font-semibold tracking-wider">User</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Action</th>
            <th className="px-6 py-4 font-semibold tracking-wider">Item</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-100">
          {mockAuditLogs.map(log => (
            <tr key={log.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.date}</td>
              <td className="px-6 py-4 font-medium text-slate-700">{log.user}</td>
              <td className="px-6 py-4 text-blue-600 font-medium">{log.action}</td>
              <td className="px-6 py-4 text-slate-800">{log.item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
