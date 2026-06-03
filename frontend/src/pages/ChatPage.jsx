import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  ScanFace,
  Sparkles,
  User,
  RotateCcw,
  Loader2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/organisms/Navbar";
import { useAuth } from "../context/AuthContext";
import { chatWithAI, getChatQuota } from "../services/api";

// starter
const STARTERS = [
  {
    icon: "🔴",
    text: "Jerawat saya tidak kunjung sembuh meski sudah pakai skincare rutin. Apa yang salah?",
  },
  {
    icon: "✨",
    text: "Rekomendasikan rutinitas skincare pagi & malam untuk kulit berminyak",
  },
  {
    icon: "🌙",
    text: "Bahan aktif apa yang aman dipakai bersamaan? Mana yang tidak boleh?",
  },
  {
    icon: "💧",
    text: "Apa perbedaan antara Niacinamide, Retinol, dan AHA/BHA?",
  },
  {
    icon: "☀️",
    text: "Kenapa kulit saya makin kusam walaupun sudah rajin pakai pelembap?",
  },
  {
    icon: "🧴",
    text: "Cara memilih sunscreen yang tepat untuk kulit sensitif dan berjerawat",
  },
];

// Komponen Bubble Pesan
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";

  const renderContent = (content) => {
    if (typeof content === "string") {
      return <FormattedText text={content} />;
    }
    if (Array.isArray(content)) {
      const textPart = content.find((c) => c.type === "text");
      const imgPart = content.find((c) => c.type === "image");
      return (
        <div className="flex flex-col gap-2">
          {imgPart && (
            <img
              src={imgPart.source.data}
              alt="Uploaded"
              className="rounded-xl max-h-52 object-cover border border-white/20"
            />
          )}
          {textPart && <FormattedText text={textPart.text} />}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
        ${isUser ? "bg-primary text-white" : "bg-primary-light border border-primary/20"}`}
      >
        {isUser ? (
          <User size={14} />
        ) : (
          <Sparkles size={14} className="text-primary" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-white border border-neutral-200 text-neutral-900 rounded-tl-sm shadow-sm"
          }`}
        >
          {renderContent(msg.content)}
        </div>
        {msg.timestamp && (
          <span className="text-xs text-neutral-400 px-1">
            {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

/* Render markdown-lite: bold, list */
const FormattedText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // List item
        if (/^[-*•]\s/.test(line)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60" />
              <span
                dangerouslySetInnerHTML={{
                  __html: boldify(line.replace(/^[-*•]\s/, "")),
                }}
              />
            </div>
          );
        }
        // Numbered list
        if (/^\d+\.\s/.test(line)) {
          const num = line.match(/^(\d+)\./)[1];
          return (
            <div key={i} className="flex gap-2">
              <span className="flex-shrink-0 font-medium opacity-70 text-xs mt-0.5">
                {num}.
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: boldify(line.replace(/^\d+\.\s/, "")),
                }}
              />
            </div>
          );
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: boldify(line) }} />
        );
      })}
    </div>
  );
};

const boldify = (str) =>
  str
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

/* ─── Typing indicator ─────────────────────────────────────────────────────── */
const TypingIndicator = () => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center flex-shrink-0">
      <Sparkles size={14} className="text-primary" />
    </div>
    <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
      <span
        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

/* ─── Halaman Chat Utama ─────────────────────────────────────────────────────── */
const ChatPage = () => {
  const { user, token, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [quota, setQuota] = useState(null); // { used, limit, remaining }

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);

  /* ── Ambil info kuota saat halaman dimuat ── */
  useEffect(() => {
    if (token) {
      getChatQuota(token).then(setQuota).catch(() => {});
    }
  }, [token]);

  /* ── Auto-scroll ── */
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  /* ── Resize textarea ── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  /* ── Kirim pesan ── */
  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;

    setError("");
    const userMsg = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    // Build API messages — strip timestamps
    const apiMessages = history.map(({ role, content }) => ({ role, content }));

    try {
      const reply = await chatWithAI(apiMessages, token);
      setMessages([
        ...history,
        { role: "assistant", content: reply, timestamp: Date.now() },
      ]);
      // Update kuota lokal
      setQuota((prev) => prev ? { ...prev, used: prev.used + 1, remaining: Math.max(0, prev.remaining - 1) } : prev);
    } catch (err) {
      // Tangkap error kuota habis (HTTP 429)
      if (err?.response?.status === 429) {
        const quotaData = err.response.data?.quota;
        if (quotaData) setQuota(quotaData);
        setError(err.response.data?.message || "Kuota chat harian kamu sudah habis.");
        // Hapus pesan user terakhir yang gagal dikirim
        setMessages(messages);
      } else {
        setError("Gagal mendapatkan respons. Periksa koneksi atau coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setError("");
  };

  const isEmptyChat = messages.length === 0;

  /* ─────────────────────────────────────────────────────────────── */

  // Guard: wajib login untuk mengakses chat
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center">
            <Sparkles size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-neutral-900">
              Login untuk Mulai Chat
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-sm">
              Silakan login terlebih dahulu untuk berkonsultasi dengan LumiSkin
              AI tentang perawatan kulitmu.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      {/* ── Header Chat ── */}
      <div className="bg-white border-b border-neutral-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                LumiSkin AI
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-neutral-400">
                  Online · Siap membantu
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/analysis"
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-light"
            >
              <ScanFace size={13} />
              Analisis Foto
            </Link>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <RotateCcw size={13} />
                Bersihkan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Area Chat ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative"
      >
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-5 min-h-full">
          {isEmptyChat ? (
            /* ── Welcome screen ── */
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-light border border-primary/20 flex items-center justify-center">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-neutral-900">
                    Halo{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1 max-w-xs">
                    Tanya apapun soal kulit kamu — dari jerawat, skincare,
                    hingga bahan aktif.
                  </p>
                </div>
              </div>

              {/* Starter prompts */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl">
                {STARTERS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s.text)}
                    className="flex items-start gap-2.5 text-left px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:border-primary hover:bg-primary-light transition-all duration-150 text-sm text-neutral-900 cursor-pointer"
                  >
                    <span className="text-base flex-shrink-0">{s.icon}</span>
                    <span className="leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Pesan ── */
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Tombol scroll ke bawah ── */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 right-6 w-9 h-9 bg-white border border-neutral-200 shadow rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all z-30"
        >
          <ChevronDown size={16} />
        </button>
      )}

      {/* ── Input area ── */}
      <div className="bg-white border-t border-neutral-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2">
            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya soal kulitmu... (Enter untuk kirim, Shift+Enter baris baru)"
                rows={1}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 bg-neutral-50 resize-none outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:opacity-60"
                style={{ minHeight: "42px", maxHeight: "140px" }}
              />
            </div>

            {/* Tombol kirim */}
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            {quota ? (
              <>
                Sisa kuota hari ini: <span className={`font-semibold ${quota.remaining <= 2 ? 'text-red-500' : 'text-primary'}`}>{quota.remaining}/{quota.limit}</span>
                {' · '}
              </>
            ) : null}
            Respons AI bersifat informatif, bukan pengganti diagnosis dokter
            kulit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
