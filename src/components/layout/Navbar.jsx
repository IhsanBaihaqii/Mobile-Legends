// src/components/layout/Navbar.jsx
// Top navbar sederhana dengan warna solid dan kontrol fungsional

import React from 'react';

export default function Navbar({ title, subtitle, searchValue, onSearchChange, onNavigate }) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 md:px-6 md:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 md:static z-20">
      <div>
        <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {onSearchChange && (
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
            <input
              type="text"
              placeholder="Cari hero, role, atau skill..."
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => onNavigate && onNavigate('/api-explorer')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors shrink-0"
          title="Lihat Arsitektur API JS"
        >
          <i className="fa-solid fa-code text-amber-400"></i>
          <span>API JS</span>
        </button>
      </div>
    </div>
  );
}
