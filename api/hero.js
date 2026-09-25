// api/hero.js
// Vercel Serverless Function handler untuk route: /api/hero (list) dan /api/hero?id=xxx (detail)
import axios from "axios";

const MOONTON_BASE_URL = process.env.MOONTON_BASE_URL || "";

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

const ROLE_MAP = {
  all: [1, 2, 3, 4, 5, 6],
  tank: [1],
  fighter: [2],
  assassin: [3],
  mage: [4],
  marksman: [5],
  support: [6],
};

function parseTagArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => x && typeof x === "object" && x.data)
    .map((x) => ({
      id: String(x.data.sort_id ?? x.data.road_sort_id ?? ""),
      title: (x.data.sort_title ?? x.data.road_sort_title ?? "").toLowerCase(),
      rawTitle: x.data.sort_title ?? x.data.road_sort_title ?? "",
      icon: x.data.sort_icon ?? x.data.road_sort_icon ?? "",
    }))
    .filter((x) => x.title);
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  // Kasus 1: Detail Hero (/api/hero/[id] atau /api/hero?id=131)
  if (id) {
    const heroId = parseInt(id);
    if (!heroId) {
      return res.status(400).json({ ok: false, message: "Invalid Hero ID" });
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
              timeout: 15000,
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
              timeout: 15000,
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
              timeout: 15000,
            },
          )
          .catch(() => null),
      ]);

      const profileRecord = profileRes?.data?.data?.records?.[0]?.data || null;
      const heroRaw = profileRecord?.hero?.data || {};

      const rawSkillLists = heroRaw.heroskilllist || [];
      const skills = [];
      rawSkillLists.forEach((sl) => {
        (sl.skilllist || []).forEach((sk) => {
          if (!skills.some((s) => s.id === sk.skillid)) {
            skills.push({
              id: sk.skillid,
              name: sk.skillname,
              icon: sk.skillicon,
              cd: sk["skillcd&cost"] || "",
              desc: sk.skilldesc || "",
              tags: (sk.skilltag || []).map((t) => ({
                id: t.tagid,
                name: t.tagname,
                rgb: t.tagrgb || "245,196,81",
              })),
            });
          }
        });
      });

      const relRaw = profileRecord?.relation || {};
      const relation = {
        assist: {
          desc: relRaw.assist?.desc || "",
          heads: (relRaw.assist?.target_hero || [])
            .map((th) => th.data?.head)
            .filter(Boolean),
          targetHeroIds: relRaw.assist?.target_hero_id || [],
        },
        strong: {
          desc: relRaw.strong?.desc || "",
          heads: (relRaw.strong?.target_hero || [])
            .map((th) => th.data?.head)
            .filter(Boolean),
          targetHeroIds: relRaw.strong?.target_hero_id || [],
        },
        weak: {
          desc: relRaw.weak?.desc || "",
          heads: (relRaw.weak?.target_hero || [])
            .map((th) => th.data?.head)
            .filter(Boolean),
          targetHeroIds: relRaw.weak?.target_hero_id || [],
        },
      };

      const synergyRecord = synergyRes?.data?.data?.records?.[0]?.data || null;
      let stats = null;
      if (synergyRecord) {
        stats = {
          winRate: synergyRecord.main_hero_win_rate || 0,
          pickRate: synergyRecord.main_hero_appearance_rate || 0,
          banRate: synergyRecord.main_hero_ban_rate || 0,
          subHeroes: (synergyRecord.sub_hero || []).map((sh) => ({
            heroid: sh.heroid,
            winRate: sh.hero_win_rate || 0,
            increaseWinRate: sh.increase_win_rate || 0,
            head: sh.hero?.data?.head || "",
          })),
          lastHeroes: (synergyRecord.sub_hero_last || []).map((shl) => ({
            heroid: shl.heroid,
            winRate: shl.hero_win_rate || 0,
            increaseWinRate: shl.increase_win_rate || 0,
          })),
        };
      }

      const comboRecords = comboRes?.data?.data?.records || [];
      const combos = comboRecords.map((cr) => {
        const cd = cr.data || {};
        const skillIcons = (cd.skill_id || [])
          .map((s) => s.data?.skillicon)
          .filter(Boolean);
        return {
          id: cr.id,
          title: cd.title || "Kombo Skill",
          desc: cd.desc || "",
          skills: skillIcons,
        };
      });

      const roles = parseTagArray(heroRaw.sortid);
      const lanes = parseTagArray(heroRaw.roadsort);

      return res.status(200).json({
        ok: true,
        hero: {
          heroId,
          name:
            heroRaw.name ||
            profileRecord?.hero?.data?.name ||
            `Hero #${heroId}`,
          head: heroRaw.head || profileRecord?.head || "",
          headBig: profileRecord?.head_big || "",
          painting: profileRecord?.painting || "",
          story: heroRaw.story || "",
          difficulty: parseInt(heroRaw.difficulty) || 50,
          recommendLevel: heroRaw.recommendlevellabel || "",
          speciality: heroRaw.speciality || [],
          roles,
          lanes,
          skills,
        },
        stats,
        relation,
        combos,
      });
    } catch (err) {
      return res.status(500).json({ ok: false, message: err.message });
    }
  }

  // Kasus 2: List Hero (/api/hero?role=all&page=1&pageSize=21)
  const role = req.query.role || "all";
  const pageIndex = parseInt(req.query.page || req.query.pageIndex) || 1;
  const pageSize = parseInt(req.query.pageSize) || 21;
  const sortIds = ROLE_MAP[role] || ROLE_MAP.all;

  const payload = {
    pageSize,
    pageIndex,
    filters: [
      {
        field: "<hero.data.sortid>",
        operator: "hasAnyOf",
        value: sortIds.map(String),
      },
      {
        field: "<hero.data.roadsort>",
        operator: "hasAnyOf",
        value: [1, 2, 3, 4, 5],
      },
    ],
    sorts: [{ data: { field: "hero_id", order: "desc" }, type: "sequence" }],
    fields: [
      "id",
      "hero_id",
      "hero.data.name",
      "hero.data.smallmap",
      "hero.data.sortid",
      "hero.data.roadsort",
    ],
    object: [],
  };

  try {
    const moontonRes = await axios.post(
      `${MOONTON_BASE_URL}/2756564`,
      payload,
      {
        headers: {
          ...COMMON_HEADERS,
          authorization:
            process.env.MOONTON_AUTH_LIST || "CciHBEvFRqQNHGj2djxdUSja7W4=",
        },
        timeout: 15000,
      },
    );

    const data = moontonRes.data;
    const items =
      data?.data?.records || data?.data?.list || data?.records || [];

    return res.status(200).json({
      ok: true,
      role,
      pageIndex,
      pageSize,
      total: items.length,
      data: items,
    });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      ok: false,
      message: err.message,
      detail: err.response?.data,
    });
  }
}
