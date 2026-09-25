// src/components/layout/Sidebar.jsx
// Sidebar layout wrapper responsif untuk Desktop, iPad, dan Mobile

import React, { useState } from 'react';
import { NAV_ITEMS } from '../../data/navigation.js';

export default function Sidebar({ currentRoute, onNavigate, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavClick = (path) => {
    onNavigate(path);
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
            <i className="fa-solid fa-gamepad"></i>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-none">MLBB EXPLORER</h1>
            <span className="text-[10px] text-slate-400">Moonton API Data Hub</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-9 h-9 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
          aria-label="Toggle Navigation"
        >
          <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'} text-sm`}></i>
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar (Desktop & Drawer Mobile) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">MLBB GMS HUB</h2>
            <p className="text-[11px] text-slate-400">Statistik Hero & Sinergi</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.path || 
              (item.path === '/heroes' && currentRoute.startsWith('/hero/'));

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 font-semibold border-l-2 border-amber-500 pl-2.5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`${item.icon} w-4 text-center text-sm ${isActive ? 'text-amber-400' : 'text-slate-400'}`}></i>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* API Scrape Status Card */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Moonton GMS API</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Source 2756564, 2756567 & 2674711 terhubung aktif.
            </p>
          </div>
        </div>

        {/* User Quick Profile */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium text-slate-200">Player Mode</div>
              <div className="text-[10px] text-slate-400">Rank: Mythic</div>
            </div>
          </div>
          <button 
            onClick={() => handleNavClick('/login')}
            className="text-slate-400 hover:text-slate-200 text-xs p-1"
            title="Kelola Akun"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex items-center justify-around py-2 px-1 z-30">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = currentRoute === item.path ||
            (item.path === '/heroes' && currentRoute.startsWith('/hero/'));
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded text-[11px] transition-colors ${
                isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className={`${item.icon} text-sm`}></i>
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
