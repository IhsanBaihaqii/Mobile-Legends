// src/pages/Dashboard.jsx
// Halaman dashboard utama dengan ringkasan statistik dan hero tren

import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import SolidBadge from '../components/common/SolidBadge.jsx';
import { HERO_LIST } from '../data/heroList.js';
import { ROLES } from '../data/roles.js';

export default function Dashboard({ onNavigate, onSelectHero }) {
  const [featuredHero, setFeaturedHero] = useState(HERO_LIST[0]); // Sora

  useEffect(() => {
    // Default to Sora #131 or Marcel #132
    const sora = HERO_LIST.find(h => h.hero_id === 131) || HERO_LIST[0];
    setFeaturedHero(sora);
  }, []);

  const topWinrateHeroes = [...HERO_LIST].sort((a, b) => b.winRate - a.winRate).slice(0, 5);
  const mostBannedHeroes = [...HERO_LIST].sort((a, b) => b.banRate - a.banRate).slice(0, 5);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="MLBB Statistics & Meta Dashboard"
        subtitle="Analisis data scraping resmi Moonton: Sinergi, Winrate, dan Kombo Skill"
        onNavigate={onNavigate}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Metric Cards (Solid Colors, No Gradient) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">Total Hero Terdaftar</span>
              <i className="fa-solid fa-users text-amber-500 text-sm"></i>
            </div>
            <div className="text-xl font-bold font-mono text-white">132</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Hero terbaru: Marcel & Sora</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">API Source Aktif</span>
              <i className="fa-solid fa-server text-blue-500 text-sm"></i>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">3 Source</div>
            <span className="text-[10px] text-slate-400 mt-1 block">2756564 · 2756567 · 2674711</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">Rank Baseline</span>
              <i className="fa-solid fa-crown text-amber-400 text-sm"></i>
            </div>
            <div className="text-xl font-bold font-mono text-white">Mythic+ (101)</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Filter: Match Type Ranked</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">Data Scrape Format</span>
              <i className="fa-solid fa-code text-purple-400 text-sm"></i>
            </div>
            <div className="text-xl font-bold font-mono text-purple-300">Clean JSON (JS)</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Modular & terpisah per fitur</span>
          </div>
        </div>

        {/* Featured Hero Banner Spotlight */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Hero Sorotan Terkini (New Release)
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {featuredHero.name} - {featuredHero.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl mt-1">
                Memiliki dua mode bertarung: <span className="text-amber-400 font-semibold">Mode Thunder</span> (Assassin burst) dan <span className="text-blue-400 font-semibold">Mode Torrent</span> (Tank crowd control). Membuka True Art saat stack Cloudstep mencapai 5.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  if (onSelectHero) onSelectHero(featuredHero);
                  else onNavigate(`/hero/${featuredHero.hero_id}`);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-eye"></i>
                <span>Buka Detail & Kombo Skill</span>
              </button>

              <button
                onClick={() => onNavigate('/heroes')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded border border-slate-700 transition-colors"
              >
                Lihat Semua Hero
              </button>
            </div>
          </div>

          <div className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-lg p-3 shrink-0 flex items-center gap-3">
            <div className="w-16 h-16 rounded bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
              <img
                src={featuredHero.avatar}
                alt={featuredHero.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{featuredHero.name}</div>
              <div className="text-[11px] text-slate-400">EXP Lane · Fighter/Assassin</div>
              <div className="mt-1 flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold">49.48% WR</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">2.75% Ban</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Column Stats: Top Winrate & Most Banned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Winrate */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-trophy text-amber-400"></i>
                <span>Win Rate Tertinggi (Ranked Mythic+)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Top 5</span>
            </div>

            <div className="space-y-2">
              {topWinrateHeroes.map((hero, i) => (
                <div
                  key={hero.hero_id}
                  onClick={() => onSelectHero ? onSelectHero(hero) : onNavigate(`/hero/${hero.hero_id}`)}
                  className="flex items-center justify-between p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-slate-400 w-4 text-center">
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
                      <img src={hero.avatar} alt={hero.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{hero.name}</div>
                      <div className="text-[10px] text-slate-400">{hero.roleLabels?.join(', ')}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {hero.winRate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Win Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Banned */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-ban text-rose-500"></i>
                <span>Hero Paling Banyak Di-Ban</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Top 5</span>
            </div>

            <div className="space-y-2">
              {mostBannedHeroes.map((hero, i) => (
                <div
                  key={hero.hero_id}
                  onClick={() => onSelectHero ? onSelectHero(hero) : onNavigate(`/hero/${hero.hero_id}`)}
                  className="flex items-center justify-between p-2 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-slate-400 w-4 text-center">
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
                      <img src={hero.avatar} alt={hero.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{hero.name}</div>
                      <div className="text-[10px] text-slate-400">{hero.roleLabels?.join(', ')}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {hero.banRate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Ban Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Role Jump */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Eksplorasi Berdasarkan Kategori Role
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {ROLES.slice(1).map((r) => (
              <button
                key={r.id}
                onClick={() => onNavigate('/heroes')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded text-center transition-colors group"
              >
                <i className={`${r.icon} text-lg mb-1.5 text-slate-400 group-hover:text-amber-400 transition-colors block`}></i>
                <div className="text-xs font-bold text-white">{r.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Buka Katalog</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
