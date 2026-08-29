"use client";

import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
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

function formatMessageTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatMessageContent(content: string): ReactNode {
  if (!content || typeof content !== "string") return null;

  const lines = content.split("\n");

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Headings: ### Title or ## Title
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      const headingText = trimmed.replace(/^#{2,3}\s+/, "");
      return (
        <h4
          key={idx}
          className="text-xs font-bold text-gray-900 uppercase tracking-wider mt-3 mb-1.5 first:mt-0"
        >
          {headingText}
        </h4>
      );
    }

    // Bullet points: * or -
    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
    // Numbered list items: 1. 2. etc
    const isNumbered = /^\d+\.\s+/.test(trimmed);

    let lineText = trimmed;
    if (isBullet) {
      lineText = trimmed.substring(2);
    } else if (isNumbered) {
      lineText = trimmed.replace(/^\d+\.\s+/, "");
    }

    // Parse bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = boldRegex.exec(lineText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(lineText.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-semibold text-gray-900">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < lineText.length) {
      parts.push(lineText.substring(lastIndex));
    }

    const renderedText = parts.length > 0 ? parts : lineText;

    if (isBullet) {
      return (
        <div key={idx} className="flex items-start gap-2 my-1 text-gray-800 text-sm leading-relaxed pl-1">
          <span className="text-gray-400 select-none font-bold mt-0.5" aria-hidden="true">•</span>
          <div className="flex-1">{renderedText}</div>
        </div>
      );
    }

    if (isNumbered) {
      const numMatch = trimmed.match(/^(\d+)\./);
      const num = numMatch ? numMatch[1] : "•";
      return (
        <div key={idx} className="flex items-start gap-2 my-1 text-gray-800 text-sm leading-relaxed pl-1">
          <span className="text-xs font-semibold text-gray-500 min-w-[1.25rem] select-none mt-0.5" aria-hidden="true">
            {num}.
          </span>
          <div className="flex-1">{renderedText}</div>
        </div>
      );
    }

    return (
      <p key={idx} className="my-1.5 text-gray-800 text-sm leading-relaxed">
        {renderedText}
      </p>
    );
  });
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
  const updateMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
    if (typeof window !== "undefined") {
      localStorage.setItem("waru_assistant_messages", JSON.stringify(newMessages));
    }
  }, []);

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

  return (
    <main className="flex-1 flex flex-col bg-gray-50/50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 sm:pb-5 mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                Business Assistant
              </h1>
              <span className="rounded-full bg-black px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-white">
                Asisten Operasional (Boss)
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Analisis data operasional warung dan rekomendasi taktis secara real-time.
            </p>
          </div>
          
          {(sessionId || messages.length > 0) && (
            <button
              onClick={handleResetSession}
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black transition shadow-2xs shrink-0 self-start sm:self-auto min-h-[38px] sm:min-h-[40px]"
            >
              Mulai Sesi Baru
            </button>
          )}
        </header>

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="mb-4 sm:mb-5 rounded-xl bg-red-50 border border-red-200 p-3.5 sm:p-4 text-xs sm:text-sm text-red-800 flex items-start sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
              <svg className="h-5 w-5 shrink-0 text-red-600 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="break-words">{error}</span>
            </div>
            <button 
              type="button"
              onClick={() => setError("")} 
              className="text-red-700 hover:text-red-950 font-semibold text-xs shrink-0 px-2 py-1 rounded hover:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              aria-label="Tutup pesan error"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Chat Workspace */}
        <section
          aria-label="Workspace Percakapan Asisten"
          className="flex-1 flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs min-h-[440px] sm:min-h-[500px]"
        >
          {/* Chat Messages Container */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Riwayat percakapan"
            className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-5 sm:space-y-6 max-h-[60vh] sm:max-h-[65vh]"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12 px-3 sm:px-4">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-3.5 sm:mb-4">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Mulai Konsultasi Operasional</h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                  Pilih pertanyaan cepat di bawah ini atau ketik pertanyaan langsung untuk menganalisis data warung Anda.
                </p>

                <div className="mt-5 sm:mt-6 w-full max-w-lg grid gap-3 grid-cols-1 sm:grid-cols-2 text-left">
                  <button
                    type="button"
                    onClick={() => setInputText("Dari data bisnis saya, apa masalah yang paling mendesak?")}
                    className="min-h-[44px] p-3.5 sm:p-4 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <span className="text-gray-900 font-semibold mb-1 group-hover:text-black">
                      Masalah Mendesak
                    </span>
                    <span className="text-gray-500 leading-normal">
                      &quot;Dari data bisnis saya, apa masalah yang paling mendesak?&quot;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputText("Tampilkan ringkasan menu yang perlu segera ditambah stoknya.")}
                    className="min-h-[44px] p-3.5 sm:p-4 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <span className="text-gray-900 font-semibold mb-1 group-hover:text-black">
                      Restok & Menu
                    </span>
                    <span className="text-gray-500 leading-normal">
                      &quot;Tampilkan ringkasan menu yang perlu segera ditambah stoknya.&quot;
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {messages.map((msg, index) => (
                  <article
                    key={index}
                    aria-label={msg.role === "user" ? "Pesan Anda" : "Balasan Asisten"}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[92%] sm:max-w-[82%] flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-gray-500 font-medium">
                        <span className="uppercase tracking-wider font-semibold">
                          {msg.role === "user" ? "Anda (Boss)" : "WARU Assistant"}
                        </span>
                        {msg.timestamp && (
                          <span className="text-[10px] text-gray-400">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                        )}
                      </div>

                      <div
                        className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm shadow-2xs break-words ${
                          msg.role === "user"
                            ? "bg-black text-white rounded-br-xs"
                            : "bg-gray-100/90 text-gray-900 rounded-bl-xs border border-gray-200/80"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="space-y-0.5">{formatMessageContent(msg.content)}</div>
                        )}
                      </div>

                      {/* Display Structured Business Insights if present */}
                      {msg.role === "assistant" && msg.insights && Array.isArray(msg.insights) && msg.insights.length > 0 && (
                        <div className="mt-2.5 space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">
                            <svg className="h-3.5 w-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Business Intelligence & Rekomendasi</span>
                          </div>

                          <div className="space-y-2">
                            {msg.insights.map((insight, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-gray-200 border-l-4 border-l-black rounded-xl p-3.5 sm:p-4 shadow-2xs transition hover:border-gray-300"
                              >
                                {/* Finding Header */}
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="bg-gray-100 text-gray-800 border border-gray-200 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                                    {insight.category || "OPERASIONAL"}
                                  </span>
                                  <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                                    {insight.summary}
                                  </span>
                                </div>

                                {/* Actionable Recommendations */}
                                {insight.recommendations && Array.isArray(insight.recommendations) && insight.recommendations.length > 0 && (
                                  <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                                      Rekomendasi Tindakan:
                                    </span>
                                    <ul className="space-y-1.5">
                                      {insight.recommendations.map((rec, recIdx) => (
                                        <li
                                          key={recIdx}
                                          className="text-xs text-gray-700 leading-relaxed flex items-start gap-2 bg-gray-50/70 border border-gray-100 rounded-lg px-2.5 sm:px-3 py-2"
                                        >
                                          <svg
                                            className="h-4 w-4 text-black shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          <span className="flex-1 font-medium text-gray-800">{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Processing / Loading State */}
            {loading && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div className="bg-gray-100/90 text-gray-800 rounded-2xl rounded-bl-xs px-4 py-3 border border-gray-200/80 shadow-2xs flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent shrink-0 motion-reduce:animate-none" />
                  <span className="text-xs text-gray-600 font-medium">
                    Asisten sedang menganalisis data operasional...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50/60 flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              placeholder={
                loading
                  ? "Mohon tunggu, asisten sedang menganalisis..."
                  : "Ketik pertanyaan operasional bisnis di sini..."
              }
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent disabled:bg-gray-100 disabled:text-gray-400 transition min-w-0"
              required
              aria-label="Pesan untuk Business Assistant"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="rounded-xl bg-black px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shrink-0 min-h-[38px] sm:min-h-[44px]"
              aria-label="Kirim pesan"
            >
              <span>Kirim</span>
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}




