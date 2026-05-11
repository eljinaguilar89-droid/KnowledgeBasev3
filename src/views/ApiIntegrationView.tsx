import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Copy, Key, Server, RotateCw } from "lucide-react";

export const ApiIntegrationView = ({ isDarkMode }: { isDarkMode?: boolean }) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const generateKey = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id })
      });
      const data = await res.json();
      if (data.apiKey) {
        if (login) {
          user.apiKey = data.apiKey;
          login(user);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className={`p-8 animate-fade-in ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">API Integration</h2>
        <p className={`mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Access the IED Knowledge Base programmatically via our REST API.
        </p>

        <div className={`p-6 rounded-2xl mb-8 border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Your API Key</h3>
          </div>
          
          {user?.apiKey ? (
            <div className="flex items-center gap-2 mt-4">
              <code className={`flex-1 p-3 rounded-lg font-mono text-sm break-all ${isDarkMode ? "bg-slate-950 text-emerald-400" : "bg-slate-100 text-emerald-600"}`}>
                {user.apiKey}
              </code>
              <button
                onClick={() => copyToClipboard(user.apiKey)}
                className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                title="Copy API Key"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={generateKey}
                disabled={loading}
                className={`p-3 rounded-lg transition-colors ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                title="Regenerate API Key"
              >
                <RotateCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className={`mb-4 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                You don't have an active API key yet. Generate one to authenticate your requests.
              </p>
              <button
                disabled={loading}
                onClick={generateKey}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                {loading ? "Generating..." : "Generate API Key"}
              </button>
            </div>
          )}
        </div>

        <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Endpoints & Usage</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${isDarkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700"}`}>GET</span>
                /api/public/v1/articles
              </h4>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Retrieves all published articles in the IED Knowledge Base.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${isDarkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700"}`}>GET</span>
                /api/public/v1/categories
              </h4>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Retrieves all article categories and metadata.
              </p>
            </div>

            <div className={`p-4 rounded-xl mt-6 font-mono text-sm overflow-x-auto ${isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-100 text-slate-800"}`}>
              <div className="mb-2 text-slate-500">// Example Authentication via Header</div>
              <div>curl -H <span className="text-blue-400">"x-api-key: YOUR_API_KEY"</span> https://api.example.com/api/public/v1/articles</div>
              
              <div className="mt-4 mb-2 text-slate-500">// Example Authentication via Query</div>
              <div>curl https://api.example.com/api/public/v1/articles?apiKey=YOUR_API_KEY</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
