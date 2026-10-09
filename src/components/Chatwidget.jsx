import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com";

const WELCOME = {
  role: "assistant",
  content:
    "Hi! Main Fork&Flame ka assistant hu. Menu, rooms, timing ya booking ke baare me kuch bhi puchho.",
};

const SUGGESTIONS = ["Menu me kya hai?", "Room ka rate?", "Timing kya hai?"];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      // welcome message ko history me nahi bhejna (wo assistant se shuru hota hai)
      const history = next.filter((m) => m !== WELCOME);

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Chat failed");
      }

      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, abhi jawab nahi de pa raha. Thodi der baad try karo.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* CHAT PANEL */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[90] w-[calc(100vw-2rem)] sm:w-96 h-[28rem] max-h-[70vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          <div className="flex items-center justify-between px-4 py-3 bg-red-600 text-white">
            <div>
              <p className="font-semibold leading-tight">Fork&amp;Flame Assistant</p>
              <p className="text-xs text-white/80">Menu, rooms &amp; booking help</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-red-600 text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 text-sm px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                  Typing...
                </div>
              </div>
            )}

            {messages.length === 1 && !sending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-700 text-gray-300 hover:border-red-500 hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-800 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              maxLength={500}
              placeholder="Apna sawal likho..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-red-500 placeholder:text-gray-500"
            />
            <button
              onClick={() => send()}
              disabled={sending || !input.trim()}
              className="p-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl text-white transition"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-[90] w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl flex items-center justify-center transition active:scale-95"
        aria-label="Open chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default ChatWidget;
