// src/services/mlbbService.js
// Client service untuk memanggil Live Scrape API backend kita (/api/hero)

export const mlbbService = {
  // Ambil daftar hero per page (21 hero) dengan filter role
  async fetchHeroPage({ role = 'all', page = 1, pageSize = 21 } = {}) {
    const res = await fetch(`/api/hero?role=${encodeURIComponent(role)}&page=${page}&pageSize=${pageSize}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json;
  },

  // Ambil detail lengkap hero (profil, stats sinergi, kombo skill)
  async fetchHeroDetail(heroId) {
    const res = await fetch(`/api/hero/${heroId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json;
  }
};
