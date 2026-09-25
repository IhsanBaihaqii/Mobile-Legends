// api/controllers/synergyController.js
// Controller untuk mengambil data sinergi hero, winrate partner & anti-synergy

import { ENDPOINTS } from '../config/endpoints.js';
import { AUTH_TOKENS } from '../config/headers.js';
import { callMoontonApi } from '../services/moontonClient.js';

// GET /api/hero/:id/synergy
export const getHeroSynergy = async (req, res) => {
  const heroId = parseInt(req.params.id);
  const rank = req.query.rank || 101; // 101 = Mythic+
  const matchType = req.query.matchType || 1; // 1 = Ranked

  if (!heroId) {
    return res.status(400).json({ ok: false, message: 'Hero ID diperlukan' });
  }

  const payload = {
    pageSize: 20,
    pageIndex: 1,
    filters: [
      { field: 'main_heroid', operator: 'eq', value: heroId },
      { field: 'bigrank', operator: 'eq', value: rank },
      { field: 'match_type', operator: 'eq', value: matchType }
    ],
    sorts: []
  };

  try {
    const raw = await callMoontonApi(
      ENDPOINTS.HERO_SYNERGY_AND_STATS,
      payload,
      AUTH_TOKENS.HERO_SYNERGY
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
