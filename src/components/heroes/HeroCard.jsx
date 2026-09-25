// src/components/heroes/HeroCard.jsx
// Kartu hero solid, clean, tanpa gradient dengan info role & statistik

import React from 'react';
import SolidBadge from '../common/SolidBadge.jsx';

export default function HeroCard({ hero, onClick }) {
  // Role color identifier
  const getRoleVariant = (role) => {
    switch (role) {
      case 'tank': return 'success';
      case 'fighter': return 'warning';
      case 'assassin': return 'purple';
      case 'mage': return 'primary';
      case 'marksman': return 'danger';
      case 'support': return 'cyan';
      default: return 'default';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-slate-900 border border-slate-800 hover:border-amber-500/80 rounded-lg p-3 transition-all duration-150 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
    >
      <div>
        {/* Top: Avatar & Badges */}
        <div className="flex items-start gap-3">
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
            <img
              src={hero.avatar}
              alt={hero.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                // Fallback jika image gagal load
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400 font-bold text-sm">${hero.name.slice(0, 2)}</div>`;
              }}
            />
            <span className="absolute bottom-0 right-0 bg-slate-950/90 text-[10px] text-slate-300 font-mono px-1 rounded-tl">
              #{hero.hero_id}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                {hero.name}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 truncate mb-1.5">
              {hero.title || 'Warrior of MLBB'}
            </p>

            {/* Role Tags */}
            <div className="flex flex-wrap gap-1">
              {hero.roles.map((r, i) => (
                <SolidBadge key={r} variant={getRoleVariant(r)}>
                  {hero.roleLabels?.[i] || r}
                </SolidBadge>
              ))}
            </div>
          </div>
        </div>

        {/* Lane & Speciality */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <i className="fa-solid fa-map-location-dot text-slate-500"></i>
            <span>{hero.laneLabels?.join(', ') || 'Semua Lane'}</span>
          </div>
          {hero.speciality && hero.speciality[0] && (
            <span className="text-slate-400 font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              {hero.speciality[0]}
            </span>
          )}
        </div>
      </div>

      {/* Bottom: Quick Stats (Winrate & Action) */}
      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Win Rate</span>
          <span className={`text-xs font-mono font-bold ${
            (hero.winRate || 50) >= 51 ? 'text-emerald-400' : 'text-slate-300'
          }`}>
            {(hero.winRate || 50.0).toFixed(1)}%
          </span>
        </div>

        <button className="px-2 py-1 bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 text-[11px] font-medium rounded transition-colors flex items-center gap-1">
          <span>Detail</span>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
}
