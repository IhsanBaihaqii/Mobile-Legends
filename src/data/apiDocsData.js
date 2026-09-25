// src/data/apiDocsData.js
// Penjelasan terstruktur tentang arsitektur file API JS yang direkomendasikan

export const API_FOLDER_STRUCTURE = `
mlbb-backend-api/
├── config/
│   ├── endpoints.js       # URL source Moonton (2756564, 2756567, 2674711)
│   └── headers.js         # Header request (user-agent, appid, auth token)
├── services/
│   └── moontonClient.js   # Axios instance & error handling
├── controllers/
│   ├── heroController.js  # Handler getHeroList & getHeroProfile
│   ├── synergyController.js # Handler getHeroSynergy (winrate, partner hero)
│   └── comboController.js   # Handler getHeroCombos (skill sequences)
├── routes/
│   └── heroRoutes.js      # Definisi URL Express /api/heroes, /api/hero/:id...
└── server.js              # Entry point Express server
`;

export const API_ENDPOINTS_DOCS = [
  {
    method: 'GET',
    endpoint: '/api/heroes',
    sourceId: '2756564',
    title: 'Daftar Hero & Filter Role',
    description: 'Mengambil seluruh hero atau filter berdasarkan role (tank, fighter, assassin, mage, marksman, support).',
    params: '?role=all|mage|assassin|tank|fighter|marksman|support&page=1',
    authNeeded: 'CciHBEvFRqQNHGj2djxdUSja7W4=',
    sampleResponse: `{
  "ok": true,
  "role": "support",
  "total": 15,
  "data": [
    {
      "hero_id": 132,
      "hero": { "name": "Marcel", "smallmap": "..." }
    }
  ]
}`
  },
  {
    method: 'GET',
    endpoint: '/api/hero/:id',
    sourceId: '2756564',
    title: 'Profil Lengkap, Skill, & Atribut Hero',
    description: 'Mengambil info visual painting, cerita, radar ability (durability/offense), serta daftar skill lengkap beserta kalkulasi damage (+% Total Physical Attack).',
    params: ':id (misal 131 untuk Sora)',
    authNeeded: '0Pw0gKbo/cQkI2akbf+t36hMrZ8=',
    sampleResponse: `{
  "ok": true,
  "heroId": 131,
  "data": {
    "name": "Sora",
    "painting": "https://akmweb.youngjoygame.com/.../bc8375c54a43cc02fedcc304033c23bb.webp",
    "heroskilllist": [ ... ],
    "story": "Seorang pemuda polos yang berjiwa bebas..."
  }
}`
  },
  {
    method: 'GET',
    endpoint: '/api/hero/:id/synergy',
    sourceId: '2756567',
    title: 'Statistik Sinergi, Winrate & Counter Matchup',
    description: 'Mengambil winrate real-time, ban rate, rekan sinergi terbaik (+winrate) dan rekan dengan sinergi terburuk (-winrate) berdasarkan data Ranked Mythic.',
    params: ':id (misal 131 untuk Sora)',
    authNeeded: 'oPxQMyLOfV+6t1xKEYWuy5VkDC0=',
    sampleResponse: `{
  "ok": true,
  "heroId": 131,
  "data": {
    "main_hero_win_rate": 0.494823,
    "main_hero_ban_rate": 0.027531,
    "sub_hero": [
      { "heroid": 108, "hero_win_rate": 0.5755, "increase_win_rate": 0.0273 }
    ]
  }
}`
  },
  {
    method: 'GET',
    endpoint: '/api/hero/:id/combos',
    sourceId: '2674711',
    title: 'Rekomendasi Kombo Skill & Strategi Laning',
    description: 'Mengambil urutan skill kombo (misal Skill 2 -> Ulti -> Skill 1 -> Skill 2) beserta icon skill dan tips penempatan posisi.',
    params: ':id (misal 131 untuk Sora)',
    authNeeded: 'ry+hQ0nOVtWLe76W8Jl51U+Pq24=',
    sampleResponse: `{
  "ok": true,
  "heroId": 131,
  "total": 2,
  "data": [
    { "title": "KOMBO TEAM FIGHT", "desc": "Gunakan mode Thunder...", "skill_id": [ ... ] }
  ]
}`
  }
];
