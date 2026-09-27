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

    // 1. Ekstrak data Skill lengkap dengan Icon
    const rawSkills = [];
    (heroRaw.heroskilllist || []).forEach((sl) => {
      (sl.skilllist || []).forEach((sk) => {
        if (!rawSkills.some((s) => s.id === sk.skillid)) {
          rawSkills.push({
            id: sk.skillid,
            name: sk.skillname || "",
            icon: sk.skillicon || "",
            cd: sk["skillcd&cost"] || "",
            desc: sk.skilldesc
              ? sk.skilldesc
                  .replace(/<[^>]+>/g, "")
                  .trim()
                  .slice(0, 160)
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

    // 2. Ekstrak Rekan Sinergi Terbaik & Duet Sinergi (Stats)
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
          topDuetHeroes: (synergyRecord.sub_hero || [])
            .slice(0, 5)
            .map((sh) => ({
              heroid: sh.heroid,
              winRate: (Number(sh.hero_win_rate || 0) * 100).toFixed(2) + "%",
              increaseWinRate:
                "+" +
                (Number(sh.increase_win_rate || 0) * 100).toFixed(2) +
                "%",
              head: sh.hero?.data?.head || "",
            })),
        }
      : null;

    // 3. Ekstrak Relasi Matchup Resmi (Rekan Sinergi, Kuat Melawan, Lemah Melawan) dengan foto hero
    const relRaw = profileRecord?.relation || {};
    const relation = {
      assist: {
        title: "Rekan Sinergi Terbaik",
        desc: relRaw.assist?.desc || "",
        heroes: (relRaw.assist?.target_hero || []).map((th) => ({
          name: th.data?.name || "",
          head: th.data?.head || "",
        })),
      },
      strong: {
        title: "Kuat Melawan (Hero Di-counter)",
        desc: relRaw.strong?.desc || "",
        heroes: (relRaw.strong?.target_hero || []).map((th) => ({
          name: th.data?.name || "",
          head: th.data?.head || "",
        })),
      },
      weak: {
        title: "Lemah Melawan (Counter Hero Ini)",
        desc: relRaw.weak?.desc || "",
        heroes: (relRaw.weak?.target_hero || []).map((th) => ({
          name: th.data?.name || "",
          head: th.data?.head || "",
        })),
      },
    };

    // 4. Ekstrak Rekomendasi Kombo Lengkap (Kombo Team Fight, Kombo Laning, dsb.) dengan icon setiap langkah
    const combos = (comboRes?.data?.data?.records || []).map((cr) => {
      const cd = cr.data || {};
      const skillIcons = (cd.skill_id || [])
        .map((s) => s.data?.skillicon)
        .filter(Boolean);
      return {
        id: cr.id,
        title: cd.title || "Kombo Skill",
        desc: cd.desc || "",
        skillIcons: skillIcons,
      };
    });

    const result = {
      heroId,
      name:
        heroRaw.name || profileRecord?.hero?.data?.name || `Hero #${heroId}`,
      head: heroRaw.head || profileRecord?.head || "",
      roles: roles || "Fighter/Mage",
      lanes: lanes || "Lane",
      story: heroRaw.story ? heroRaw.story.slice(0, 180) + "..." : "",
      skills: rawSkills,
      stats,
      relation,
      combos,
    };

    heroCache.set(heroId, result);
    return result;
  } catch (err) {
    console.error("Error fetching hero info for AI:", err.message);
    return {
      heroId,
      name: `Hero #${heroId}`,
      head: "",
      roles: "-",
      lanes: "-",
      skills: [],
      stats: null,
      relation: null,
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

  const lowerText = text.trim().toLowerCase();

  if (heroId) {
    const hero = await fetchHeroInfo(heroId);

    // Shortcut instan untuk command /test, /nama, /id
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

    // Deteksi intent pengguna untuk menyediakan visualisasi dan konteks yang akurat
    const isComboQuery =
      lowerText.includes("kombo") ||
      lowerText.includes("combo") ||
      lowerText.includes("team fight") ||
      lowerText.includes("laning") ||
      lowerText.includes("urutan skill");

    const isSynergyQuery =
      lowerText.includes("sinergi") ||
      lowerText.includes("rekan") ||
      lowerText.includes("duet") ||
      lowerText.includes("cocok dengan");

    const isStrongCounterQuery =
      lowerText.includes("kuat melawan") ||
      lowerText.includes("counter hero") ||
      lowerText.includes("mengcounter");

    const isWeakCounterQuery =
      lowerText.includes("lemah melawan") ||
      lowerText.includes("di counter") ||
      lowerText.includes("dicounter");

    const isStatsQuery =
      lowerText.includes("winrate") ||
      lowerText.includes("ban rate") ||
      lowerText.includes("pick rate") ||
      lowerText.includes("stat");

    const isSkillQuery =
      lowerText.includes("skill") ||
      lowerText.includes("jurus") ||
      lowerText.includes("pasif") ||
      lowerText.includes("ulti");

    // Susun Prompt Sistem dengan DATA LENGKAP Hero (Kombo dengan gambar, Relasi Counter dengan gambar, Stats Sinergi)
    const systemPrompt = `Kamu adalah ${hero.name} dari Mobile Legends: Bang Bang (MLBB).
Jawab pertanyaan user sebagai karakter hero ini dengan ramah, jelas dan akurat berdasarkan data resmi berikut:

DATA HERO RESMI:
Nama: ${hero.name} (#${hero.heroId})
Role: ${hero.roles}, Lane: ${hero.lanes}
Skill: ${JSON.stringify(hero.skills.map((s) => ({ name: s.name, cd: s.cd, desc: s.desc })))}
Statistik Ranked: Win Rate: ${hero.stats?.winRate || "50%"}, Pick: ${hero.stats?.pickRate || "1%"}, Ban: ${hero.stats?.banRate || "2%"}
Rekan Sinergi Terbaik: "${hero.relation?.assist?.desc || ""}"
Kuat Melawan (Hero Di-counter): "${hero.relation?.strong?.desc || ""}"
Lemah Melawan (Counter Hero Ini): "${hero.relation?.weak?.desc || ""}"
Rekomendasi Kombo Resmi:
${hero.combos.map((c, i) => `${i + 1}. ${c.title}: ${c.desc}`).join("\n")}

ATURAN FORMAT OUTPUT:
Balas HANYA dengan 1 objek JSON valid tanpa markdown dan tanpa tanda kutip tiga (\`\`\`json).
Format JSON:
{
  "msg": "penjelasan lengkap yang kamu sampaikan ke user mengenai pertanyaan mereka",
  "visualType": "${
    isComboQuery
      ? "combo"
      : isSynergyQuery
        ? "synergy"
        : isStrongCounterQuery
          ? "strong"
          : isWeakCounterQuery
            ? "weak"
            : isStatsQuery
              ? "stats"
              : isSkillQuery
                ? "skills"
                : "none"
  }",
  "visualData": null
}`;

    const fullPrompt = `${systemPrompt}\nUser: ${text}\nOutput JSON:`;
    const aiApiUrl = `${AI_BASE_URL}/gpt-3.5-turbo?text=${encodeURIComponent(fullPrompt)}`;

    let responseMsg = "";
    let visualType = "none";

    try {
      const aiRes = await axios.get(aiApiUrl, { timeout: 15000 });
      const rawText =
        aiRes.data?.result ||
        aiRes.data?.data ||
        (typeof aiRes.data === "string" ? aiRes.data : "");

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
        responseMsg = parsed.msg || parsed.message || parsed.text || rawText;
        visualType = parsed.visualType || "none";
      } else {
        responseMsg = rawText;
      }
    } catch (err) {
      console.warn("AI API upstream error:", err.message);
      // Fallback pesan ramah berdasarkan data
      if (isComboQuery && hero.combos.length > 0) {
        responseMsg = `Berikut adalah rekomendasi kombo skill resmi saya:\n\n${hero.combos
          .map((c) => `• ${c.title.toUpperCase()}\n${c.desc}`)
          .join("\n\n")}`;
      } else if (isSynergyQuery && hero.relation?.assist?.desc) {
        responseMsg = `Rekan Sinergi Terbaik saya:\n${hero.relation.assist.desc}`;
      } else if (isStrongCounterQuery && hero.relation?.strong?.desc) {
        responseMsg = `Saya sangat kuat saat melawan:\n${hero.relation.strong.desc}`;
      } else if (isWeakCounterQuery && hero.relation?.weak?.desc) {
        responseMsg = `Hati-hati, saya cenderung lemah saat berhadapan dengan:\n${hero.relation.weak.desc}`;
      } else {
        responseMsg = `Halo! Saya adalah ${hero.name}, hero ${hero.roles} di ${hero.lanes}.`;
      }
    }

    // Tentukan visualType final jika model AI mengembalikan 'none' tetapi user jelas menanyakan fitur visual
    if (visualType === "none") {
      if (isComboQuery && hero.combos.length > 0) visualType = "combo";
      else if (isSynergyQuery) visualType = "synergy";
      else if (isStrongCounterQuery) visualType = "strong";
      else if (isWeakCounterQuery) visualType = "weak";
      else if (isStatsQuery) visualType = "stats";
      else if (isSkillQuery) visualType = "skills";
    }

    // Bangun visualData kaya gambar dari data resmi Moonton
    let visualData = null;

    if (visualType === "combo" && hero.combos.length > 0) {
      visualData = {
        combos: hero.combos.map((c) => ({
          title: c.title,
          desc: c.desc,
          skillIcons: c.skillIcons,
        })),
      };
    } else if (visualType === "synergy") {
      visualData = {
        title: hero.relation?.assist?.title || "Rekan Sinergi Terbaik",
        desc: hero.relation?.assist?.desc || "",
        heroes: hero.relation?.assist?.heroes || [],
        duetStats: hero.stats?.topDuetHeroes || [],
      };
    } else if (visualType === "strong") {
      visualData = {
        title: hero.relation?.strong?.title || "Kuat Melawan (Hero Di-counter)",
        desc: hero.relation?.strong?.desc || "",
        heroes: hero.relation?.strong?.heroes || [],
      };
    } else if (visualType === "weak") {
      visualData = {
        title: hero.relation?.weak?.title || "Lemah Melawan (Counter Hero Ini)",
        desc: hero.relation?.weak?.desc || "",
        heroes: hero.relation?.weak?.heroes || [],
      };
    } else if (visualType === "stats") {
      visualData = {
        winRate: hero.stats?.winRate || "50.0%",
        pickRate: hero.stats?.pickRate || "1.0%",
        banRate: hero.stats?.banRate || "2.0%",
      };
    } else if (visualType === "skills") {
      visualData = {
        skills: hero.skills.map((s) => ({
          name: s.name,
          icon: s.icon,
          cd: s.cd,
          desc: s.desc,
        })),
      };
    }

    return res.status(200).json({
      status: true,
      heroId,
      heroName: hero.name,
      msg: responseMsg,
      visualType,
      visualData,
    });
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
