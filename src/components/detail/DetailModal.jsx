// src/components/detail/DetailModal.jsx
// Modal detail hero dengan banner, tab Overview, Skills, Stats, Relations, dan Combos

import React, { useState, useEffect } from 'react';
import { ROLE_META, LANE_ICONS } from '../../data/roles.js';
import { mlbbService } from '../../services/mlbbService.js';

export default function DetailModal({ heroId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';

    mlbbService.fetchHeroDetail(heroId)
      .then((res) => {
        if (isMounted) {
          if (res.ok) {
            setData(res);
          } else {
            setError(res.message || 'Gagal memuat detail hero');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Koneksi gagal');
          setLoading(false);
        }
      });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [heroId, onClose]);

  // Helper formatting percentage
  const pct = (v) => (Number(v || 0) * 100).toFixed(2) + '%';

  // Helper formatting colors for skill description
  const renderSkillDesc = (s) => {
    if (!s) return '';
    // Format tag <font color="..."> -> <span style="...">
    const formatted = s
      .replace(/<font color=["']?#?([0-9a-fA-F]{6})["']?>/g, '<span style="color:#$1;font-weight:600">')
      .replace(/<\/font>/g, '</span>');
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const hero = data?.hero;
  const stats = data?.stats;
  const relation = data?.relation || {};
  const combos = data?.combos || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] bg-gray-900 border border-white/10 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10">
        {/* Top Sticky Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-950/90 backdrop-blur border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-amber-400 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Kembali</span>
          </button>

          <span className="font-bold text-white text-base truncate max-w-[200px] sm:max-w-md">
            {hero ? hero.name : 'Detail Hero'}
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="py-24 text-center">
              <i className="fa-solid fa-circle-notch fa-spin text-amber-400 text-3xl mb-3"></i>
              <p className="text-xs text-gray-400">Mengambil data hero & skill dari API Moonton...</p>
            </div>
          )}

          {error && (
            <div className="py-20 text-center">
              <i className="fa-solid fa-triangle-exclamation text-rose-500 text-3xl mb-3"></i>
              <p className="text-sm text-gray-300">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg bg-amber-400 text-gray-950 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          )}

          {!loading && hero && (
            <div className="space-y-5">
              {/* Hero Banner with Painting / Head */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 p-4 sm:p-6 bg-gradient-to-r from-amber-500/15 to-transparent"
              >
                {hero.painting && (
                  <img
                    src={hero.painting}
                    alt={hero.name}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-20 pointer-events-none"
                  />
                )}

                <div className="relative flex items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-gray-950 shrink-0 shadow-xl">
                    <img
                      src={hero.headBig || hero.head}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hero.name)}&background=111827&color=f5c451&bold=true`;
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight truncate">
                      {hero.name}
                    </h2>
                    <p className="text-xs text-gray-400 mb-2">
                      Hero ID: <span className="text-amber-400 font-semibold font-mono">#{hero.heroId}</span>
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {hero.roles?.map((r) => {
                        const m = ROLE_META[r.title] || { icon: 'fa-tag', color: 'bg-gray-800 text-gray-300 border-gray-700' };
                        return (
                          <span
                            key={r.title}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${m.color}`}
                          >
                            <i className={`fa-solid ${m.icon}`}></i>
                            <span>{r.rawTitle || r.title}</span>
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {hero.lanes?.map((l) => {
                        const ic = LANE_ICONS[l.title] || 'fa-road';
                        return (
                          <span
                            key={l.title}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-[11px] text-gray-300"
                          >
                            <i className={`fa-solid ${ic} text-amber-400/80`}></i>
                            <span>{l.rawTitle || l.title}</span>
                          </span>
                        );
                      })}
                    </div>

                    {hero.speciality?.length > 0 && (
                      <p className="text-[11px] text-gray-400 mt-2">
                        Spesialisasi: <span className="text-gray-200">{hero.speciality.join(' • ')}</span>
                      </p>
                    )}
                  </div>

                  {/* Difficulty & Skill Priority */}
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Tingkat Kesulitan</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 justify-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fa-solid fa-star ${
                            star <= Math.round((hero.difficulty || 0) / 20) ? 'text-amber-400' : 'text-gray-700'
                          }`}
                        ></i>
                      ))}
                    </div>

                    {hero.recommendLevel && (
                      <p className="text-[10px] text-gray-400 mt-2">
                        Skill Up: <span className="text-amber-400 font-semibold">{hero.recommendLevel}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-1 border-b border-white/10 overflow-x-auto pb-1">
                {[
                  { id: 'overview', label: 'Overview', icon: 'fa-id-card' },
                  { id: 'skills', label: 'Skills', icon: 'fa-bolt' },
                  { id: 'stats', label: 'Stats & Sinergi', icon: 'fa-chart-pie' },
                  { id: 'relations', label: 'Matchup & Counter', icon: 'fa-shield-halved' },
                  ...(combos.length > 0 ? [{ id: 'combos', label: 'Kombo Skill', icon: 'fa-gamepad' }] : [])
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400'
                        : 'text-gray-400 hover:text-white border-transparent'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon}`}></i>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {hero.story && (
                    <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                      <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-book-open"></i>
                        <span>Latar Cerita Hero</span>
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{hero.story}</p>
                    </div>
                  )}

                  {/* Quick Rates Overview */}
                  {stats && (
                    <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                      <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-chart-line"></i>
                        <span>Statistik Ranked Global (Mythic+)</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-900 rounded-lg border border-white/5">
                          <span className="text-xs text-gray-400 block mb-1">Win Rate</span>
                          <span className="text-lg font-bold font-mono text-emerald-400">{pct(stats.winRate)}</span>
                        </div>
                        <div className="p-3 bg-gray-900 rounded-lg border border-white/5">
                          <span className="text-xs text-gray-400 block mb-1">Pick Rate</span>
                          <span className="text-lg font-bold font-mono text-blue-400">{pct(stats.pickRate)}</span>
                        </div>
                        <div className="p-3 bg-gray-900 rounded-lg border border-white/5">
                          <span className="text-xs text-gray-400 block mb-1">Ban Rate</span>
                          <span className="text-lg font-bold font-mono text-rose-400">{pct(stats.banRate)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-3">
                  {hero.skills?.length > 0 ? (
                    hero.skills.map((sk) => (
                      <div
                        key={sk.id}
                        className="rounded-xl border border-white/10 bg-gray-950 p-3.5 sm:p-4 flex gap-3.5"
                      >
                        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-gray-900 p-1">
                          <img
                            src={sk.icon}
                            alt={sk.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-white text-sm">{sk.name}</h4>
                            {sk.cd && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                                {sk.cd}
                              </span>
                            )}
                            {sk.tags?.map((t) => (
                              <span
                                key={t.id || t.name}
                                className="text-[10px] px-1.5 py-0.5 rounded font-medium border"
                                style={{
                                  backgroundColor: `rgba(${t.rgb || '245,196,81'}, 0.15)`,
                                  color: `rgb(${t.rgb || '245,196,81'})`,
                                  borderColor: `rgba(${t.rgb || '245,196,81'}, 0.35)`
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
                    <p className="text-xs text-gray-400 text-center py-8">Tidak ada data skill untuk hero ini.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Stats & Sinergi */}
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  {stats ? (
                    <>
                      {/* Sub Hero Best Synergy */}
                      <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                        <h3 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                          <i className="fa-solid fa-users"></i>
                          <span>Rekan Duet Sinergi Terbaik (Top 5)</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                          {stats.subHeroes?.map((x) => (
                            <div
                              key={x.heroid}
                              className="rounded-lg border border-white/10 bg-gray-900 p-2.5 text-center"
                            >
                              <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden border border-white/10 bg-gray-950 mb-1.5">
                                <img src={x.head} alt={`Hero ${x.heroid}`} className="w-full h-full object-cover" />
                              </div>
                              <p className="text-xs text-emerald-400 font-bold font-mono">{pct(x.winRate)} WR</p>
                              <p className="text-[10px] text-gray-400">+{pct(x.increaseWinRate)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sub Hero Last / Worst Matchup */}
                      <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                        <h3 className="font-bold text-rose-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          <span>Kurang Cocok / Sinergi Terendah (Top 5)</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                          {stats.lastHeroes?.map((x) => (
                            <div
                              key={x.heroid}
                              className="rounded-lg border border-white/10 bg-gray-900 p-2.5 text-center"
                            >
                              <div className="w-12 h-12 mx-auto rounded-lg border border-white/10 bg-gray-950 flex items-center justify-center text-xs font-bold text-gray-400 mb-1.5 font-mono">
                                #{x.heroid}
                              </div>
                              <p className="text-xs text-rose-400 font-bold font-mono">{pct(x.winRate)} WR</p>
                              <p className="text-[10px] text-gray-400">{pct(x.increaseWinRate)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-8">Data statistik sinergi tidak tersedia.</p>
                  )}
                </div>
              )}

              {/* Tab 4: Matchup & Relations */}
              {activeTab === 'relations' && (
                <div className="space-y-3">
                  {/* Assist */}
                  {relation.assist && (
                    <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                          Rekan Sinergi Terbaik
                        </h4>
                      </div>
                      {relation.assist.desc && (
                        <p className="text-xs text-gray-300 leading-relaxed mb-3">{relation.assist.desc}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {relation.assist.heads?.map((h, i) => (
                          <div key={i} className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-900">
                            <img src={h} alt="Partner hero" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strong Against */}
                  {relation.strong && (
                    <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                          Kuat Melawan (Hero Di-counter)
                        </h4>
                      </div>
                      {relation.strong.desc && (
                        <p className="text-xs text-gray-300 leading-relaxed mb-3">{relation.strong.desc}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {relation.strong.heads?.map((h, i) => (
                          <div key={i} className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-900">
                            <img src={h} alt="Countered hero" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weak Against */}
                  {relation.weak && (
                    <div className="rounded-xl border border-white/10 bg-gray-950 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                          Lemah Melawan (Counter Hero Ini)
                        </h4>
                      </div>
                      {relation.weak.desc && (
                        <p className="text-xs text-gray-300 leading-relaxed mb-3">{relation.weak.desc}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {relation.weak.heads?.map((h, i) => (
                          <div key={i} className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-900">
                            <img src={h} alt="Weak against hero" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Combos */}
              {activeTab === 'combos' && combos.length > 0 && (
                <div className="space-y-3">
                  {combos.map((c) => (
                    <div key={c.id} className="rounded-xl border border-white/10 bg-gray-950 p-4">
                      <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <i className="fa-solid fa-bolt"></i>
                        <span>{c.title}</span>
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">{c.desc}</p>
                      {c.skills?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 bg-gray-900/60 p-2.5 rounded-lg border border-white/5">
                          {c.skills.map((ic, i) => (
                            <div key={i} className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 bg-gray-950 p-1">
                              <img src={ic} alt={`Skill step ${i + 1}`} className="w-full h-full object-contain" />
                              <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-amber-400 text-gray-950 text-[10px] font-bold flex items-center justify-center">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
