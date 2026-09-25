// src/pages/ApiArchitecture.jsx
// Panduan lengkap arsitektur file JS backend scraper MLBB yang ditanyakan user

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import SolidBadge from '../components/common/SolidBadge.jsx';
import { API_FOLDER_STRUCTURE, API_ENDPOINTS_DOCS } from '../data/apiDocsData.js';

export default function ApiArchitecture({ onNavigate }) {
  const [selectedFile, setSelectedFile] = useState('endpoints.js');
  const [copied, setCopied] = useState(false);

  const fileContents = {
    'endpoints.js': `// api/config/endpoints.js
export const MOONTON_BASE_URL = 'https://api.gms.moontontech.com/api/gms/source/2669606';

export const ENDPOINTS = {
  // 1. Daftar hero & profil (source ID: 2756564)
  HERO_LIST_AND_PROFILE: \`\${MOONTON_BASE_URL}/2756564\`,

  // 2. Statistik sinergi & winrate (source ID: 2756567)
  HERO_SYNERGY_AND_STATS: \`\${MOONTON_BASE_URL}/2756567\`,

  // 3. Rekomendasi kombo & taktik (source ID: 2674711)
  HERO_COMBOS_AND_GUIDES: \`\${MOONTON_BASE_URL}/2674711\`
};`,

    'headers.js': `// api/config/headers.js
export const DEFAULT_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'content-type': 'application/json;charset=UTF-8',
  'origin': 'https://www.mobilelegends.com',
  'referer': 'https://www.mobilelegends.com/',
  'user-agent': 'Mozilla/5.0 ...',
  'x-actid': '2669607',
  'x-appid': '2669606',
  'x-lang': 'id'
};

export const AUTH_TOKENS = {
  HERO_LIST: 'CciHBEvFRqQNHGj2djxdUSja7W4=',
  HERO_SYNERGY: 'oPxQMyLOfV+6t1xKEYWuy5VkDC0=',
  HERO_PROFILE: '0Pw0gKbo/cQkI2akbf+t36hMrZ8=',
  HERO_COMBO: 'ry+hQ0nOVtWLe76W8Jl51U+Pq24='
};`,

    'moontonClient.js': `// api/services/moontonClient.js
import axios from 'axios';
import { DEFAULT_HEADERS } from '../config/headers.js';

export const callMoontonApi = async (url, payload, authToken) => {
  const headers = { ...DEFAULT_HEADERS, authorization: authToken };
  const response = await axios.post(url, payload, { headers, timeout: 15000 });
  return response.data;
};`,

    'heroController.js': `// api/controllers/heroController.js
import { ENDPOINTS, ROLE_SORT_MAP } from '../config/endpoints.js';
import { AUTH_TOKENS } from '../config/headers.js';
import { callMoontonApi } from '../services/moontonClient.js';

// Handler 1: Ambil daftar hero (filter role)
export const getHeroList = async (req, res) => { ... };

// Handler 2: Ambil detail profil & skill (Source 2756564)
export const getHeroProfile = async (req, res) => {
  const heroId = parseInt(req.params.id);
  const payload = {
    pageSize: 20,
    pageIndex: 1,
    filters: [{ field: 'hero_id', operator: 'eq', value: heroId }]
  };
  const data = await callMoontonApi(ENDPOINTS.HERO_LIST_AND_PROFILE, payload, AUTH_TOKENS.HERO_PROFILE);
  return res.json({ ok: true, data: data?.data?.records?.[0] });
};`,

    'synergyController.js': `// api/controllers/synergyController.js
// Handler 3: Ambil sinergi partner & winrate (Source 2756567)
export const getHeroSynergy = async (req, res) => {
  const heroId = parseInt(req.params.id);
  const payload = {
    pageSize: 20,
    pageIndex: 1,
    filters: [
      { field: 'main_heroid', operator: 'eq', value: heroId },
      { field: 'bigrank', operator: 'eq', value: 101 },
      { field: 'match_type', operator: 'eq', value: 1 }
    ]
  };
  const data = await callMoontonApi(ENDPOINTS.HERO_SYNERGY_AND_STATS, payload, AUTH_TOKENS.HERO_SYNERGY);
  return res.json({ ok: true, data: data?.data?.records?.[0] });
};`,

    'comboController.js': `// api/controllers/comboController.js
// Handler 4: Ambil panduan kombo & strategi (Source 2674711)
export const getHeroCombos = async (req, res) => {
  const heroId = parseInt(req.params.id);
  const payload = {
    pageSize: 20,
    pageIndex: 1,
    filters: [{ field: 'hero_id', operator: 'eq', value: heroId }],
    object: [2684183]
  };
  const data = await callMoontonApi(ENDPOINTS.HERO_COMBOS_AND_GUIDES, payload, AUTH_TOKENS.HERO_COMBO);
  return res.json({ ok: true, data: data?.data?.records });
};`,

    'heroRoutes.js': `// api/routes/heroRoutes.js
import express from 'express';
import { getHeroList, getHeroProfile } from '../controllers/heroController.js';
import { getHeroSynergy } from '../controllers/synergyController.js';
import { getHeroCombos } from '../controllers/comboController.js';

const router = express.Router();
router.get('/heroes', getHeroList);             // List hero
router.get('/hero/:id', getHeroProfile);         // Profil & skill
router.get('/hero/:id/synergy', getHeroSynergy); // Sinergi & winrate
router.get('/hero/:id/combos', getHeroCombos);   // Kombo skill
export default router;`,

    'server.js': `// api/server.js
import express from 'express';
import heroRoutes from './routes/heroRoutes.js';

const app = express();
app.use(express.json());
app.use('/api', heroRoutes);

app.listen(5000, () => console.log('API berjalan di port 5000'));`
  };

  const handleCopyStructure = () => {
    navigator.clipboard?.writeText(API_FOLDER_STRUCTURE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Rekomendasi Arsitektur Folder & File API JS"
        subtitle="Struktur modular dan bersih untuk memisahkan scraping hero, sinergi, dan kombo"
        onNavigate={onNavigate}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* User Answer Highlights Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Jawaban Pertanyaan: Nama File & Struktur Folder API JS
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Karena saat kamu mengklik hero ada <strong>3 API berbeda yang dipanggil</strong> (Source <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">2756567</code> untuk sinergi, Source <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded">2756564</code> untuk detail & skill hero, dan Source <code className="text-purple-400 bg-slate-950 px-1 py-0.5 rounded">2674711</code> untuk urutan kombo), sebaiknya pisahkan fungsinya menjadi <strong>Controller, Service, Route, dan Config</strong> agar kode tidak menumpuk dalam 1 file besar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">1. API Hero & Profil</span>
              <div className="text-xs font-bold text-blue-400 mt-0.5">heroController.js</div>
              <p className="text-[11px] text-slate-400 mt-1">Mengambil list hero & profil/skill (Source 2756564).</p>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">2. API Sinergi & Winrate</span>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">synergyController.js</div>
              <p className="text-[11px] text-slate-400 mt-1">Mengambil winrate & best partner heroes (Source 2756567).</p>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">3. API Kombo Skill</span>
              <div className="text-xs font-bold text-purple-400 mt-0.5">comboController.js</div>
              <p className="text-[11px] text-slate-400 mt-1">Mengambil urutan skill kombo tim & laning (Source 2674711).</p>
            </div>
          </div>
        </div>

        {/* Folder Structure Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* File Tree Left Column */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Struktur Folder (Pilih File)
              </h3>
              <button
                onClick={handleCopyStructure}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <i className="fa-solid fa-copy"></i>
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="text-slate-400 font-bold py-1">api/</div>

              {/* config/ */}
              <div className="pl-3 space-y-1">
                <div className="text-slate-500 font-bold">config/</div>
                <div className="pl-3 space-y-1">
                  <button
                    onClick={() => setSelectedFile('endpoints.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'endpoints.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 endpoints.js
                  </button>
                  <button
                    onClick={() => setSelectedFile('headers.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'headers.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 headers.js
                  </button>
                </div>
              </div>

              {/* services/ */}
              <div className="pl-3 space-y-1">
                <div className="text-slate-500 font-bold">services/</div>
                <div className="pl-3">
                  <button
                    onClick={() => setSelectedFile('moontonClient.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'moontonClient.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 moontonClient.js
                  </button>
                </div>
              </div>

              {/* controllers/ */}
              <div className="pl-3 space-y-1">
                <div className="text-slate-500 font-bold">controllers/</div>
                <div className="pl-3 space-y-1">
                  <button
                    onClick={() => setSelectedFile('heroController.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'heroController.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 heroController.js
                  </button>
                  <button
                    onClick={() => setSelectedFile('synergyController.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'synergyController.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 synergyController.js
                  </button>
                  <button
                    onClick={() => setSelectedFile('comboController.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'comboController.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 comboController.js
                  </button>
                </div>
              </div>

              {/* routes/ */}
              <div className="pl-3 space-y-1">
                <div className="text-slate-500 font-bold">routes/</div>
                <div className="pl-3">
                  <button
                    onClick={() => setSelectedFile('heroRoutes.js')}
                    className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                      selectedFile === 'heroRoutes.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    📄 heroRoutes.js
                  </button>
                </div>
              </div>

              {/* server.js */}
              <div className="pl-3">
                <button
                  onClick={() => setSelectedFile('server.js')}
                  className={`w-full text-left px-2 py-1 rounded transition-colors text-xs ${
                    selectedFile === 'server.js' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  📄 server.js
                </button>
              </div>
            </div>
          </div>

          {/* Code Viewer Right Column */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-file-code text-amber-400 text-sm"></i>
                <span className="text-xs font-bold text-white font-mono">{selectedFile}</span>
              </div>
              <SolidBadge variant="primary">JavaScript (Node.js/Express)</SolidBadge>
            </div>

            <pre className="bg-slate-950 p-3.5 rounded border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed flex-1 max-h-[460px]">
              {fileContents[selectedFile] || '// File tidak ditemukan'}
            </pre>
          </div>
        </div>

        {/* 4 Endpoints Documentation Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Daftar Endpoint yang Terbentuk di Backend Kamu:
          </h3>

          <div className="space-y-3">
            {API_ENDPOINTS_DOCS.map((doc) => (
              <div key={doc.endpoint} className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold rounded">
                      {doc.method}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {doc.endpoint}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Moonton Source: <strong className="text-amber-400">{doc.sourceId}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {doc.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <span>Parameter: <code className="text-amber-300">{doc.params}</code></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
