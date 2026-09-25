// api/server.js
// Server standalone Express untuk API Backend Scraper MLBB

import express from 'express';
import heroRoutes from './routes/heroRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS Header sederhana untuk akses frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Daftarkan route API
app.use('/api', heroRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    name: 'MLBB GMS Moonton Scraper API',
    endpoints: [
      'GET /api/heroes?role=all|mage|assassin|tank|fighter|marksman|support',
      'GET /api/hero/:id',
      'GET /api/hero/:id/synergy',
      'GET /api/hero/:id/combos'
    ]
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`MLBB Scraper API server running on port ${PORT}`);
  });
}

export default app;
