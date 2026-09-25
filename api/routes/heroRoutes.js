// api/routes/heroRoutes.js
// Definisi routing Express untuk API hero MLBB

import express from 'express';
import { getHeroList, getHeroProfile } from '../controllers/heroController.js';
import { getHeroSynergy } from '../controllers/synergyController.js';
import { getHeroCombos } from '../controllers/comboController.js';

const router = express.Router();

// 1. Ambil daftar semua hero / filter role
router.get('/heroes', getHeroList);

// 2. Ambil profil lengkap, skill, dan relasi hero berdasarkan heroId
router.get('/hero/:id', getHeroProfile);

// 3. Ambil statistik sinergi pasangan terbaik & terburuk
router.get('/hero/:id/synergy', getHeroSynergy);

// 4. Ambil rekomendasi kombo skill & taktik teamfight
router.get('/hero/:id/combos', getHeroCombos);

export default router;
