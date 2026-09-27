// src/pages/HeroPage.jsx
// Halaman mandiri /hero/:id dengan tombol kembali, detail lengkap, dan fitur chatbot

import React, { useState, useEffect } from "react";
import { ROLE_META, LANE_ICONS } from "../data/roles.js";
import { mlbbService } from "../services/mlbbService.js";
import HeroChatBot from "../components/bot/HeroChatBot.jsx";

export default function HeroPage({ heroId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview | skills | stats | relations | combos | bot

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    mlbbService
      .fetchHeroDetail(heroId)
      .then((res) => {
        if (isMounted) {
          if (res.ok) {
            setData(res);
          } else {
            setError(res.message || "Gagal memuat detail hero");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Koneksi gagal");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [heroId]);

  const pct = (v) => (Number(v || 0) * 100).toFixed(2) + "%";

  const renderSkillDesc = (s) => {
    if (!s) return "";
    const formatted = s
      .replace(
        /<font color=["']?#?([0-9a-fA-F]{6})["']?>/g,
        '<span style="color:#$1;font-weight:600">',
      )
      .replace(/<\/font>/g, "</span>");
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const hero = data?.hero;
  const stats = data?.stats;
  const relation = data?.relation || {};
  const combos = data?.combos || [];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-200">
      {/* Top Header dengan Tombol Kembali */}
      <header className="sticky top-0 z-40 bg-[#0a0e17]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-amber-400 border border-white/10 text-xs font-semibold transition-all group"
          >
            <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-0.5"></i>
            <span>Kembali ke Galeri</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">
              Path:
            </span>
            <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              /hero/{heroId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {loading && (
          <div className="py-32 text-center">
            <i className="fa-solid fa-circle-notch fa-spin text-amber-400 text-3xl mb-3"></i>
            <p className="text-xs text-gray-400">
              Memuat data live hero #{heroId} dari API Moonton...
            </p>
          </div>
        )}

        {error && (
          <div className="py-24 text-center max-w-md mx-auto">
            <i className="fa-solid fa-triangle-exclamation text-rose-500 text-4xl mb-3"></i>
            <h3 className="text-base font-bold text-white mb-1">
              Gagal Memuat Data Hero
            </h3>
            <p className="text-xs text-gray-400 mb-4">{error}</p>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 font-bold text-xs shadow-lg"
            >
              Kembali ke Galeri
            </button>
          </div>
        )}

        {!loading && hero && (
          <div className="space-y-6">
            {/* Hero Main Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 p-5 sm:p-7 bg-gradient-to-r from-amber-500/15 via-gray-900/60 to-transparent">
              {hero.painting && (
                <img
                  src={hero.painting}
                  alt={hero.name}
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-20 pointer-events-none"
                />
              )}

              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-gray-950 shrink-0 shadow-2xl">
                  <img
                    src={hero.headBig || hero.head}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hero.name)}&background=111827&color=f5c451&bold=true`;
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {hero.name}
                    </h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-400">
                      #{hero.heroId}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-2.5">
                    {hero.roles?.map((r) => {
                      const m = ROLE_META[r.title] || {
                        icon: "fa-tag",
                        color: "bg-gray-800 text-gray-300 border-gray-700",
                      };
                      return (
                        <span
                          key={r.title}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${m.color}`}
                        >
                          <i className={`fa-solid ${m.icon}`}></i>
                          <span>{r.rawTitle || r.title}</span>
                        </span>
                      );
                    })}

                    {hero.lanes?.map((l) => {
                      const ic = LANE_ICONS[l.title] || "fa-road";
                      return (
                        <span
                          key={l.title}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-white/10 bg-white/5 text-[11px] text-gray-300"
                        >
                          <i className={`fa-solid ${ic} text-amber-400/80`}></i>
                          <span>{l.rawTitle || l.title}</span>
                        </span>
                      );
                    })}
                  </div>

                  {hero.speciality?.length > 0 && (
                    <p className="text-xs text-gray-400">
                      Spesialisasi:{" "}
                      <span className="text-gray-200">
                        {hero.speciality.join(" • ")}
                      </span>
                    </p>
                  )}
                </div>

                {/* Difficulty & Skill Priority */}
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                    Tingkat Kesulitan
                  </p>
                  <div className="flex items-center gap-1 text-sm justify-end">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fa-solid fa-star ${
                          star <= Math.round((hero.difficulty || 0) / 20)
                            ? "text-amber-400"
                            : "text-gray-700"
                        }`}
                      ></i>
                    ))}
                  </div>

                  {hero.recommendLevel && (
                    <p className="text-[11px] text-gray-400 mt-2.5">
                      Skill Up:{" "}
                      <span className="text-amber-400 font-semibold">
                        {hero.recommendLevel}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex gap-1.5 border-b border-white/10 overflow-x-auto pb-1">
              {[
                { id: "overview", label: "Ringkasan", icon: "fa-id-card" },
                { id: "skills", label: "Skills", icon: "fa-bolt" },
                { id: "stats", label: "Stats & Sinergi", icon: "fa-chart-pie" },
                {
                  id: "relations",
                  label: "Matchup & Counter",
                  icon: "fa-shield-halved",
                },
                ...(combos.length > 0
                  ? [{ id: "combos", label: "Kombo Skill", icon: "fa-gamepad" }]
                  : []),
                {
                  id: "bot",
                  label: "Chat Bot Hero",
                  icon: "fa-robot",
                  badge: "Interactive",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl border-b-2 transition-all whitespace-nowrap ${
                    activeTab === t.id
                      ? "bg-amber-400/10 text-amber-400 border-amber-400"
                      : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
                  }`}
                >
                  <i className={`fa-solid ${t.icon}`}></i>
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-400 text-gray-950 font-bold rounded">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {hero.story && (
                  <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                    <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <i className="fa-solid fa-book-open"></i>
                      <span>Latar Cerita Hero</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {hero.story}
                    </p>
                  </div>
                )}

                {stats && (
                  <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                    <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-chart-line"></i>
                      <span>Statistik Ranked Global (Mythic+)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-gray-950 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-400 block mb-1">
                          Win Rate
                        </span>
                        <span className="text-xl font-bold font-mono text-emerald-400">
                          {pct(stats.winRate)}
                        </span>
                      </div>
                      <div className="p-3.5 bg-gray-950 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-400 block mb-1">
                          Pick Rate
                        </span>
                        <span className="text-xl font-bold font-mono text-blue-400">
                          {pct(stats.pickRate)}
                        </span>
                      </div>
                      <div className="p-3.5 bg-gray-950 rounded-xl border border-white/5">
                        <span className="text-xs text-gray-400 block mb-1">
                          Ban Rate
                        </span>
                        <span className="text-xl font-bold font-mono text-rose-400">
                          {pct(stats.banRate)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Skills */}
            {activeTab === "skills" && (
              <div className="space-y-3">
                {hero.skills?.length > 0 ? (
                  hero.skills.map((sk) => (
                    <div
                      key={sk.id}
                      className="rounded-2xl border border-white/10 bg-gray-900/80 p-4 sm:p-5 flex gap-4"
                    >
                      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-gray-950 p-1">
                        <img
                          src={sk.icon}
                          alt={sk.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="font-bold text-white text-sm sm:text-base">
                            {sk.name}
                          </h4>
                          {sk.cd && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                              {sk.cd}
                            </span>
                          )}
                          {sk.tags?.map((t) => (
                            <span
                              key={t.id || t.name}
                              className="text-[10px] px-2 py-0.5 rounded font-medium border"
                              style={{
                                backgroundColor: `rgba(${t.rgb || "245,196,81"}, 0.15)`,
                                color: `rgb(${t.rgb || "245,196,81"})`,
                                borderColor: `rgba(${t.rgb || "245,196,81"}, 0.35)`,
                              }}
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                          {renderSkillDesc(sk.desc)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-12">
                    Tidak ada data skill untuk hero ini.
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: Stats & Sinergi */}
            {activeTab === "stats" && (
              <div className="space-y-4">
                {stats ? (
                  <>
                    <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                      <h3 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-users"></i>
                        <span>Rekan Duet Sinergi Terbaik (Top 5)</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {stats.subHeroes?.map((x) => (
                          <div
                            key={x.heroid}
                            className="rounded-xl border border-white/10 bg-gray-950 p-3 text-center"
                          >
                            <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden border border-white/10 bg-gray-900 mb-2">
                              <img
                                src={x.head}
                                alt={`Hero ${x.heroid}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-emerald-400 font-bold font-mono">
                              {pct(x.winRate)} WR
                            </p>
                            <p className="text-[10px] text-gray-400">
                              +{pct(x.increaseWinRate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                      <h3 className="font-bold text-rose-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Kurang Cocok / Sinergi Terendah (Top 5)</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {stats.lastHeroes?.map((x) => (
                          <div
                            key={x.heroid}
                            className="rounded-xl border border-white/10 bg-gray-950 p-3 text-center"
                          >
                            <div className="w-12 h-12 mx-auto rounded-lg border border-white/10 bg-gray-900 flex items-center justify-center text-xs font-bold text-gray-400 mb-2 font-mono">
                              #{x.heroid}
                            </div>
                            <p className="text-xs text-rose-400 font-bold font-mono">
                              {pct(x.winRate)} WR
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {pct(x.increaseWinRate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-12">
                    Data statistik sinergi tidak tersedia.
                  </p>
                )}
              </div>
            )}

            {/* Tab 4: Matchup & Relations */}
            {activeTab === "relations" && (
              <div className="space-y-4">
                {relation.assist && (
                  <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                        Rekan Sinergi Terbaik
                      </h4>
                    </div>
                    {relation.assist.desc && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        {relation.assist.desc}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2.5">
                      {relation.assist.heads?.map((h, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-950 shadow"
                        >
                          <img
                            src={h}
                            alt="Partner hero"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {relation.strong && (
                  <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                        Kuat Melawan (Hero Di-counter)
                      </h4>
                    </div>
                    {relation.strong.desc && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        {relation.strong.desc}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2.5">
                      {relation.strong.heads?.map((h, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-950 shadow"
                        >
                          <img
                            src={h}
                            alt="Countered hero"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {relation.weak && (
                  <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                        Lemah Melawan (Counter Hero Ini)
                      </h4>
                    </div>
                    {relation.weak.desc && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        {relation.weak.desc}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2.5">
                      {relation.weak.heads?.map((h, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-950 shadow"
                        >
                          <img
                            src={h}
                            alt="Weak against hero"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Combos */}
            {activeTab === "combos" && combos.length > 0 && (
              <div className="space-y-4">
                {combos.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-gray-900/80 p-5"
                  >
                    <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <i className="fa-solid fa-bolt"></i>
                      <span>{c.title}</span>
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed mb-3.5">
                      {c.desc}
                    </p>
                    {c.skills?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2.5 bg-gray-950/80 p-3 rounded-xl border border-white/5">
                        {c.skills.map((ic, i) => (
                          <div
                            key={i}
                            className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-gray-900 p-1"
                          >
                            <img
                              src={ic}
                              alt={`Skill step ${i + 1}`}
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 text-gray-950 text-[10px] font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Interactive Chat Bot */}
            {activeTab === "bot" && (
              <div>
                <HeroChatBot hero={hero} stats={stats} combos={combos} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
