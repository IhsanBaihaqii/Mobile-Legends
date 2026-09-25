// api/controllers/heroController.js
// Controller untuk mengambil daftar hero dan detail profil hero

import { ENDPOINTS, ROLE_SORT_MAP } from '../config/endpoints.js';
import { AUTH_TOKENS } from '../config/headers.js';
import { callMoontonApi } from '../services/moontonClient.js';

// GET /api/heroes?role=all|mage|assassin|tank|fighter|marksman|support
export const getHeroList = async (req, res) => {
  const role = req.query.role || 'all';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 21;
  const sortIds = ROLE_SORT_MAP[role] || ROLE_SORT_MAP.all;

  const payload = {
    pageSize,
    pageIndex: page,
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
    const raw = await callMoontonApi(
      ENDPOINTS.HERO_LIST_AND_PROFILE,
      payload,
      AUTH_TOKENS.HERO_LIST
    );

    const records = raw?.data?.records || raw?.data?.list || raw?.records || [];
    return res.status(200).json({
      ok: true,
      role,
      page,
      total: records.length,
      data: records
    });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      ok: false,
      message: err.message,
      detail: err.response?.data
    });
  }
};

// GET /api/hero/:id (Profil lengkap, skillset, ability radar)
export const getHeroProfile = async (req, res) => {
  const heroId = parseInt(req.params.id);
  if (!heroId) {
    return res.status(400).json({ ok: false, message: 'Hero ID diperlukan' });
  }

  const payload = {
    pageSize: 20,
    pageIndex: 1,
    filters: [{ field: 'hero_id', operator: 'eq', value: heroId }],
    sorts: [],
    object: []
  };

  try {
    const raw = await callMoontonApi(
      ENDPOINTS.HERO_LIST_AND_PROFILE,
      payload,
      AUTH_TOKENS.HERO_PROFILE
    );

    const record = raw?.data?.records?.[0] || null;
    return res.status(200).json({
      ok: true,
      heroId,
      data: record
    });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      ok: false,
      message: err.message,
      detail: err.response?.data
    });
  }
};
