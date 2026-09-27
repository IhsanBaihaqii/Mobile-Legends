// src/components/bot/HeroChatBot.jsx
// Komponen Chatbot AI Hero dengan dukungan visual card (Stats, Skills, Combo) & parsing JSON dari API GPT-3.5

import React, { useState, useRef, useEffect } from "react";
import { aiChatService } from "../../services/aiChatService.js";

export default function HeroChatBot({ hero, stats, combos }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: `Halo! Saya adalah asisten AI resmi untuk ${hero?.name || "hero ini"}. Kamu bisa bertanya apa saja seputar saya (skill, winrate, kombo, build), atau gunakan perintah cepat seperti /test, /nama, dan /id!`,
      visualType: "none",
      visualData: null,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Cek shortcut perintah dasar instan jika user menggunakan /test, /nama, /id
    const cmd = trimmed.toLowerCase();
    if (cmd === "/test") {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: `Nama hero: ${hero?.name || "Unknown"}`,
            visualType: "none",
            visualData: null,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 300);
      return;
    }

    if (cmd === "/nama") {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: `${hero?.name || "Unknown"}`,
            visualType: "none",
            visualData: null,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 300);
      return;
    }

    if (cmd === "/id") {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: `Hero ID: #${hero?.heroId || "-"}`,
            visualType: "none",
            visualData: null,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 300);
      return;
    }

    // Panggil AI API dengan data hero lengkap
    try {
      const aiResponse = await aiChatService.askHeroAI({
        userQuestion: trimmed,
        hero,
        stats,
        combos,
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: aiResponse.msg,
        visualType: aiResponse.visualType || "none",
        visualData: aiResponse.visualData || null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `Maaf, terjadi kendala saat memproses jawaban. Namun saya adalah ${hero?.name || "hero ini"} (#${hero?.heroId || ""}).`,
          visualType: "none",
          visualData: null,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickCommand = (cmd) => {
    setInputText(cmd);
  };

  // Helper render komponen visual di dalam balon chat bot
  const renderVisualContent = (visualType, visualData) => {
    if (!visualType || visualType === "none") return null;

    // 1. Visualisasi Statistik & Winrate
    if (visualType === "stats") {
      const wr =
        visualData?.winRate ||
        (stats ? (stats.winRate * 100).toFixed(2) + "%" : "50%");
      const pr =
        visualData?.pickRate ||
        (stats ? (stats.pickRate * 100).toFixed(2) + "%" : "1.5%");
      const br =
        visualData?.banRate ||
        (stats ? (stats.banRate * 100).toFixed(2) + "%" : "2.0%");

      return (
        <div className="mt-2.5 p-3 rounded-xl bg-gray-900/90 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 pb-1 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-chart-pie"></i>
              <span>Statistik Ranked Global</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Mythic+</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-gray-950 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] text-gray-400 block uppercase">
                Win Rate
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400">
                {wr}
              </span>
            </div>
            <div className="bg-gray-950 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] text-gray-400 block uppercase">
                Pick Rate
              </span>
              <span className="text-xs font-bold font-mono text-blue-400">
                {pr}
              </span>
            </div>
            <div className="bg-gray-950 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] text-gray-400 block uppercase">
                Ban Rate
              </span>
              <span className="text-xs font-bold font-mono text-rose-400">
                {br}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Visualisasi Skillset
    if (visualType === "skills") {
      const skillList = hero?.skills || [];
      return (
        <div className="mt-2.5 p-3 rounded-xl bg-gray-900/90 border border-white/10 space-y-2">
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 pb-1 border-b border-white/5">
            <i className="fa-solid fa-bolt"></i>
            <span>Daftar Skill & Jurus</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {skillList.slice(0, 4).map((sk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-950 border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-white/10 p-0.5">
                  <img
                    src={sk.icon}
                    alt={sk.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {sk.name}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono truncate">
                    {sk.cd || "No Cooldown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 3. Visualisasi Rekomendasi Kombo
    if (visualType === "combo") {
      const comboTitle =
        visualData?.comboTitle ||
        combos?.[0]?.title ||
        "Kombo Eksekusi Serangan";
      const comboSteps = visualData?.comboSteps || [
        "Skill 2",
        "Ultimate",
        "Skill 1",
        "Basic Attack",
      ];

      return (
        <div className="mt-2.5 p-3 rounded-xl bg-gray-900/90 border border-white/10 space-y-2">
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 pb-1 border-b border-white/5">
            <i className="fa-solid fa-gamepad"></i>
            <span>{comboTitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {comboSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1 bg-gray-950 px-2 py-1 rounded-md border border-white/10 text-[11px] font-medium text-gray-200">
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-gray-950 text-[9px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < comboSteps.length - 1 && (
                  <i className="fa-solid fa-arrow-right text-[10px] text-gray-500"></i>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/95 overflow-hidden flex flex-col h-[560px] shadow-2xl">
      {/* Bot Top Header */}
      <div className="px-4 py-3 bg-gray-950 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-amber-400 bg-white/10 text-gray-950 flex items-center justify-center font-bold text-sm shadow">
            <img
              src={hero?.head}
              alt={hero?.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-950"></span>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{hero?.name} AI Assistant</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono">
                GPT-3.5 API
              </span>
            </h4>
            <p className="text-[10px] text-gray-400">
              Siap menjawab skill, statistik winrate, dan kombo secara visual
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 border border-white/10 text-amber-400">
            #{hero?.heroId}
          </span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full border bg-white/10 border-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs shrink-0 mb-1">
                  <img
                    src={hero?.head}
                    alt={hero?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-amber-400 text-gray-950 font-medium rounded-br-none shadow-md"
                    : "bg-gray-800 text-gray-100 rounded-bl-none border border-white/5"
                }`}
              >
                <div className="whitespace-pre-line font-sans">{m.text}</div>

                {/* Elemen Visual (Stats / Skills / Combo) jika ada */}
                {!isUser && renderVisualContent(m.visualType, m.visualData)}

                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    isUser ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-gray-800 text-gray-300 flex items-center justify-center text-xs shrink-0 mb-1 border border-white/10">
                  <i className="fa-solid fa-user"></i>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-1.5 text-gray-400 text-xs">
              <span className="text-[11px] mr-1 text-gray-300">
                Menghubungi AI...
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-2 bg-gray-950/90 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-gray-400 uppercase font-semibold shrink-0 mr-1 flex items-center gap-1">
          <i className="fa-solid fa-bolt text-amber-400"></i>
          <span>Cepat:</span>
        </span>
        {[
          { label: "/test", text: "/test" },
          { label: "/nama", text: "/nama" },
          { label: "/id", text: "/id" },
          {
            label: "Berapa winrate kamu?",
            text: "Berapa winrate dan ban rate kamu saat ini?",
          },
          {
            label: "Apa saja skill kamu?",
            text: "Jelaskan semua skill dan jurus yang kamu miliki",
          },
          {
            label: "Bagaimana kombo skill kamu?",
            text: "Berikan rekomendasi kombo skill terbaikmu",
          },
        ].map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleQuickCommand(btn.text)}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-900 hover:bg-gray-800 text-amber-300 border border-amber-400/20 hover:border-amber-400/40 transition-colors whitespace-nowrap shrink-0"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-gray-950 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Tanya apapun seputar ${hero?.name || "hero ini"}... (misal: winrate, skill, kombo)`}
          className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-gray-950 font-bold flex items-center justify-center transition-colors shrink-0"
        >
          <i className="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  );
}
