// src/services/aiChatService.js

export const aiChatService = {
  /**
   * Eksekusi request AI dengan prompt terstruktur & parsing response JSON
   */
  async askHeroAI({ userQuestion, hero, stats, combos }) {
    // 1. Ekstrak data ringkas hero agar tidak melebihi batas URL query
    const heroInfo = {
      id: hero?.heroId,
      name: hero?.name,
      roles: hero?.roles?.map((r) => r.rawTitle || r.title).join(", ") || "-",
      lanes: hero?.lanes?.map((l) => l.rawTitle || l.title).join(", ") || "-",
      story: hero?.story ? hero.story.slice(0, 180) + "..." : "-",
      difficulty: hero?.difficulty,
      recommendLevel: hero?.recommendLevel,
      skills: (hero?.skills || []).slice(0, 4).map((s) => ({
        id: s.id,
        name: s.name,
        cd: s.cd,
        desc: s.desc ? s.desc.replace(/<[^>]+>/g, "").slice(0, 100) : "",
      })),
      stats: stats
        ? {
            winRate: (stats.winRate * 100).toFixed(2) + "%",
            pickRate: (stats.pickRate * 100).toFixed(2) + "%",
            banRate: (stats.banRate * 100).toFixed(2) + "%",
          }
        : null,
      combos: (combos || []).slice(0, 2).map((c) => ({
        title: c.title,
        desc: c.desc ? c.desc.slice(0, 100) : "",
      })),
    };

    // 2. Susun system prompt instruksi strictly JSON
    const systemPrompt = `Kamu adalah ${hero?.name || "Hero"} dari game Mobile Legends: Bang Bang (MLBB).
Jawab pertanyaan user sebagai karakter hero ini atau analis hero ini.
DATA HERO: ${JSON.stringify(heroInfo)}

PENTING - ATURAN FORMAT OUTPUT:
Balas HANYA dengan 1 objek JSON valid tanpa markdown, tanpa backticks (\`\`\`json), dan tanpa teks pembuka/penutup.
Format JSON yang diwajibkan:
{
  "msg": "isi jawaban utama kamu secara ramah, ringkas dan informatif",
  "visualType": "none | stats | skills | combo",
  "visualData": {
    "winRate": "${heroInfo.stats?.winRate || "50%"}",
    "pickRate": "${heroInfo.stats?.pickRate || "1%"}",
    "banRate": "${heroInfo.stats?.banRate || "2%"}",
    "skills": ["nama skill 1", "nama skill 2"],
    "comboTitle": "judul kombo",
    "comboSteps": ["skill 1", "skill 2", "ult"]
  }
}
Catatan visualType:
- Gunakan "stats" jika user menanyakan winrate, banrate, pickrate, atau performa.
- Gunakan "skills" jika user menanyakan tentang skill, jurus, atau pasif.
- Gunakan "combo" jika user menanyakan cara kombo skill atau trik serangan.
- Gunakan "none" untuk obrolan umum, cerita, salam, atau lainnya.`;

    const fullPrompt = `${systemPrompt}\nUser: ${userQuestion}\nOutput JSON:`;

    const AI_BASE_URL = process.env.AI_BASE_URL || "";

    const apiUrl = `${AI_BASE_URL}/gpt-3.5-turbo?text=${encodeURIComponent(fullPrompt)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`AI API status: ${response.status}`);
      }

      const json = await response.json();
      const rawText =
        json?.result || json?.data || (typeof json === "string" ? json : "");

      return this.parseAIResponse(rawText, userQuestion, heroInfo);
    } catch (err) {
      console.warn(
        "Gagal memanggil API AI luar, beralih ke fallback cerdas:",
        err.message,
      );
      return this.generateFallbackResponse(userQuestion, heroInfo);
    }
  },

  /**
   * Membersihkan output AI dari backticks, markdown, atau teks sisa dan memvalidasi JSON
   */
  parseAIResponse(rawText, userQuestion, heroInfo) {
    if (!rawText) {
      return this.generateFallbackResponse(userQuestion, heroInfo);
    }

    try {
      // 1. Bersihkan markdown ```json ... ``` atau ``` ... ```
      let clean = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // 2. Ekstrak hanya substring antara { dan }
      const firstBrace = clean.indexOf("{");
      const lastBrace = clean.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(clean);

      return {
        msg: parsed.msg || parsed.message || parsed.text || rawText,
        visualType: parsed.visualType || "none",
        visualData: parsed.visualData || null,
      };
    } catch (parseError) {
      // Jika AI membalas teks biasa dan bukan JSON, buat objek JSON standar
      return {
        msg: rawText.replace(/```/g, "").trim(),
        visualType: this.detectVisualTypeFromText(userQuestion),
        visualData: null,
      };
    }
  },

  /**
   * Deteksi otomatis jenis visual berdasarkan teks pertanyaan
   */
  detectVisualTypeFromText(text) {
    const t = text.toLowerCase();
    if (
      t.includes("winrate") ||
      t.includes("ban") ||
      t.includes("pick") ||
      t.includes("stat")
    ) {
      return "stats";
    }
    if (
      t.includes("skill") ||
      t.includes("jurus") ||
      t.includes("pasif") ||
      t.includes("ulti")
    ) {
      return "skills";
    }
    if (t.includes("kombo") || t.includes("combo") || t.includes("urutan")) {
      return "combo";
    }
    return "none";
  },

  /**
   * Fallback cerdas jika koneksi AI gagal / offline / timeout
   */
  generateFallbackResponse(userQuestion, heroInfo) {
    const q = userQuestion.toLowerCase().trim();

    if (
      q === "/test" ||
      q === "/nama" ||
      q.includes("siapa namamu") ||
      q.includes("kamu hero apa")
    ) {
      return {
        msg: `Halo! Saya adalah ${heroInfo.name}, hero ${heroInfo.roles} yang bertarung di ${heroInfo.lanes}.`,
        visualType: "none",
        visualData: null,
      };
    }

    if (q === "/id" || q.includes("id hero")) {
      return {
        msg: `ID resmi hero ${heroInfo.name} di Moonton adalah #${heroInfo.id}.`,
        visualType: "none",
        visualData: null,
      };
    }

    if (q.includes("winrate") || q.includes("stat") || q.includes("rate")) {
      return {
        msg: `Berikut adalah data statistik kemenangan dan popularitas saya di ranked match saat ini:`,
        visualType: "stats",
        visualData: {
          winRate: heroInfo.stats?.winRate || "50.0%",
          pickRate: heroInfo.stats?.pickRate || "1.2%",
          banRate: heroInfo.stats?.banRate || "2.5%",
        },
      };
    }

    if (q.includes("skill") || q.includes("jurus")) {
      return {
        msg: `Saya memiliki skillset lengkap untuk mendominasi pertarungan. Ini daftar keahlian utama saya:`,
        visualType: "skills",
        visualData: {
          skills: heroInfo.skills?.map((s) => s.name) || [],
        },
      };
    }

    if (q.includes("kombo") || q.includes("combo")) {
      return {
        msg: `Untuk eksekusi serangan mematikan, berikut rekomendasi kombo skill saya:`,
        visualType: "combo",
        visualData: {
          comboTitle: heroInfo.combos?.[0]?.title || "Kombo Team Fight",
          comboSteps: ["Skill 2 (Buka)", "Ultimate", "Skill 1", "Basic Attack"],
        },
      };
    }

    return {
      msg: `Saya siap membantumu seputar hero ${heroInfo.name}. Kamu bisa menanyakan tentang skill, rekomendasi kombo, winrate, atau cerita latar belakang saya!`,
      visualType: "none",
      visualData: null,
    };
  },
};
