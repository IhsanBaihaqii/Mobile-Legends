// server.js
// Express backend server with live proxy to Moonton GMS APIs & Vite middleware integration
import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const MOONTON_BASE_URL = 'https://api.gms.moontontech.com/api/gms/source/2669606';

const COMMON_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'id-ID,id;q=0.9,en-ID;q=0.8,en;q=0.7,en-US;q=0.6',
  'content-type': 'application/json;charset=UTF-8',
  'origin': 'https://www.mobilelegends.com',
  'referer': 'https://www.mobilelegends.com/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
  'x-actid': '2669607',
  'x-appid': '2669606',
  'x-lang': 'id'
};

const ROLE_MAP = {
  all: [1, 2, 3, 4, 5, 6],
  tank: [1],
  fighter: [2],
  assassin: [3],
  mage: [4],
  marksman: [5],
  support: [6]
};

// 1. Live Scrape Endpoint: List Hero with Infinite Scroll Pagination
// GET /api/hero?role=all|tank|fighter|assassin|mage|marksman|support&page=1&pageSize=21
app.get('/api/hero', async (req, res) => {
  const role = req.query.role || 'all';
  const pageIndex = parseInt(req.query.page || req.query.pageIndex) || 1;
  const pageSize = parseInt(req.query.pageSize) || 21;
  const sortIds = ROLE_MAP[role] || ROLE_MAP.all;

  const payload = {
    pageSize,
    pageIndex,
    filters: [
      {
        field: '<hero.data.sortid>',
        operator: 'hasAnyOf',
        value: sortIds.map(String)
      },
      {
        field: '<hero.data.roadsort>',
        operator: 'hasAnyOf',
        value: [1, 2, 3, 4, 5]
      }
    ],
    sorts: [{ data: { field: 'hero_id', order: 'desc' }, type: 'sequence' }],
    fields: [
      'id',
      'hero_id',
      'hero.data.name',
      'hero.data.smallmap',
      'hero.data.sortid',
      'hero.data.roadsort'
    ],
    object: []
  };

  try {
    const moontonRes = await axios.post(
      `${MOONTON_BASE_URL}/2756564`,
      payload,
      {
        headers: {
          ...COMMON_HEADERS,
          authorization: process.env.MOONTON_AUTH_LIST || 'CciHBEvFRqQNHGj2djxdUSja7W4='
        },
        timeout: 15000
      }
    );

    const data = moontonRes.data;
    const items = data?.data?.records || data?.data?.list || data?.records || [];

    return res.status(200).json({
      ok: true,
      role,
      pageIndex,
      pageSize,
      total: items.length,
      data: items
    });
  } catch (err) {
    console.error('Error fetching hero list page:', pageIndex, err.message);
    return res.status(err.response?.status || 500).json({
      ok: false,
      message: err.message,
      detail: err.response?.data
    });
  }
});

// Helper to parse tag array (roles/roads)
function parseTagArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => x && typeof x === 'object' && x.data)
    .map((x) => ({
      id: String(x.data.sort_id ?? x.data.road_sort_id ?? ''),
      title: (x.data.sort_title ?? x.data.road_sort_title ?? '').toLowerCase(),
      rawTitle: x.data.sort_title ?? x.data.road_sort_title ?? '',
      icon: x.data.sort_icon ?? x.data.road_sort_icon ?? ''
    }))
    .filter((x) => x.title);
}

// 2. Live Scrape Endpoint: Detail Hero (Combines 3 Moonton APIs for Hero Profile, Synergy Stats, & Combos)
// GET /api/hero/:id
app.get('/api/hero/:id', async (req, res) => {
  const heroId = parseInt(req.params.id);
  if (!heroId) {
    return res.status(400).json({ ok: false, message: 'Hero ID is required' });
  }

  try {
    // API 1: Hero profile, painting, skillset, difficulty, story, relation (Source 2756564)
    const profilePromise = axios.post(
      `${MOONTON_BASE_URL}/2756564`,
      {
        pageSize: 20,
        pageIndex: 1,
        filters: [{ field: 'hero_id', operator: 'eq', value: heroId }],
        sorts: [],
        object: []
      },
      {
        headers: {
          ...COMMON_HEADERS,
          authorization: process.env.MOONTON_AUTH_PROFILE || '0Pw0gKbo/cQkI2akbf+t36hMrZ8='
        },
        timeout: 15000
      }
    ).catch(err => {
      console.error('Profile fetch error:', err.message);
      return null;
    });

    // API 2: Synergy, Winrate, Banrate, Sub_hero & Sub_hero_last (Source 2756567)
    const synergyPromise = axios.post(
      `${MOONTON_BASE_URL}/2756567`,
      {
        pageSize: 20,
        pageIndex: 1,
        filters: [
          { field: 'main_heroid', operator: 'eq', value: heroId },
          { field: 'bigrank', operator: 'eq', value: 101 },
          { field: 'match_type', operator: 'eq', value: 1 }
        ],
        sorts: []
      },
      {
        headers: {
          ...COMMON_HEADERS,
          authorization: process.env.MOONTON_AUTH_SYNERGY || 'oPxQMyLOfV+6t1xKEYWuy5VkDC0='
        },
        timeout: 15000
      }
    ).catch(err => {
      console.error('Synergy fetch error:', err.message);
      return null;
    });

    // API 3: Recommended Skill Combos & Lane strategy (Source 2674711)
    const comboPromise = axios.post(
      `${MOONTON_BASE_URL}/2674711`,
      {
        pageSize: 20,
        pageIndex: 1,
        filters: [{ field: 'hero_id', operator: 'eq', value: heroId }],
        sorts: [],
        object: [2684183]
      },
      {
        headers: {
          ...COMMON_HEADERS,
          authorization: process.env.MOONTON_AUTH_COMBO || 'ry+hQ0nOVtWLe76W8Jl51U+Pq24='
        },
        timeout: 15000
      }
    ).catch(err => {
      console.error('Combo fetch error:', err.message);
      return null;
    });

    const [profileRes, synergyRes, comboRes] = await Promise.all([
      profilePromise,
      synergyPromise,
      comboPromise
    ]);

    const profileRecord = profileRes?.data?.data?.records?.[0]?.data || null;
    const heroRaw = profileRecord?.hero?.data || {};

    // Parse skills
    const rawSkillLists = heroRaw.heroskilllist || [];
    const skills = [];
    rawSkillLists.forEach((sl) => {
      (sl.skilllist || []).forEach((sk) => {
        if (!skills.some((s) => s.id === sk.skillid)) {
          skills.push({
            id: sk.skillid,
            name: sk.skillname,
            icon: sk.skillicon,
            cd: sk['skillcd&cost'] || '',
            desc: sk.skilldesc || '',
            tags: (sk.skilltag || []).map((t) => ({
              id: t.tagid,
              name: t.tagname,
              rgb: t.tagrgb || '245,196,81'
            }))
          });
        }
      });
    });

    // Parse relations (assist, strong, weak)
    const relRaw = profileRecord?.relation || {};
    const relation = {
      assist: {
        desc: relRaw.assist?.desc || '',
        heads: (relRaw.assist?.target_hero || []).map(th => th.data?.head).filter(Boolean),
        targetHeroIds: relRaw.assist?.target_hero_id || []
      },
      strong: {
        desc: relRaw.strong?.desc || '',
        heads: (relRaw.strong?.target_hero || []).map(th => th.data?.head).filter(Boolean),
        targetHeroIds: relRaw.strong?.target_hero_id || []
      },
      weak: {
        desc: relRaw.weak?.desc || '',
        heads: (relRaw.weak?.target_hero || []).map(th => th.data?.head).filter(Boolean),
        targetHeroIds: relRaw.weak?.target_hero_id || []
      }
    };

    // Parse Stats & Synergy
    const synergyRecord = synergyRes?.data?.data?.records?.[0]?.data || null;
    let stats = null;
    if (synergyRecord) {
      stats = {
        winRate: synergyRecord.main_hero_win_rate || 0,
        pickRate: synergyRecord.main_hero_appearance_rate || 0,
        banRate: synergyRecord.main_hero_ban_rate || 0,
        subHeroes: (synergyRecord.sub_hero || []).map(sh => ({
          heroid: sh.heroid,
          winRate: sh.hero_win_rate || 0,
          increaseWinRate: sh.increase_win_rate || 0,
          head: sh.hero?.data?.head || ''
        })),
        lastHeroes: (synergyRecord.sub_hero_last || []).map(shl => ({
          heroid: shl.heroid,
          winRate: shl.hero_win_rate || 0,
          increaseWinRate: shl.increase_win_rate || 0
        }))
      };
    }

    // Parse Combos
    const comboRecords = comboRes?.data?.data?.records || [];
    const combos = comboRecords.map(cr => {
      const cd = cr.data || {};
      const skillIcons = (cd.skill_id || []).map(s => s.data?.skillicon).filter(Boolean);
      return {
        id: cr.id,
        title: cd.title || 'Kombo Skill',
        desc: cd.desc || '',
        skills: skillIcons
      };
    });

    const roles = parseTagArray(heroRaw.sortid);
    const lanes = parseTagArray(heroRaw.roadsort);

    return res.status(200).json({
      ok: true,
      hero: {
        heroId,
        name: heroRaw.name || profileRecord?.hero?.data?.name || `Hero #${heroId}`,
        head: heroRaw.head || profileRecord?.head || '',
        headBig: profileRecord?.head_big || '',
        painting: profileRecord?.painting || '',
        story: heroRaw.story || '',
        difficulty: parseInt(heroRaw.difficulty) || 50,
        recommendLevel: heroRaw.recommendlevellabel || '',
        speciality: heroRaw.speciality || [],
        roles,
        lanes,
        skills
      },
      stats,
      relation,
      combos
    });
  } catch (err) {
    console.error('Error fetching hero detail:', err.message);
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
});

// Vite Middleware for Fullstack Development & Static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MLBB Fullstack App is running on port ${PORT}`);
  });
}

startServer();
