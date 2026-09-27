// src/services/aiChatService.js
// Service untuk memanggil endpoint backend /api/ai?id=xxx&text=... atau /api/ai/:id?text=...

export const aiChatService = {
  /**
   * Panggil API backend kita /api/ai/:id?text=...
   * Backend yang akan menyusun prompt + data hero + memanggil AI eksternal + memparsing JSON
   */
  async askHeroAI({ userQuestion, hero }) {
    const heroId = hero?.heroId;
    const url = `/api/ai/${heroId}?text=${encodeURIComponent(userQuestion)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`AI API status: ${response.status}`);
      }

      const data = await response.json();
      return {
        msg: data.msg || `Halo! Saya adalah ${hero?.name || "hero ini"}.`,
        visualType: data.visualType || "none",
        visualData: data.visualData || null,
      };
    } catch (err) {
      console.warn("Gagal memanggil /api/ai:", err.message);
      return this.generateFallbackResponse(userQuestion, hero);
    }
  },

  /**
   * Fallback cerdas jika koneksi internet terputus
   */
  generateFallbackResponse(userQuestion, hero) {
    const q = userQuestion.toLowerCase().trim();

    if (
      q === "/test" ||
      q === "/nama" ||
      q.includes("siapa kamu") ||
      q.includes("hero apa")
    ) {
      return {
        msg: `Halo! Saya adalah ${hero?.name || "Hero MLBB"}.`,
        visualType: "none",
        visualData: null,
      };
    }

    if (q === "/id") {
      return {
        msg: `Hero ID: #${hero?.heroId || "-"}`,
        visualType: "none",
        visualData: null,
      };
    }

    return {
      msg: `Saya adalah ${hero?.name || "hero ini"} (#${hero?.heroId || "-"}). Ada yang ingin kamu tanyakan mengenai skill, winrate, atau kombo saya?`,
      visualType: "none",
      visualData: null,
    };
  },
};
