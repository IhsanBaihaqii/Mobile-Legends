// src/components/detail/HeroSkills.jsx
// Visualisasi skillset hero dengan dukungan multi-mode (Thunder, Torrent, Base)

import React, { useState } from 'react';
import SolidBadge from '../common/SolidBadge.jsx';

export default function HeroSkills({ skillModes }) {
  const modes = skillModes || [];
  const [activeModeIndex, setActiveModeIndex] = useState(0);

  if (modes.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center text-xs text-slate-400">
        Data skill tidak tersedia untuk hero ini.
      </div>
    );
  }

  const currentMode = modes[activeModeIndex] || modes[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-bolt-lightning text-amber-500"></i>
            <span>Skillset & Mekanisme Skill</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Pilih mode bertarung untuk melihat efek dan scaling damage spesifik
          </p>
        </div>

        {/* Mode Tabs */}
        {modes.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {modes.map((mode, idx) => {
              const isActive = activeModeIndex === idx;
              return (
                <button
                  key={mode.id || idx}
                  onClick={() => setActiveModeIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <i className={`${mode.icon || 'fa-solid fa-certificate'} text-[11px]`}></i>
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {currentMode.skills?.map((skill, index) => (
          <div
            key={skill.skillid || index}
            className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between"
          >
            <div>
              {/* Skill Top Bar: Icon, Name, Type & Cooldown */}
              <div className="flex items-start gap-3 mb-2.5">
                <div className="w-12 h-12 rounded bg-slate-900 border border-slate-700 p-1 shrink-0 overflow-hidden">
                  <img
                    src={skill.icon}
                    alt={skill.skillname}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400 font-bold text-xs">${index + 1}</div>`;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {skill.skillname}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                      {skill.cost || 'No Cost'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <SolidBadge variant="default">
                      {skill.type || `Skill ${index}`}
                    </SolidBadge>

                    {skill.tags?.map((tag) => (
                      <SolidBadge
                        key={tag}
                        variant={
                          tag === 'Buff' ? 'cyan' :
                          tag === 'Damage' ? 'danger' :
                          tag === 'CC' || tag === 'Airborne' ? 'warning' : 'purple'
                        }
                      >
                        {tag}
                      </SolidBadge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skill Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {skill.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
