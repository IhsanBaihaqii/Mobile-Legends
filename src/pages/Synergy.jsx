// src/pages/Synergy.jsx
// Halaman analisis sinergi dan counter tim Mobile Legends

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import SolidBadge from '../components/common/SolidBadge.jsx';
import { HERO_LIST } from '../data/heroList.js';
import { HERO_DETAILS } from '../data/heroDetails.js';

export default function Synergy({ onNavigate }) {
  const [selectedHeroId, setSelectedHeroId] = useState(131); // Default Sora

  const currentHero = HERO_LIST.find(h => h.hero_id === selectedHeroId) || HERO_LIST[0];
  const detail = HERO_DETAILS[selectedHeroId] || HERO_DETAILS[131];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Sinergi Pasangan & Counter Hero"
        subtitle="Analisis kombinasi hero terbaik berdasarkan statistik kemenangan resmi Moonton"
        onNavigate={onNavigate}
      />

      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Selector Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
              <img src={currentHero.avatar} alt={currentHero.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentHero.name}</span>
                <SolidBadge variant="primary">{currentHero.roleLabels?.join(', ')}</SolidBadge>
              </h2>
              <p className="text-[11px] text-slate-400">Pilih hero utama untuk menganalisis rekan duet terbaiknya</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ganti Hero:</span>
            <select
              value={selectedHeroId}
              onChange={(e) => setSelectedHeroId(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {HERO_LIST.map((h) => (
                <option key={h.hero_id} value={h.hero_id}>
                  #{h.hero_id} - {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Synergy Partners & Counter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Synergies */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-handshake-angle text-emerald-400"></i>
                <span>Top Sinergi Rekan Duet (Ranked Match)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                +Win Rate
              </span>
            </div>

            <div className="space-y-2.5">
              {detail.synergies?.map((partner, idx) => (
                <div
                  key={partner.heroid || idx}
                  className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-slate-500 w-3">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                      <img src={partner.head} alt={partner.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{partner.name || `Hero #${partner.heroid}`}</div>
                      <div className="text-[10px] text-slate-400">{partner.bestTime || 'Fase Mid Game'}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      +{(partner.increase_win_rate * 100).toFixed(2)}% WR
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Total: {(partner.hero_win_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anti-Synergies / Kurang Cocok */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-triangle-exclamation text-rose-400"></i>
                <span>Kurang Cocok / Konflik Peran</span>
              </h3>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                -Win Rate
              </span>
            </div>

            <div className="space-y-2.5">
              {detail.antiSynergies?.map((anti, idx) => (
                <div
                  key={anti.heroid || idx}
                  className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold font-mono text-slate-500 w-3">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                      #{anti.heroid}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{anti.name || `Hero #${anti.heroid}`}</div>
                      <div className="text-[10px] text-slate-400">Menurunkan potensi kemenangan bersama</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-400 block">
                      {(anti.increase_win_rate * 100).toFixed(2)}% WR
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Total: {(anti.hero_win_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Strategy Advice */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 leading-relaxed mt-4">
              <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                <i className="fa-solid fa-lightbulb"></i>
                <span>Tips Draft Pick Tim:</span>
              </div>
              Pilihlah rekan dengan crowd control solid (seperti Tigreal, Minotaur, Gatotkaca) saat menggunakan Sora agar kombo True Art dapat mengenai banyak musuh sekaligus.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
