// src/components/detail/HeroCombos.jsx
// Visualisasi urutan kombo skill hero & panduan gameplay (Source Moonton 2674711)

import React from 'react';
import SolidBadge from '../common/SolidBadge.jsx';

export default function HeroCombos({ combos }) {
  const comboList = combos || [];

  if (comboList.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center text-xs text-slate-400">
        Data panduan kombo belum tersedia untuk hero ini.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-gamepad text-amber-400"></i>
            <span>Panduan Kombo Skill & Urutan Eksekusi</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Urutan tombol skill resmi untuk memaksimalkan burst damage dan crowd control
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          Source API: <span className="text-purple-400 font-bold">2674711</span>
        </div>
      </div>

      <div className="space-y-4">
        {comboList.map((combo, idx) => (
          <div
            key={combo.id || idx}
            className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                  {combo.title}
                </h4>
              </div>

              {combo.badge && (
                <SolidBadge variant="primary">
                  {combo.badge}
                </SolidBadge>
              )}
            </div>

            {/* Step Sequence Flow */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 bg-slate-900/60 rounded border border-slate-800/80">
              {combo.steps?.map((step, sIdx) => (
                <React.Fragment key={sIdx}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-11 h-11 rounded-lg bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shadow">
                      {step.icon ? (
                        <img
                          src={step.icon}
                          alt={step.skill}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<span class="text-xs font-mono font-bold text-amber-400">${sIdx + 1}</span>`;
                          }}
                        />
                      ) : (
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {sIdx + 1}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium text-center max-w-[80px] truncate">
                      {step.skill}
                    </span>
                  </div>

                  {sIdx < combo.steps.length - 1 && (
                    <div className="text-slate-400 text-xs px-1 shrink-0">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Tactical Explanation */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-800/60">
              {combo.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
