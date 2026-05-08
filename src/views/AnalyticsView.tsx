import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsView = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  const viewData = [
    { name: 'Mon', views: 400 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 550 },
    { name: 'Thu', views: 450 },
    { name: 'Fri', views: 700 },
    { name: 'Sat', views: 200 },
    { name: 'Sun', views: 150 },
  ];
  
  const categoryData = [
    { name: 'Network', value: 84 },
    { name: 'Security', value: 71 },
    { name: 'Engineering', value: 58 },
    { name: 'DR/BCP', value: 42 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 transition-colors">
      <h2 className={`text-2xl font-serif mb-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Analytics Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`rounded-2xl border shadow-sm p-6 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-md font-semibold mb-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Views Over Past 7 Days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#475569' : '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#475569' : '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderRadius: '12px',
                    border: isDarkMode ? '1px solid #1e293b' : 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: isDarkMode ? '#cbd5e1' : '#1e293b'
                  }}
                  itemStyle={{ color: isDarkMode ? '#cbd5e1' : '#1e293b' }}
                />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: isDarkMode ? '#0f172a' : '#ffffff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`rounded-2xl border shadow-sm p-6 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className={`text-md font-semibold mb-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Articles by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderRadius: '12px',
                    border: isDarkMode ? '1px solid #1e293b' : 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
