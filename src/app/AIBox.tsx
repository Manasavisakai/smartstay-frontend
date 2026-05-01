"use client";

import { useState } from "react";

export default function AIBox() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");

    const apiKey = process.env.NEXT_PUBLIC_AZURE_KEY || "";

    if (!apiKey) {

      console.error("NEXT_PUBLIC_AZURE_KEY is not defined in environment variables");
      setError("AI unavailable: Configuration error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://smartstay-ai.openai.azure.com/openai/deployments/smartstay-ai/chat/completions?api-version=2025-01-01-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },

        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a SmartStay assistant." },
            { role: "user", content: query }
          ],
          max_tokens: 100
        }),
      });

      if (!res.ok) {
        throw new Error("AI unavailable");
      }

      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        const content = data.choices[0].message.content;
        setResponse(content);
      } else {
        throw new Error("No response content");
      }
    } catch (err) {
      console.error("AI Error:", err);
      setError("AI unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant-box" className="mt-12 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">SmartStay AI Concierge</h3>
      </div>
      
      <div className="relative group">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="How can I help you with your stay today?"
            className="flex-1 px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-gray-700 placeholder-gray-400 font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
          />
          <button 
            onClick={handleAskAI} 
            disabled={loading}
            className={`px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              loading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 shadow-blue-100"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Ask AI"}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-red-600 text-sm font-semibold">{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h4 className="text-xs uppercase font-bold text-blue-600 tracking-widest mb-3">AI Response</h4>
          <p className="text-gray-800 text-lg leading-relaxed font-medium">{response}</p>
        </div>
      )}
    </div>
  );
}

