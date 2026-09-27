// api/ai.js
// Vercel Serverless Function & Backend Logic: /api/ai?id=133&text=siapa+kamu atau /api/ai/133?text=...
import axios from "axios";

const MOONTON_BASE_URL =
  process.env.MOONTON_BASE_URL ||
  "https://api.gms.moontontech.com/api/gms/source/2669606";

const AI_BASE_URL = process.env.AI_BASE_URL || "";

const COMMON_HEADERS = {
  accept: "application/json, text/plain, */*",
  "accept-language": "id-ID,id;q=0.9,en-ID;q=0.8,en;q=0.7,en-US;q=0.6",
  "content-type": "application/json;charset=UTF-8",
  origin: "https://www.mobilelegends.com",
  referer: "https://www.mobilelegends.com/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
  "x-actid": "2669607",
  "x-appid": "2669606",
  "x-lang": "id",
};

// Cache sederhana di memory agar fetch data hero yang sama instan
const heroCache = new Map();

async function fetchHeroInfo(heroId) {
  if (heroCache.has(heroId)) {
    return heroCache.get(heroId);
  }

  try {
    const [profileRes, synergyRes, comboRes] = await Promise.all([
      axios
        .post(
          `${MOONTON_BASE_URL}/2756564`,
          {
            pageSize: 20,
            pageIndex: 1,
            filters: [{ field: "hero_id", operator: "eq", value: heroId }],
            sorts: [],
            object: [],
          },
          {
            headers: {
              ...COMMON_HEADERS,
              authorization:
                process.env.MOONTON_AUTH_PROFILE ||
                "0Pw0gKbo/cQkI2akbf+t36hMrZ8=",
            },
            timeout: 10000,
          },
        )
        .catch(() => null),

      axios
        .post(
          `${MOONTON_BASE_URL}/2756567`,
          {
            pageSize: 20,
            pageIndex: 1,
            filters: [
              { field: "main_heroid", operator: "eq", value: heroId },
              { field: "bigrank", operator: "eq", value: 101 },
              { field: "match_type", operator: "eq", value: 1 },
            ],
            sorts: [],
          },
          {
            headers: {
              ...COMMON_HEADERS,
              authorization:
                process.env.MOONTON_AUTH_SYNERGY ||
                "oPxQMyLOfV+6t1xKEYWuy5VkDC0=",
            },
            timeout: 10000,
          },
        )
        .catch(() => null),

      axios
        .post(
          `${MOONTON_BASE_URL}/2674711`,
          {
            pageSize: 20,
            pageIndex: 1,
            filters: [{ field: "hero_id", operator: "eq", value: heroId }],
            sorts: [],
            object: [2684183],
          },
          {
            headers: {
              ...COMMON_HEADERS,
              authorization:
                process.env.MOONTON_AUTH_COMBO ||
                "ry+hQ0nOVtWLe76W8Jl51U+Pq24=",
            },
            timeout: 10000,
          },
        )
        .catch(() => null),
    ]);

    const profileRecord = profileRes?.data?.data?.records?.[0]?.data || null;
    const heroRaw = profileRecord?.hero?.data || {};

    const rawSkills = [];
    (heroRaw.heroskilllist || []).forEach((sl) => {
      (sl.skilllist || []).forEach((sk) => {
        if (!rawSkills.some((s) => s.id === sk.skillid)) {
          rawSkills.push({
            id: sk.skillid,
            name: sk.skillname,
            icon: sk.skillicon,
            cd: sk["skillcd&cost"] || "",
            desc: sk.skilldesc
              ? sk.skilldesc.replace(/<[^>]+>/g, "").slice(0, 100)
              : "",
          });
        }
      });
    });

    const roles = (heroRaw.sortid || [])
      .map((x) => x?.data?.sort_title)
      .filter(Boolean)
      .join(", ");

    const lanes = (heroRaw.roadsort || [])
      .map((x) => x?.data?.road_sort_title)
      .filter(Boolean)
      .join(", ");

    const synergyRecord = synergyRes?.data?.data?.records?.[0]?.data || null;
    const stats = synergyRecord
      ? {
          winRate:
            (Number(synergyRecord.main_hero_win_rate || 0) * 100).toFixed(2) +
            "%",
          pickRate:
            (
              Number(synergyRecord.main_hero_appearance_rate || 0) * 100
            ).toFixed(2) + "%",
          banRate:
            (Number(synergyRecord.main_hero_ban_rate || 0) * 100).toFixed(2) +
            "%",
        }
      : null;

    const combos = (comboRes?.data?.data?.records || [])
      .slice(0, 2)
      .map((cr) => ({
        title: cr.data?.title || "Kombo Hero",
        desc: cr.data?.desc ? cr.data.desc.slice(0, 100) : "",
      }));

    const result = {
      heroId,
      name:
        heroRaw.name || profileRecord?.hero?.data?.name || `Hero #${heroId}`,
      roles: roles || "Fighter/Mage",
      lanes: lanes || "Lane",
      story: heroRaw.story ? heroRaw.story.slice(0, 180) + "..." : "",
      skills: rawSkills.slice(0, 4),
      stats,
      combos,
      dataProfile: profileRecord,
      dataCombos: comboRes?.data?.data,
      dataSynergy: synergyRes?.data?.data,
    };

    heroCache.set(heroId, result);
    return result;
  } catch (err) {
    console.error("Error fetching hero info for AI:", err.message);
    return {
      heroId,
      name: `Hero #${heroId}`,
      roles: "-",
      lanes: "-",
      skills: [],
      stats: null,
      combos: [],
    };
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Ambil query param: id hero dan text
  const heroId = parseInt(req.query.id);
  const text = req.query.text || req.query.q || req.query.message || "";

  if (!text) {
    return res.status(400).json({
      status: false,
      message:
        'Parameter "text" diperlukan (contoh: /api/ai?id=133&text=siapa+kamu)',
    });
  }

  // 1. Shortcut instan untuk command /test, /nama, /id
  const lowerText = text.trim().toLowerCase();
  if (heroId) {
    const hero = await fetchHeroInfo(heroId);

    if (lowerText === "/test") {
      return res.status(200).json({
        status: true,
        heroId,
        heroName: hero.name,
        msg: `Nama hero: ${hero.name}`,
        visualType: "none",
        visualData: null,
      });
    }

    if (lowerText === "/nama") {
      return res.status(200).json({
        status: true,
        heroId,
        heroName: hero.name,
        msg: `${hero.name}`,
        visualType: "none",
        visualData: null,
      });
    }

    if (lowerText === "/id") {
      return res.status(200).json({
        status: true,
        heroId,
        heroName: hero.name,
        msg: `Hero ID: #${heroId}`,
        visualType: "none",
        visualData: null,
      });
    }

    // 2. Susun Prompt Sistem + Data Hero + Aturan JSON Balasan
    const systemPrompt = `Kamu adalah ${hero.name} dari Mobile Legends: Bang Bang (MLBB).
Jawab pertanyaan user sebagai karakter hero ini atau analis hero ini secara ramah, ringkas dan informatif.
DATA HERO: ${JSON.stringify(hero)}

PENTING - ATURAN FORMAT OUTPUT:
Balas HANYA dengan 1 objek JSON valid tanpa markdown, tanpa backticks (\`\`\`json), dan tanpa teks pembuka/penutup.
Format JSON:
{
  "msg": "isi jawaban utama kamu secara ramah, ringkas dan informatif",
  "visualType": "none | stats | skills | combo",
  "visualData": {
    "winRate": "${hero.stats?.winRate || "50%"}",
    "pickRate": "${hero.stats?.pickRate || "1%"}",
    "banRate": "${hero.stats?.banRate || "2%"}",
    "skills": ["skill 1", "skill 2"],
    "comboTitle": "judul kombo",
    "comboSteps": ["skill 1", "skill 2", "ult"]
  }
}
Catatan visualType:
- Gunakan "stats" jika user menanyakan winrate, banrate, pickrate, performa.
- Gunakan "skills" jika user menanyakan skill, jurus, pasif.
- Gunakan "combo" jika user menanyakan kombo skill atau trik serangan.
- Gunakan "none" untuk obrolan umum, salam, atau lainnya.`;

    const fullPrompt = `${systemPrompt}\nUser: ${text}\nOutput JSON:`;
    const aiApiUrl = `${AI_BASE_URL}/gpt-3.5-turbo?text=${encodeURIComponent(fullPrompt)}`;

    try {
      const aiRes = await axios.get(aiApiUrl, { timeout: 15000 });
      const rawText =
        aiRes.data?.result ||
        aiRes.data?.data ||
        (typeof aiRes.data === "string" ? aiRes.data : "");

      // Parse JSON
      let clean = (rawText || "")
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const firstBrace = clean.indexOf("{");
      const lastBrace = clean.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }

      let parsed = null;
      try {
        parsed = JSON.parse(clean);
      } catch {
        parsed = null;
      }

      if (parsed) {
        return res.status(200).json({
          status: true,
          heroId,
          heroName: hero.name,
          msg: parsed.msg || parsed.message || parsed.text || rawText,
          visualType: parsed.visualType || "none",
          visualData: parsed.visualData || null,
        });
      }

      // Jika AI membalas teks biasa
      return res.status(200).json({
        status: true,
        heroId,
        heroName: hero.name,
        msg: rawText || `Halo! Saya adalah ${hero.name}.`,
        visualType: "none",
        visualData: null,
      });
    } catch (err) {
      console.warn("AI API upstream error:", err.message);
      // Fallback response jika external API error
      return res.status(200).json({
        status: true,
        heroId,
        heroName: hero.name,
        msg: `Halo! Saya adalah ${hero.name}, hero ${hero.roles} yang bertarung di ${hero.lanes}. ID saya adalah #${hero.heroId}.`,
        visualType: lowerText.includes("winrate") ? "stats" : "none",
        visualData: hero.stats || null,
      });
    }
  }

  // Jika tanpa ID hero (general MLBB chat)
  const generalPrompt = `Kamu adalah asisten ahli Mobile Legends: Bang Bang (MLBB).\nUser: ${text}\nBalas dengan ramah dan ringkas.`;
  try {
    const aiRes = await axios.get(
      `${AI_BASE_URL}/gpt-3.5-turbo?text=${encodeURIComponent(generalPrompt)}`,
      { timeout: 15000 },
    );
    const resultText =
      aiRes.data?.result || "Halo! Saya siap membantu seputar MLBB.";
    return res.status(200).json({
      status: true,
      msg: resultText,
      visualType: "none",
      visualData: null,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
}
export { fetchHeroInfo };
