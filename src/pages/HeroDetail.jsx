// src/pages/HeroDetail.jsx
// Halaman detail lengkap hero dengan tab interaktif untuk skill, sinergi, dan kombo

import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import HeroOverview from '../components/detail/HeroOverview.jsx';
import HeroSkills from '../components/detail/HeroSkills.jsx';
import HeroSynergy from '../components/detail/HeroSynergy.jsx';
import HeroCombos from '../components/detail/HeroCombos.jsx';
import { mlbbService } from '../services/mlbbService.js';
import { HERO_LIST } from '../data/heroList.js';

export default function HeroDetail({ heroId, onNavigate }) {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'skills' | 'synergy' | 'combos' | 'raw_api'

  const currentId = Number(heroId) || 131;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    mlbbService.getHeroFullDetail(currentId).then((res) => {
      if (isMounted) {
        setHero(res.data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentId]);

  const tabs = [
    { id: 'overview', label: 'Ringkasan & Profil', icon: 'fa-solid fa-id-card' },
    { id: 'skills', label: 'Mode & Skillset', icon: 'fa-solid fa-bolt' },
    { id: 'synergy', label: 'Sinergi & Counter', icon: 'fa-solid fa-handshake-simple' },
    { id: 'combos', label: 'Kombo Skill', icon: 'fa-solid fa-gamepad' },
    { id: 'raw_api', label: 'Payload API Asli', icon: 'fa-solid fa-code' }
  ];

  if (loading || !hero) {
    return (
      <div className="flex-1 flex flex-col">
        <Navbar title="Memuat Detail Hero..." onNavigate={onNavigate} />
        <div className="p-8 text-center text-slate-400 text-xs">
          <i className="fa-solid fa-spinner fa-spin text-lg text-amber-500 mb-2"></i>
          <div>Mengambil data profil & skillset dari database...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title={`${hero.name} - Detail Hero`}
        subtitle={`${hero.roleLabels?.join(' / ')} · ${hero.laneLabels?.join(' / ')}`}
        onNavigate={onNavigate}
      />

      <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full">
        {/* Top Control Bar: Back Button & Quick Hero Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-lg p-2.5">
          <button
            onClick={() => onNavigate('/heroes')}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors w-fit"
          >
            <i className="fa-solid fa-arrow-left text-[11px]"></i>
            <span>Kembali ke Katalog</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Pilih Hero Lain:</span>
            <select
              value={currentId}
              onChange={(e) => onNavigate(`/hero/${e.target.value}`)}
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {HERO_LIST.map((h) => (
                <option key={h.hero_id} value={h.hero_id}>
                  #{h.hero_id} - {h.name} ({h.roleLabels?.join(', ')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation Controls (Solid Colors, No Gradient) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-colors whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 border-amber-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-transparent'
                }`}
              >
                <i className={`${tab.icon} text-xs`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === 'overview' && (
            <HeroOverview hero={hero} />
          )}

          {activeTab === 'skills' && (
            <HeroSkills skillModes={hero.skillModes} />
          )}

          {activeTab === 'synergy' && (
            <HeroSynergy hero={hero} />
          )}

          {activeTab === 'combos' && (
            <HeroCombos combos={hero.combos} />
          )}

          {activeTab === 'raw_api' && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase">
                  Data Mentah Moonton GMS (Inspect Scrape)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  hero_id: {hero.hero_id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Berikut adalah struktur data yang diambil dari 3 API Moonton (2756564, 2756567, 2674711) untuk hero ini:
              </p>
              <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96">
                {JSON.stringify({
                  hero_id: hero.hero_id,
                  name: hero.name,
                  roles: hero.roles,
                  lanes: hero.lanes,
                  stats: hero.stats,
                  synergies_count: hero.synergies?.length || 0,
                  relations: hero.relations,
                  skill_modes_count: hero.skillModes?.length || 0,
                  combos_count: hero.combos?.length || 0
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
