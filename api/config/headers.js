// api/config/headers.js
// Header autentikasi & request ke Moonton API

export const DEFAULT_HEADERS = {
  accept: "application/json, text/plain, */*",
  "accept-language": "id-ID,id;q=0.9,en-ID;q=0.8,en;q=0.7",
  "content-type": "application/json;charset=UTF-8",
  origin: "https://www.mobilelegends.com",
  referer: "https://www.mobilelegends.com/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
  "x-actid": "2669607",
  "x-appid": "2669606",
  "x-lang": "id",
};

// Token authorization resmi Moonton (dapat di-override via env jika berganti)
export const AUTH_TOKENS = {
  HERO_LIST: process.env.MOONTON_AUTH_LIST || "",
  HERO_SYNERGY: process.env.MOONTON_AUTH_SYNERGY || "",
  HERO_PROFILE: process.env.MOONTON_AUTH_PROFILE || "",
  HERO_COMBO: process.env.MOONTON_AUTH_COMBO || "",
};
