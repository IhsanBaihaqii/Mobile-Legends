// src/components/bot/HeroChatBot.jsx
// Komponen Chatbot AI Hero dengan dukungan Visual Lengkap:
// - Kombo Team Fight & Laning (lengkap dengan teks deskripsi & ikon skill berurutan)
// - Rekan Sinergi Terbaik & Duet Sinergi (lengkap dengan foto avatar hero)
// - Kuat Melawan / Lemah Melawan (lengkap dengan avatar hero counter)
// - Statistik Win Rate & Skillset

import React, { useState, useRef, useEffect } from "react";
import { aiChatService } from "../../services/aiChatService.js";

export default function HeroChatBot({ hero, stats, combos }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: `Halo! Saya adalah asisten AI resmi untuk ${hero?.name || "hero ini"}. Kamu bisa menanyakan Rekan Sinergi Terbaik, Rekomendasi Kombo Team Fight/Laning, Counter Hero, atau statistik winrate. Semua dilengkapi dengan visual dan gambar resmi!`,
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

    // Panggil API AI backend (/api/ai/:id?text=...)
    try {
      const aiResponse = await aiChatService.askHeroAI({
        userQuestion: trimmed,
        hero,
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

  // Helper render konten visual interaktif di chat bubble
  const renderVisualContent = (visualType, visualData) => {
    if (!visualType || visualType === "none") return null;

    // 1. Visualisasi Kombo Lengkap (Bisa ada multiple: KOMBO TEAM FIGHT & KOMBO LANING dengan deretan icon skill)
    if (visualType === "combo") {
      const comboItems = visualData?.combos || combos || [];
      if (!comboItems || comboItems.length === 0) return null;

      return (
        <div className="mt-3 space-y-3 pt-1">
          {comboItems.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-gray-950/90 border border-amber-400/20 shadow-md"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-400 text-gray-950 font-bold text-[10px] flex items-center justify-center">
                  <i className="fa-solid fa-gamepad"></i>
                </span>
                <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wide">
                  {c.title}
                </h5>
              </div>

              {c.desc && (
                <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
                  {c.desc}
                </p>
              )}

              {/* Tampilan gambar/icon urutan kombo */}
              {(c.skillIcons || c.skills)?.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono block mb-1.5">
                    Urutan Eksekusi Jurus:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 bg-gray-900/80 p-2 rounded-lg border border-white/5">
                    {(c.skillIcons || c.skills).map((iconUrl, stepIdx) => (
                      <React.Fragment key={stepIdx}>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/15 bg-gray-950 p-0.5 group">
                          <img
                            src={iconUrl}
                            alt={`Step ${stepIdx + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.opacity = "0.3";
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-tl bg-amber-400 text-gray-950 text-[8px] font-bold flex items-center justify-center">
                            {stepIdx + 1}
                          </span>
                        </div>
                        {stepIdx < (c.skillIcons || c.skills).length - 1 && (
                          <i className="fa-solid fa-arrow-right text-[10px] text-amber-400/60"></i>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // 2. Visualisasi Rekan Sinergi Terbaik (dengan gambar avatar hero)
    if (visualType === "synergy") {
      const heroes = visualData?.heroes || [];
      const duetStats = visualData?.duetStats || [];

      return (
        <div className="mt-3 p-3.5 rounded-xl bg-gray-950/90 border border-emerald-500/20 shadow-md space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h5 className="font-bold text-white text-xs uppercase tracking-wide">
              {visualData?.title || "Rekan Sinergi Terbaik"}
            </h5>
          </div>

          {visualData?.desc && (
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {visualData.desc}
            </p>
          )}

          {heroes.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] text-gray-400 block mb-1.5 font-mono">
                Hero Partner:
              </span>
              <div className="flex flex-wrap gap-2">
                {heroes.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-gray-900 px-2 py-1 rounded-xl border border-white/10 shadow"
                  >
                    {h.head && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400/40 bg-gray-950 shrink-0">
                        <img
                          src={h.head}
                          alt={h.name || "Hero"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {h.name && (
                      <span className="text-[11px] font-medium text-emerald-300">
                        {h.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {duetStats.length > 0 && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-gray-400 block mb-1.5 font-mono">
                Duet Winrate Tertinggi:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {duetStats.slice(0, 4).map((d, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-1.5 rounded-lg border border-white/5 text-center"
                  >
                    {d.head && (
                      <div className="w-8 h-8 mx-auto rounded-full overflow-hidden mb-1 border border-white/10">
                        <img
                          src={d.head}
                          alt="duet"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-emerald-400 font-mono block">
                      {d.winRate}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono block">
                      {d.increaseWinRate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 3. Visualisasi Kuat Melawan (Hero Di-counter) dengan gambar
    if (visualType === "strong") {
      const heroes = visualData?.heroes || [];
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-gray-950/90 border border-amber-400/20 shadow-md space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h5 className="font-bold text-white text-xs uppercase tracking-wide">
              {visualData?.title || "Kuat Melawan (Hero Di-counter)"}
            </h5>
          </div>

          {visualData?.desc && (
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {visualData.desc}
            </p>
          )}

          {heroes.length > 0 && (
            <div className="pt-1">
              <div className="flex flex-wrap gap-2">
                {heroes.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-gray-900 px-2 py-1 rounded-xl border border-white/10 shadow"
                  >
                    {h.head && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/40 bg-gray-950 shrink-0">
                        <img
                          src={h.head}
                          alt={h.name || "Hero"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {h.name && (
                      <span className="text-[11px] font-medium text-amber-300">
                        {h.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 4. Visualisasi Lemah Melawan (Counter Hero Ini) dengan gambar
    if (visualType === "weak") {
      const heroes = visualData?.heroes || [];
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-gray-950/90 border border-rose-500/20 shadow-md space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <h5 className="font-bold text-white text-xs uppercase tracking-wide">
              {visualData?.title || "Lemah Melawan (Counter Hero Ini)"}
            </h5>
          </div>

          {visualData?.desc && (
            <p className="text-[11px] text-gray-300 leading-relaxed">
              {visualData.desc}
            </p>
          )}

          {heroes.length > 0 && (
            <div className="pt-1">
              <div className="flex flex-wrap gap-2">
                {heroes.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-gray-900 px-2 py-1 rounded-xl border border-white/10 shadow"
                  >
                    {h.head && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-rose-500/40 bg-gray-950 shrink-0">
                        <img
                          src={h.head}
                          alt={h.name || "Hero"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {h.name && (
                      <span className="text-[11px] font-medium text-rose-300">
                        {h.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 5. Visualisasi Statistik Win Rate
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
        <div className="mt-2.5 p-3 rounded-xl bg-gray-950 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 pb-1 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-chart-pie"></i>
              <span>Statistik Ranked Global</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Mythic+</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-gray-900 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] text-gray-400 block uppercase">
                Win Rate
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400">
                {wr}
              </span>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] text-gray-400 block uppercase">
                Pick Rate
              </span>
              <span className="text-xs font-bold font-mono text-blue-400">
                {pr}
              </span>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg border border-white/5">
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

    // 6. Visualisasi Skillset Lengkap
    if (visualType === "skills") {
      const skillList = visualData?.skills || hero?.skills || [];
      return (
        <div className="mt-2.5 p-3 rounded-xl bg-gray-950 border border-white/10 space-y-2">
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 pb-1 border-b border-white/5">
            <i className="fa-solid fa-bolt"></i>
            <span>Daftar Skill & Jurus</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {skillList.slice(0, 4).map((sk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-900 border border-white/5"
              >
                {sk.icon && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-950 shrink-0 border border-white/10 p-0.5">
                    <img
                      src={sk.icon}
                      alt={sk.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
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

    return null;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/95 overflow-hidden flex flex-col h-[580px] shadow-2xl">
      {/* Bot Header */}
      <div className="px-4 py-3 bg-gray-950 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full border border-amber-400 bg-white/10 text-gray-950 flex items-center justify-center font-bold text-sm shadow">
            <img
              src={hero?.head}
              alt={hero?.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-950"></span>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{hero?.name} AI Assistant</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono">
                Live Data API
              </span>
            </h4>
            <p className="text-[10px] text-gray-400">
              Kombo bergambar, rekan sinergi, & analisis counter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 border border-white/10 text-amber-400">
            #{hero?.heroId}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs shrink-0 mb-1">
                  <img
                    src={hero?.head}
                    alt={hero?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-amber-400 text-gray-950 font-medium rounded-br-none shadow-md"
                    : "bg-gray-800 text-gray-100 rounded-bl-none border border-white/5"
                }`}
              >
                <div className="whitespace-pre-line font-sans">{m.text}</div>

                {/* Render Elemen Visual (Kombo bergambar / Partner / Counter) */}
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

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-1.5 text-gray-400 text-xs">
              <span className="text-[11px] mr-1 text-gray-300">
                Menganalisis data hero...
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
          <span>Coba:</span>
        </span>
        {[
          {
            label: "Kombo Team Fight & Laning",
            text: "Bagaimana kombo team fight dan laning kamu?",
          },
          {
            label: "Rekan Sinergi Terbaik",
            text: "Siapa rekan sinergi terbaik untuk hero ini?",
          },
          {
            label: "Kuat Melawan Siapa?",
            text: "Kamu kuat melawan hero apa saja?",
          },
          {
            label: "Lemah Melawan Siapa?",
            text: "Hero apa yang meng-counter kamu?",
          },
          {
            label: "Berapa winrate kamu?",
            text: "Berapa statistik winrate dan ban rate kamu?",
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
          placeholder={`Tanya kombo bergambar, rekan sinergi, atau counter ${hero?.name || "hero ini"}...`}
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
