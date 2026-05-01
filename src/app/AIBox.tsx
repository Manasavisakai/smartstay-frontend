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

    const apiKey = process.env.NEXT_PUBLIC_AZURE_KEY;


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
    <div id="ai-assistant-box" style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", backgroundColor: "#f9fafb" }}>
      <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem" }}>SmartStay AI Assistant</h3>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your stay..."
          style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.375rem" }}
          onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
        />
        <button 
          onClick={handleAskAI} 
          disabled={loading}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#2563eb", color: "white", borderRadius: "0.375rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Asking..." : "Ask AI"}
        </button>
      </div>
      
      {error && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</p>}
      
      {response && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "white", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}>
          <strong style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#4b5563" }}>AI Response:</strong>
          <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.5" }}>{response}</p>
        </div>
      )}
    </div>
  );
}
