"use client";

import { useEffect, useState, useRef, useCallback, memo, type ReactNode } from "react";
import {
  createAssistantSession,
  sendAssistantMessage,
  type BusinessInsight,
} from "@/services/assistant";
import { ApiError } from "@/services/api";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";

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

/**
 * Sanitizes raw HTML tags (such as <br>, <p>, <b>) into markdown/newlines
 * and renders formatted React nodes including headings, lists, bold text, and markdown tables.
 */
function formatMessageContent(content: string): ReactNode {
  if (!content || typeof content !== "string") return null;

  // 1. Sanitize raw HTML tags into standard markdown / newlines
  const sanitizedContent = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?p>/gi, "\n")
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<\/?div>/gi, "\n");

  const rawLines = sanitizedContent.split("\n");
  const processedElements: ReactNode[] = [];

  let inTable = false;
  let tableHeaderRow: string[] = [];
  let tableDataRows: string[][] = [];

  function flushTable(tableIndex: number) {
    if (tableHeaderRow.length > 0) {
      processedElements.push(
        <div key={`table-${tableIndex}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100/80 text-navy font-extrabold border-b border-slate-200">
              <tr>
                {tableHeaderRow.map((cell, cIdx) => (
                  <th key={cIdx} className="px-3.5 py-2.5">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableDataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/60">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableHeaderRow = [];
    tableDataRows = [];
    inTable = false;
  }

  for (let idx = 0; idx < rawLines.length; idx++) {
    const line = rawLines[idx];
    const trimmed = line.trim();

    // Table line detector (contains | and has at least two cells)
    const isTableLine = trimmed.startsWith("|") || (trimmed.includes("|") && trimmed.split("|").length > 2);

    if (isTableLine) {
      // Ignore separator row like |---|---|
      if (/^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+$/.test(trimmed)) {
        continue;
      }

      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((c, cellIdx, arr) => {
          if ((cellIdx === 0 || cellIdx === arr.length - 1) && c === "") return false;
          return true;
        });

      if (!inTable) {
        inTable = true;
        tableHeaderRow = cells;
      } else {
        tableDataRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(idx);
    }

    if (!trimmed) {
      processedElements.push(<div key={`space-${idx}`} className="h-1.5" />);
      continue;
    }

    // Headings: ### Title or ## Title
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      const headingText = trimmed.replace(/^#{2,3}\s+/, "");
      processedElements.push(
        <h4
          key={`h-${idx}`}
          className="text-xs font-black text-navy uppercase tracking-wider mt-3 mb-1.5"
        >
          {headingText}
        </h4>
      );
      continue;
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
        <strong key={match.index} className="font-bold text-navy">
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
      processedElements.push(
        <div key={`bullet-${idx}`} className="flex items-start gap-2 my-1 text-slate-800 text-xs sm:text-sm leading-relaxed pl-1">
          <span className="text-blue-primary select-none font-bold mt-0.5" aria-hidden="true">•</span>
          <div className="flex-1">{renderedText}</div>
        </div>
      );
      continue;
    }

    if (isNumbered) {
      const numMatch = trimmed.match(/^(\d+)\./);
      const num = numMatch ? numMatch[1] : "•";
      processedElements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2 my-1 text-slate-800 text-xs sm:text-sm leading-relaxed pl-1">
          <span className="text-xs font-bold text-blue-primary min-w-5 select-none mt-0.5" aria-hidden="true">
            {num}.
          </span>
          <div className="flex-1">{renderedText}</div>
        </div>
      );
      continue;
    }

    processedElements.push(
      <p key={`p-${idx}`} className="my-1.5 text-slate-800 text-xs sm:text-sm leading-relaxed">
        {renderedText}
      </p>
    );
  }

  if (inTable) {
    flushTable(rawLines.length);
  }

  return processedElements;
}

/**
 * Memoized Chat Message Item Component
 * Prevents heavy Markdown/regex parsing (`formatMessageContent`) from re-executing
 * when `inputText` state changes in the parent `BusinessAssistantPage` component.
 */
const AssistantMessageItem = memo(function AssistantMessageItem({
  msg,
}: {
  msg: Message;
}) {
  return (
    <article
      aria-label={msg.role === "user" ? "Pesan Anda" : "Balasan Asisten"}
      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[92%] sm:max-w-[85%] flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-slate-500 font-semibold">
          <span className="uppercase tracking-wider">
            {msg.role === "user" ? "Anda (Boss)" : "WARU Business Assistant"}
          </span>
          {msg.timestamp && (
            <span className="text-[10px] text-slate-400 font-normal">
              {formatMessageTime(msg.timestamp)}
            </span>
          )}
        </div>

        <div
          className={`rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm shadow-xs wrap-break-word ${
            msg.role === "user"
              ? "bg-navy text-white rounded-br-xs font-medium"
              : "bg-slate-50 text-navy rounded-bl-xs border border-slate-200"
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
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              <svg className="h-3.5 w-3.5 text-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Business Intelligence & Rekomendasi</span>
            </div>

            <div className="space-y-2.5">
              {msg.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 border-l-4 border-l-blue-primary rounded-xl p-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-blue-50 text-blue-primary border border-blue-100 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                      {insight.category || "OPERASIONAL"}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-navy leading-snug">
                      {insight.summary}
                    </span>
                  </div>

                  {insight.recommendations && Array.isArray(insight.recommendations) && insight.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                        Rekomendasi Tindakan Operasional:
                      </span>
                      <ul className="space-y-1.5">
                        {insight.recommendations.map((rec, recIdx) => (
                          <li
                            key={recIdx}
                            className="text-xs text-slate-700 leading-relaxed flex items-start gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5"
                          >
                            <svg
                              className="h-4 w-4 text-blue-primary shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="flex-1 font-semibold text-navy">{rec}</span>
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
  );
});

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
        setError("Sesi chat sebelumnya telah kedaluwarsa dari server. Obrolan telah direset, silakan kirim ulang pertanyaan Anda.");
      } else {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi WARU Assistant.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleResetSession() {
    if (confirm("Apakah Anda yakin ingin memulai sesi baru? Percakapan saat ini akan direset.")) {
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
    <div className="page-container py-6 sm:py-8 md:py-10 space-y-6 flex-1 flex flex-col min-h-[calc(100vh-140px)]">
      {/* Header */}
      <PageHeader
        title="WARU Business Assistant"
        description="Konsultasikan performa warung, analisis menu, dan strategi operasional real-time."
        badge="Akses Pemilik (Boss)"
        action={
          (sessionId || messages.length > 0) ? (
            <Button variant="outline" onClick={handleResetSession} className="min-h-9.5">
              Mulai Sesi Baru
            </Button>
          ) : undefined
        }
      />

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-800 flex items-start justify-between gap-3 shadow-xs font-semibold"
        >
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <svg className="h-5 w-5 shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="wrap-break-word">{error}</span>
          </div>
          <button 
            type="button"
            onClick={() => setError("")} 
            className="text-red-700 hover:text-red-950 font-bold text-xs shrink-0 px-2 py-1 rounded hover:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            aria-label="Tutup pesan error"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Chat Workspace */}
      <section
        aria-label="Workspace Percakapan Asisten"
        className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs min-h-115 sm:min-h-130"
      >
        {/* Chat Messages Container */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Riwayat percakapan"
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[60vh] sm:max-h-[65vh]"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 sm:py-16 px-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 shadow-xs">
                <svg className="h-6 w-6 text-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-black text-navy">Konsultasi Operasional Warung</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
                Pilih rekomendasi pertanyaan di bawah atau ketik analisis yang ingin Anda ketahui.
              </p>

              <div className="mt-6 w-full max-w-lg grid gap-3 grid-cols-1 sm:grid-cols-2 text-left">
                <button
                  type="button"
                  onClick={() => setInputText("Dari data bisnis saya, apa masalah yang paling mendesak?")}
                  className="min-h-11 p-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary"
                >
                  <span className="text-navy font-extrabold mb-1 group-hover:text-blue-primary">
                    Masalah Mendesak
                  </span>
                  <span className="text-slate-500 leading-normal font-normal">
                    &quot;Dari data bisnis saya, apa masalah yang paling mendesak?&quot;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputText("Tampilkan ringkasan menu yang perlu segera ditambah stoknya.")}
                  className="min-h-11 p-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary"
                >
                  <span className="text-navy font-extrabold mb-1 group-hover:text-blue-primary">
                    Restok & Menu
                  </span>
                  <span className="text-slate-500 leading-normal font-normal">
                    &quot;Tampilkan ringkasan menu yang perlu segera ditambah stoknya.&quot;
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <AssistantMessageItem key={index} msg={msg} />
              ))}
            </div>
          )}

          {/* Processing / Loading State */}
          {loading && (
            <div className="flex justify-start pt-2" role="status" aria-live="polite">
              <div className="bg-slate-50 text-navy rounded-2xl rounded-bl-xs px-4 py-3 border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-primary border-t-transparent shrink-0 motion-reduce:animate-none" />
                <span className="text-xs text-slate-600 font-semibold">
                  WARU Assistant sedang menganalisis data operasional...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50/70 flex items-center gap-2 sm:gap-3">
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
            className={`flex-1 rounded-xl border border-slate-300 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-primary transition min-w-0 ${
              loading ? "bg-slate-100 text-slate-400" : "bg-white text-navy"
            }`}
            required
            aria-label="Pesan untuk Business Assistant"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !inputText.trim()}
            className="shrink-0 min-h-9.5 sm:min-h-11"
            aria-label="Kirim pesan"
          >
            <span>Kirim</span>
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </form>
      </section>
    </div>
  );
}
