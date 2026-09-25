// src/pages/Login.jsx
// Halaman login bersih dengan warna solid, tanpa gradient, responsif

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState('player'); // 'player' | 'analyst' | 'scout'
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onNavigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Masuk Akun MLBB Explorer"
        subtitle="Kelola profil analitik hero, bookmark sinergi favorit, dan draft simulator"
        onNavigate={onNavigate}
      />

      <div className="p-4 md:p-8 flex items-center justify-center flex-1">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 shadow-lg">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded bg-amber-500 text-slate-950 flex items-center justify-center mx-auto text-xl font-black mb-2">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Akses Portal Analis MLBB
            </h2>
            <p className="text-xs text-slate-400">
              Sinkronisasi data hero scraping dengan dashboard tim kamu
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setRoleMode('player')}
              className={`py-1.5 rounded font-medium transition-colors ${
                roleMode === 'player' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Player
            </button>
            <button
              type="button"
              onClick={() => setRoleMode('analyst')}
              className={`py-1.5 rounded font-medium transition-colors ${
                roleMode === 'analyst' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Coach/Analyst
            </button>
            <button
              type="button"
              onClick={() => setRoleMode('scout')}
              className={`py-1.5 rounded font-medium transition-colors ${
                roleMode === 'scout' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Scout
            </button>
          </div>

          {isSuccess ? (
            <div className="p-3 bg-emerald-950 border border-emerald-800 rounded text-center space-y-1">
              <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
              <div className="text-xs font-bold text-emerald-300">Login Berhasil!</div>
              <div className="text-[11px] text-emerald-400/80">Mengalihkan ke Dashboard...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Email atau MLBB ID
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: player@mlbb.id atau 1319984"
                    className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded bg-slate-950 border-slate-700 text-amber-500" />
                  <span>Ingat sesi ini</span>
                </label>
                <a href="#reset" className="text-amber-400 hover:underline">
                  Lupa sandi?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors"
              >
                Masuk ke Dashboard
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-800 text-center text-[11px] text-slate-400">
            <span>Belum memiliki akun tim? </span>
            <button onClick={() => onNavigate('/dashboard')} className="text-amber-400 hover:underline font-medium">
              Lanjut sebagai Tamu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
