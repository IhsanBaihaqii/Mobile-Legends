// api/controllers/comboController.js
// Controller untuk mengambil panduan kombo skill hero & trik laning

import { ENDPOINTS } from '../config/endpoints.js';
import { AUTH_TOKENS } from '../config/headers.js';
import { callMoontonApi } from '../services/moontonClient.js';

// GET /api/hero/:id/combos
export const getHeroCombos = async (req, res) => {
  const heroId = parseInt(req.params.id);
  if (!heroId) {
    return res.status(400).json({ ok: false, message: 'Hero ID diperlukan' });
  }

  const payload = {
    pageSize: 20,
    pageIndex: 1,
    filters: [{ field: 'hero_id', operator: 'eq', value: heroId }],
    sorts: [],
    object: [2684183]
  };

  try {
    const raw = await callMoontonApi(
      ENDPOINTS.HERO_COMBOS_AND_GUIDES,
      payload,
      AUTH_TOKENS.HERO_COMBO
    );

    const records = raw?.data?.records || [];
    return res.status(200).json({
      ok: true,
      heroId,
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
