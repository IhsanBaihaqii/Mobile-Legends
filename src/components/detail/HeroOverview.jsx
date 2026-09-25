// src/components/detail/HeroOverview.jsx
// Overview profil hero, atribut radar/bar, dan statistik utama

import React from 'react';
import SolidBadge from '../common/SolidBadge.jsx';

export default function HeroOverview({ hero }) {
  if (!hero) return null;

  const abilityLabels = hero.abilityLabels || ['Durability', 'Offense', 'Skill Effect', 'Difficulty'];
  const abilityValues = hero.abilityshow || [60, 60, 50, 50];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Hero Banner with Solid Dark Canvas */}
      <div className="relative p-4 md:p-6 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-5">
        {/* Hero Painting / Big Head */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-lg bg-slate-950 border-2 border-slate-700 overflow-hidden shrink-0 shadow-md">
          <img
            src={hero.painting || hero.avatar}
            alt={hero.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.src = hero.avatar;
            }}
          />
          <div className="absolute top-1.5 left-1.5 bg-slate-950/90 text-[10px] font-mono px-1.5 py-0.5 rounded text-amber-400 font-bold border border-slate-800">
            ID #{hero.hero_id}
          </div>
        </div>

        {/* Hero Title & Identity */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {hero.name}
            </h2>
            <SolidBadge variant="warning">
              {hero.title || 'Official Hero'}
            </SolidBadge>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            {hero.roleLabels?.map((r) => (
              <SolidBadge key={r} variant="primary">
                <i className="fa-solid fa-tag text-[10px]"></i>
                <span>{r}</span>
              </SolidBadge>
            ))}
            {hero.laneLabels?.map((l) => (
              <SolidBadge key={l} variant="default">
                <i className="fa-solid fa-route text-[10px]"></i>
                <span>{l}</span>
              </SolidBadge>
            ))}
          </div>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed max-w-2xl bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
            {hero.story || 'Seorang petarung tangguh di Land of Dawn dengan kemampuan unik dan mobilitas tinggi dalam pertempuran tim.'}
          </p>
        </div>

        {/* Quick Winrate Card */}
        <div className="w-full md:w-48 bg-slate-950 border border-slate-800 rounded-lg p-3 shrink-0 grid grid-cols-3 md:grid-cols-1 gap-2 text-center md:text-left">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Win Rate</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {(hero.winRate || (hero.stats?.winRate ? hero.stats.winRate * 100 : 50)).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Pick Rate</span>
            <span className="text-sm font-mono font-bold text-blue-400">
              {(hero.appearanceRate || (hero.stats?.appearanceRate ? hero.stats.appearanceRate * 100 : 1.2)).toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Ban Rate</span>
            <span className="text-sm font-mono font-bold text-amber-400">
              {(hero.banRate || (hero.stats?.banRate ? hero.stats.banRate * 100 : 2.5)).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Ability / Stat Bars */}
      <div className="p-4 md:p-6 bg-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <i className="fa-solid fa-chart-simple text-amber-500"></i>
            <span>Parameter Kemampuan Hero</span>
          </h4>

          <div className="space-y-2.5">
            {abilityLabels.map((lbl, idx) => {
              const val = Number(abilityValues[idx]) || 50;
              return (
                <div key={lbl}>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{lbl}</span>
                    <span className="font-mono font-bold">{val}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${
                        idx === 0 ? 'bg-emerald-500' :
                        idx === 1 ? 'bg-amber-500' :
                        idx === 2 ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, val))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Level Upgrade */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <i className="fa-solid fa-wand-magic text-blue-400"></i>
            <span>Rekomendasi Upgrade Skill</span>
          </h4>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-md">
            <div className="text-xs font-medium text-slate-200 mb-1">
              Urutan Prioritas Skill:
            </div>
            <div className="text-xs font-mono text-amber-400 font-bold mb-2">
              {hero.recommendlevellabel || '3 > 1 > 2 (Prioritas Ultimate)'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tingkatkan Ultimate setiap level 4, 8, dan 12. Maksimalkan skill penghasil damage utama terlebih dahulu untuk mempercepat farming di lane.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
