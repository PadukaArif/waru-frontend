"use client";

import { useEffect, useState, useRef } from "react";
import {
  createAssistantSession,
  sendAssistantMessage,
  type BusinessInsight,
} from "@/services/assistant";
import { ApiError } from "@/services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  insights?: BusinessInsight[];
  timestamp: string;
}

export default function BusinessAssistantPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = localStorage.getItem("waru_assistant_session_id");
      const storedMessages = localStorage.getItem("waru_assistant_messages");
      
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
      if (storedMessages) {
        try {
          setMessages(JSON.parse(storedMessages));
        } catch (e) {
          console.error("Failed to parse stored messages", e);
        }
      }
    }
  }, []);

  // Save messages to localStorage when updated
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (typeof window !== "undefined") {
      localStorage.setItem("waru_assistant_messages", JSON.stringify(newMessages));
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userQuery = inputText.trim();
    setInputText("");
    setError("");

    // Add user message to log
    const userMessage: Message = {
      role: "user",
      content: userQuery,
      timestamp: new Date().toISOString(),
    };
    const updatedMsgs = [...messages, userMessage];
    updateMessages(updatedMsgs);
    setLoading(true);

    try {
      if (!sessionId) {
        // First message: Create session
        const response = await createAssistantSession({ message: userQuery });
        setSessionId(response.sessionId);
        if (typeof window !== "undefined") {
          localStorage.setItem("waru_assistant_session_id", response.sessionId);
        }

        const aiMessage: Message = {
          role: "assistant",
          content: response.response.message,
          insights: response.response.insights,
          timestamp: new Date().toISOString(),
        };
        updateMessages([...updatedMsgs, aiMessage]);
      } else {
        // Subsequent message: Send to existing session
        const response = await sendAssistantMessage(sessionId, { message: userQuery });

        const aiMessage: Message = {
          role: "assistant",
          content: response.message,
          insights: response.insights,
          timestamp: new Date().toISOString(),
        };
        updateMessages([...updatedMsgs, aiMessage]);
      }
    } catch (err) {
      console.error(err);
      
      // Handle stale session (404 Not Found)
      if (err instanceof ApiError && err.status === 404) {
        setSessionId(null);
        updateMessages([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("waru_assistant_session_id");
          localStorage.removeItem("waru_assistant_messages");
        }
        setError("Sesi chat sebelumnya sudah kedaluwarsa atau dihapus dari server. Obrolan telah direset, silakan kirim ulang pesan Anda.");
      } else {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi AI.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleResetSession() {
    if (confirm("Apakah Anda yakin ingin memulai sesi baru? Sesi chat saat ini akan direset.")) {
      setSessionId(null);
      updateMessages([]);
      setError("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("waru_assistant_session_id");
        localStorage.removeItem("waru_assistant_messages");
      }
    }
  }

  function formatMessage(content: string) {
    return content.split("\n").map((line, idx) => {
      let formattedLine = line;
      
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      if (isBullet) {
        formattedLine = line.trim().substring(2);
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(formattedLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formattedLine.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-semibold text-black">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < formattedLine.length) {
        parts.push(formattedLine.substring(lastIndex));
      }

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc pl-1 my-1 text-gray-800">
            {parts.length > 0 ? parts : formattedLine}
          </li>
        );
      }

      return (
        <p key={idx} className={line.trim() === "" ? "h-3" : "my-1 text-gray-800 leading-relaxed"}>
          {parts.length > 0 ? parts : formattedLine}
        </p>
      );
    });
  }

  return (
    <main className="flex-1 flex flex-col min-h-[85vh] bg-gray-50/50">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Business Assistant</h1>
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600">
                AI Copilot
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Analisis data operasional warung dan rekomendasi taktis secara real-time.
            </p>
          </div>
          
          {(sessionId || messages.length > 0) && (
            <button
              onClick={handleResetSession}
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-xs"
            >
              Mulai Sesi Baru
            </button>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError("")} 
              className="text-red-500 hover:text-red-700 font-bold ml-4"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Chat Workspace */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs min-h-[50vh]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[55vh]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Mulai konsultasi bisnis Anda</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md">
                  Tanyakan apa saja tentang menu terlaris, status stok, performa transaksi, atau masalah mendesak di warung Anda.
                </p>
                <div className="mt-6 w-full max-w-md grid gap-3">
                  <button
                    onClick={() => setInputText("Dari data bisnis saya, apa masalah yang paling mendesak?")}
                    className="w-full text-left px-4 py-3 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border rounded-xl transition"
                  >
                    💡 &quot;Dari data bisnis saya, apa masalah yang paling mendesak?&quot;
                  </button>
                  <button
                    onClick={() => setInputText("Tampilkan ringkasan menu yang perlu segera ditambah stoknya.")}
                    className="w-full text-left px-4 py-3 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border rounded-xl transition"
                  >
                    💡 &quot;Tampilkan ringkasan menu yang perlu segera ditambah stoknya.&quot;
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%] flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-5 py-3.5 text-sm shadow-xs ${
                          msg.role === "user"
                            ? "bg-black text-white rounded-br-none"
                            : "bg-gray-100/80 text-gray-900 rounded-bl-none border border-gray-200/50"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="space-y-1">{formatMessage(msg.content)}</div>
                        )}
                      </div>

                      {/* Display Insights if present and role is assistant */}
                      {msg.role === "assistant" && msg.insights && msg.insights.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {msg.insights.map((insight, idx) => (
                            <div key={idx} className="bg-indigo-50/50 border border-indigo-100/70 rounded-xl p-4">
                              <h4 className="text-xs font-bold text-indigo-700 tracking-wider uppercase mb-1 flex items-center gap-1.5">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {insight.category.toUpperCase()} Insight: {insight.summary}
                              </h4>
                              <ul className="space-y-1 mt-2">
                                {insight.recommendations.map((rec, recIdx) => (
                                  <li key={recIdx} className="text-xs text-indigo-900/90 leading-relaxed flex items-start gap-2">
                                    <span className="text-indigo-500 mt-0.5">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Processing State */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none px-5 py-3.5 border border-gray-200/50 shadow-xs flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">AI sedang menganalisis data bisnis...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t p-4 bg-gray-50/50 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              placeholder={
                loading
                  ? "Mohon tunggu, AI sedang berpikir..."
                  : "Ketik pertanyaan Anda tentang bisnis di sini..."
              }
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 transition"
              required
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <span>Kirim</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
