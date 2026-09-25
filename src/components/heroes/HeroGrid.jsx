// src/components/heroes/HeroGrid.jsx
// Grid responsif untuk katalog hero

import React from 'react';
import HeroCard from './HeroCard.jsx';

export default function HeroGrid({ heroes, onSelectHero, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-slate-900 border border-slate-800 rounded-lg p-3 animate-pulse h-44 flex flex-col justify-between">
            <div className="flex gap-3">
              <div className="w-14 h-14 bg-slate-800 rounded shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-slate-800 rounded"></div>
                <div className="w-16 h-3 bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="w-full h-8 bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!heroes || heroes.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3 text-lg">
          <i className="fa-solid fa-ghost"></i>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Tidak Ada Hero Ditemukan</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Coba ganti filter role atau ubah kata kunci pencarian hero kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {heroes.map((hero) => (
        <HeroCard
          key={hero.hero_id}
          hero={hero}
          onClick={() => onSelectHero(hero)}
        />
      ))}
    </div>
  );
}
