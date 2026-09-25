// api/config/endpoints.js
// Daftar URL endpoint resmi API Moonton GMS berdasarkan fungsi

export const MOONTON_BASE_URL = process.env.MOONTON_BASE_URL || "";

export const ENDPOINTS = {
  // 1. Endpoint daftar hero & profil dasar (source ID: 2756564)
  HERO_LIST_AND_PROFILE: `${MOONTON_BASE_URL}/2756564`,

  // 2. Endpoint statistik sinergi, winrate, ban rate & partner (source ID: 2756567)
  HERO_SYNERGY_AND_STATS: `${MOONTON_BASE_URL}/2756567`,

  // 3. Endpoint rekomendasi kombo & tutorial taktik tim (source ID: 2674711)
  HERO_COMBOS_AND_GUIDES: `${MOONTON_BASE_URL}/2674711`,
};

export const ROLE_SORT_MAP = {
  all: [1, 2, 3, 4, 5, 6],
  tank: [1],
  fighter: [2],
  assassin: [3],
  mage: [4],
  marksman: [5],
  support: [6],
};
