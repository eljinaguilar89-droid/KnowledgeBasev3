import React, { useState, useEffect } from "react";
import { Shield, UserCog } from "lucide-react";

export const UsersView = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert("Failed to update role");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update role");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
          <UserCog className="w-5 h-5" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>User Management</h1>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage roles and permissions</p>
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs uppercase tracking-wider ${isDarkMode ? 'border-slate-800 bg-slate-800/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {users.map((user) => (
              <tr key={user.id} className={`border-b last:border-0 ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-100 hover:bg-slate-50/50'}`}>
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                    user.role === 'Admin' ? (isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700') :
                    user.role === 'Approver' ? (isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800') :
                    user.role === 'Author' ? (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700') :
                    (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`w-full max-w-[160px] px-3 py-1.5 text-sm rounded-lg outline-none transition-colors border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Author">Author</option>
                    <option value="Approver">Approver</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
