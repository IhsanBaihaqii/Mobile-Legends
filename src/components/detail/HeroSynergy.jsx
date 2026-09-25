// src/components/detail/HeroSynergy.jsx
// Visualisasi statistik sinergi rekan terbaik, winrate boost & counter hero

import React from 'react';
import SolidBadge from '../common/SolidBadge.jsx';

export default function HeroSynergy({ hero }) {
  if (!hero) return null;

  const synergies = hero.synergies || [];
  const relations = hero.relations || {};

  return (
    <div className="space-y-4">
      {/* 1. Sinergi Partner Ranked (Data Moonton Source 2756567) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-handshake-simple text-emerald-400"></i>
              <span>Rekan Tim Sinergi Tertinggi (Ranked Mythic+)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Hero yang menghasilkan peningkatan winrate tertinggi saat dimainkan bersama
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            Source API: <span className="text-emerald-400 font-bold">2756567</span>
          </div>
        </div>

        {synergies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {synergies.map((partner) => {
              const wrIncrease = (partner.increase_win_rate * 100).toFixed(2);
              const wrTotal = (partner.hero_win_rate * 100).toFixed(1);

              return (
                <div
                  key={partner.heroid}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-md p-3 flex items-center gap-3 transition-colors"
                >
                  <div className="w-12 h-12 rounded bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                    <img
                      src={partner.head}
                      alt={partner.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-slate-800 text-xs text-amber-400 font-bold">#${partner.heroid}</div>`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {partner.name || `Hero #${partner.heroid}`}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                        +{wrIncrease}% WR
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                      <span>Winrate Tim:</span>
                      <span className="font-mono text-slate-200">{wrTotal}%</span>
                    </div>

                    {partner.bestTime && (
                      <div className="text-[10px] text-amber-400 font-mono mt-1">
                        Peak: {partner.bestTime}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Data sinergi belum dimuat.</p>
        )}
      </div>

      {/* 2. Hubungan Matchup Resmi Moonton (Assist, Strong, Weak) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-arrows-split-up-and-left text-amber-400"></i>
          <span>Analisis Matchup & Counter Hero</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Assist / Rekan Terbaik */}
          {relations.assist && (
            <div className="bg-slate-950 border border-slate-800 rounded-md p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-2">
                  <i className="fa-solid fa-shield"></i>
                  <span>{relations.assist.title || 'Rekan Terbaik (Assist)'}</span>
                </div>

                <div className="flex items-center gap-2 mb-2.5">
                  {relations.assist.heroes?.map((h, i) => (
                    <div key={i} className="w-10 h-10 rounded bg-slate-900 border border-slate-700 overflow-hidden" title={h.name}>
                      <img src={h.head} alt={h.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {relations.assist.desc}
                </p>
              </div>
            </div>
          )}

          {/* Strong Against / Kuat Melawan */}
          {relations.strong && (
            <div className="bg-slate-950 border border-slate-800 rounded-md p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                  <i className="fa-solid fa-sword"></i>
                  <span>{relations.strong.title || 'Kuat Melawan (Hero Di-counter)'}</span>
                </div>

                <div className="flex items-center gap-2 mb-2.5">
                  {relations.strong.heroes?.map((h, i) => (
                    <div key={i} className="w-10 h-10 rounded bg-slate-900 border border-slate-700 overflow-hidden" title={h.name}>
                      <img src={h.head} alt={h.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {relations.strong.desc}
                </p>
              </div>
            </div>
          )}

          {/* Weak Against / Lemah Melawan */}
          {relations.weak && (
            <div className="bg-slate-950 border border-slate-800 rounded-md p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-2">
                  <i className="fa-solid fa-skull-crossbones"></i>
                  <span>{relations.weak.title || 'Lemah Melawan (Counter Hero Ini)'}</span>
                </div>

                <div className="flex items-center gap-2 mb-2.5">
                  {relations.weak.heroes?.map((h, i) => (
                    <div key={i} className="w-10 h-10 rounded bg-slate-900 border border-slate-700 overflow-hidden" title={h.name}>
                      <img src={h.head} alt={h.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {relations.weak.desc}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
