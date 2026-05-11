import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
}

export const AiChatDrawer = ({
  isOpen,
  onClose,
  isDarkMode,
  articles,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  articles: any[];
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I have access to the knowledge base. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Track chat instance
  const chatInstanceRef = useRef<any>(null);
  const aiRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      setIsApiAvailable(false);
      return;
    }

    try {
      if (!aiRef.current) {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      }
    } catch (err) {
      console.error("Failed to initialize Gemini:", err);
      setIsApiAvailable(false);
    }
  }, []);

  // Initialize chat with system instruction when articles are available
  useEffect(() => {
    if (!aiRef.current || !isOpen || chatInstanceRef.current) return;

    try {
      const articlesContext = articles.map(a => `Title: ${a.title}\nCategory: ${a.category}\nTags: ${a.tags?.join(', ')}\nContent excerpt: ${a.excerpt}\n`).join('\n\n');
      
      const systemInstruction = `You are a helpful AI assistant for a knowledge base web application. 
Here is a summary of the available articles in the knowledge base:
${articlesContext}
Answer user questions based on this knowledge base if relevant. If something is not in the knowledge base, try to help regardless.
IMPORTANT: Reply concisely and directly to the point. Give ONLY what is asked. Do not repeat the user's question or add redundant conversational filler. Use paragraphs for proper spacing but DO NOT use markdown formatting like **bold** text. Return plain text only.`;

      chatInstanceRef.current = aiRef.current.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemInstruction,
        }
      });
    } catch (err) {
      console.error("Failed to start chat session:", err);
      // Wait for it
    }
  }, [aiRef.current, isOpen, articles]);


  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isApiAvailable) {
      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'system', content: 'Gemini API is not available or not configured' }]);
      setInput('');
      return;
    }

    if (!chatInstanceRef.current) {
      setError("Chat instance is not initialized yet.");
      return;
    }

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);
    setError(null);

    try {
      let streamResponse = await chatInstanceRef.current.sendMessageStream({ message: userText });
      
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      let currentText = '';
      for await (const chunk of streamResponse) {
        if (chunk && chunk.text) {
           currentText += chunk.text;
           setMessages(prev => {
             const newMsgs = [...prev];
             newMsgs[newMsgs.length - 1] = { role: 'model', content: currentText };
             return newMsgs;
           });
        }
      }
    } catch (err: any) {
      console.error('AI Chat error:', err);
      setError(err.message || "Failed to generate response. Check consol for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 z-40 backdrop-blur-sm lg:hidden transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? "bg-slate-900 border-l border-slate-800 text-slate-200" : "bg-white border-l border-slate-200 text-slate-800"}`}
      >
        <div className={`p-4 border-b flex items-center justify-between shadow-sm z-10 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
               <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg">AI Assistant</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? "bg-slate-950/50" : "bg-slate-50"}`}>
          {!isApiAvailable ? (
            <div className={`p-4 rounded-lg flex gap-3 text-sm border shadow-sm ${isDarkMode ? "bg-rose-900/20 border-rose-800/50 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
               <AlertCircle className="w-5 h-5 shrink-0" />
               <p>AI features are currently not available. Please configure the GEMINI_API_KEY environment variable.</p>
            </div>
          ) : null}

          {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
                   msg.role === 'user' 
                     ? (isDarkMode ? "bg-indigo-900/50 text-indigo-400 border-indigo-800" : "bg-indigo-100 text-indigo-700 border-indigo-200")
                     : msg.role === 'system'
                     ? (isDarkMode ? "bg-rose-900/30 text-rose-400 border-rose-800" : "bg-rose-50 text-rose-600 border-rose-200")
                     : (isDarkMode ? "bg-blue-900/30 text-blue-400 border-blue-900/50" : "bg-blue-50 text-blue-600 border-blue-100")
                }`}>
                   {msg.role === 'user' ? <User className="w-4 h-4" /> : msg.role === 'system' ? <AlertCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm text-sm whitespace-pre-wrap ${
                   msg.role === 'user' 
                     ? "bg-blue-600 text-white rounded-tr-sm" 
                     : msg.role === 'system'
                     ? (isDarkMode ? "bg-rose-900/20 text-rose-300 border border-rose-800/50 rounded-tl-sm" : "bg-rose-50 text-rose-700 border border-rose-200 rounded-tl-sm")
                     : (isDarkMode ? "bg-slate-800 border-slate-700 rounded-tl-sm text-slate-300" : "bg-white border-slate-200 rounded-tl-sm text-slate-700")
                } ${msg.role !== 'user' && msg.role !== 'system' && 'border'}`}>
                   {msg.content}
                </div>
             </div>
          ))}
          
          {isLoading && (
             <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${isDarkMode ? "bg-blue-900/30 text-blue-400 border-blue-900/50" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                   <Sparkles className="w-4 h-4" />
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm border rounded-tl-sm flex items-center ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}>
                   <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
             </div>
          )}

          {error && (
             <div className={`p-3 rounded-lg text-sm border shadow-sm ${isDarkMode ? "bg-red-900/20 border-red-800/50 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>
                {error}
             </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className={`p-4 border-t z-10 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
           <div className={`flex items-end gap-2 p-2 rounded-xl border shadow-sm transition-colors focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 ${isDarkMode ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-300"}`}>
              <textarea 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading || !isApiAvailable}
                placeholder={isApiAvailable ? "Ask anything about the articles..." : "Not available"}
                className="w-full bg-transparent border-none resize-none px-2 py-1.5 focus:outline-none max-h-32 text-sm"
                rows={1}
                style={{ minHeight: '40px' }}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !isApiAvailable}
                className="p-2.5 rounded-lg bg-blue-600 text-white disabled:bg-slate-400 hover:bg-blue-700 transition-colors shadow-sm mb-0.5"
              >
                 <Send className="w-4 h-4" />
              </button>
           </div>
           <p className={`text-[10px] text-center mt-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </>
  );
};
