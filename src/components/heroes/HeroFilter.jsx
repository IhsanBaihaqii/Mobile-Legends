// src/components/heroes/HeroFilter.jsx
// Filter bar untuk Role dan Jalur (Lane) dengan warna solid

import React from 'react';
import { ROLES } from '../../data/roles.js';
import { LANES } from '../../data/lanes.js';

export default function HeroFilter({ activeRole, onRoleChange, activeLane, onLaneChange, totalResults }) {
  return (
    <div className="space-y-3 bg-slate-900 border border-slate-800 rounded-lg p-3 md:p-4">
      {/* Role Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Filter Berdasarkan Role:
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {totalResults} hero ditemukan
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ROLES.map((role) => {
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onRoleChange(role.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border whitespace-nowrap transition-colors ${
                  isActive ? role.activeColor : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <i className={`${role.icon} text-xs`}></i>
                <span>{role.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lane / Road Filters */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Filter Berdasarkan Jalur (Lane):
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {LANES.map((lane) => {
            const isActive = activeLane === lane.id;
            return (
              <button
                key={lane.id}
                onClick={() => onLaneChange(lane.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <i className={`${lane.icon} text-[10px]`}></i>
                <span>{lane.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
