import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export const AuthView = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Viewer" | "Author" | "Approver" | "Admin">(
    "Viewer",
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/api/auth/signin" : "/api/auth/signup";
    const body = isLogin
      ? { email, password }
      : { email, password, name, role };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authenication failed");
      }

      login(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 w-full"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
    >
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg inline-block tracking-wider mx-auto mb-4">
            PSBank
          </div>
          <h2 className="text-xl font-bold dark:text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:text-white"
                >
                  <option value="Viewer">Viewer - General Employee</option>
                  <option value="Author">Author - Subject Matter Expert</option>
                  <option value="Approver">Approver - Manager / Lead</option>
                  <option value="Admin">Admin - IT / Security Team</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};
