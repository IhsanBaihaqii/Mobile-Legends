// src/data/heroDetails.js
// Data detail mendalam hero (Skillset Thunder/Torrent, Synergy API, & Kombo API)

export const HERO_DETAILS = {
  131: {
    hero_id: 131,
    name: 'Sora',
    title: 'The Skyward Blade',
    painting: 'https://akmweb.youngjoygame.com/web/gms/image/bc8375c54a43cc02fedcc304033c23bb.webp',
    head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_8143d7bbd4318d7c699908e808de885e.png',
    story: 'Seorang pemuda polos yang berjiwa bebas dan bertekad baja, menjelajah hamparan pasir keemasan yang luas demi menemukan rahasia warisan leluhurnya.',
    difficulty: 50,
    abilityshow: [60, 60, 50, 50], // Durability, Offense, Skill Effects, Difficulty
    abilityLabels: ['Durability', 'Offense', 'Skill Effect', 'Difficulty'],
    recommendlevel: ['3', '1', '2'],
    recommendlevellabel: '3 - 1 - 2 (Prioritaskan Skill 3 > 1 > 2)',
    sortlabel: ['Fighter', 'Assassin'],
    roadsortlabel: ['EXP Lane'],
    speciality: ['Charge', 'Burst'],

    // API 1: Stats & Synergy (Source 2756567)
    stats: {
      winRate: 0.494823, // 49.48%
      appearanceRate: 0.005461, // 0.55%
      banRate: 0.027531, // 2.75%
      matchType: 'Ranked Match',
      bigRank: 'Mythic+'
    },
    synergies: [
      {
        heroid: 108,
        name: 'Arlott',
        head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_1366d775809e52ee6526b5b58d93cdff.png',
        hero_win_rate: 0.575538,
        increase_win_rate: 0.02737,
        hero_appearance_rate: 0.006601,
        bestTime: '8-10 Min (68.5% WR)'
      },
      {
        heroid: 76,
        name: 'Faramis',
        head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_04e575d648d7f7ac1174f4369595c3a2.png',
        hero_win_rate: 0.518042,
        increase_win_rate: 0.022039,
        hero_appearance_rate: 0.000768,
        bestTime: '8-10 Min (58.1% WR)'
      },
      {
        heroid: 11,
        name: 'Bane',
        head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_7e4e74bb161da0f477cc0d1819fa39e6.png',
        hero_win_rate: 0.510698,
        increase_win_rate: 0.020836,
        hero_appearance_rate: 0.002575,
        bestTime: '8-10 Min (69.0% WR)'
      },
      {
        heroid: 48,
        name: 'Diggie',
        head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_b1bdf46136cb8a7903dae6d58e8349cb.png',
        hero_win_rate: 0.539118,
        increase_win_rate: 0.017785,
        hero_appearance_rate: 0.001858,
        bestTime: '6-8 Min (66.7% WR)'
      },
      {
        heroid: 116,
        name: 'Julian',
        head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_5511ddc0ad2789b525f32ef572b017eb.png',
        hero_win_rate: 0.501276,
        increase_win_rate: 0.016117,
        hero_appearance_rate: 0.007297,
        bestTime: '6-8 Min (65.9% WR)'
      }
    ],
    antiSynergies: [
      {
        heroid: 64,
        name: 'Claude',
        increase_win_rate: -0.095423,
        hero_win_rate: 0.508923
      },
      {
        heroid: 74,
        name: 'Granger',
        increase_win_rate: -0.051633,
        hero_win_rate: 0.508476
      },
      {
        heroid: 29,
        name: 'Hayabusa',
        increase_win_rate: -0.049653,
        hero_win_rate: 0.494605
      }
    ],

    // Counter & Matchup Relation (Source 2756564)
    relations: {
      assist: {
        title: 'Hero Rekan Terbaik',
        desc: 'Ultimate Sora setelah perubahan memberikan damage besar, menggabungkannya dengan Tigreal, Minotaur, Gatotkaca, dan hero dengan CC kuat lainnya akan memaksimalkan potensi damage Sora.',
        heroes: [
          { name: 'Tigreal', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_96f9dbbc096e0f0a28f9b9e587d06a9c.png' },
          { name: 'Gatotkaca', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_8b30576754be1a4f8bebd09df8d6bec7.png' },
          { name: 'Minotaur', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3ecd2c0843df7ec85044dafff6bf4553.png' }
        ]
      },
      strong: {
        title: 'Kuat Melawan (Hero Di-counter)',
        desc: 'Sora unggul dalam serangan cepat dengan damage tinggi dan efek CC area, jadi hero tanpa kemampuan kabur seperti Layla, Miya, dan Hanabi akan kesulitan menghadapi gempurannya yang terus-menerus.',
        heroes: [
          { name: 'Layla', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_b2b38e9406ea0de0b866db7674feea0f.png' },
          { name: 'Miya', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_da894b37bfb5cadb32307f371f31918a.png' },
          { name: 'Hanabi', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_8a9c1966feb34e85d7bdcc1ed01ffb5d.png' }
        ]
      },
      weak: {
        title: 'Lemah Melawan (Counter Sora)',
        desc: 'Sora sangat bergantung pada akurasi Skill 1 untuk mengisi stack Cloudstep. Hero dengan mobilitas tinggi atau efek knockback, seperti Fanny, Arlott, dan Valir, bisa mencegah Sora mengumpulkan stack ini.',
        heroes: [
          { name: 'Fanny', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_bf16690876761b80822df90eb3320d69.png' },
          { name: 'Arlott', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3391df36d6dcc54dd1c417098e15ec59.png' },
          { name: 'Valir', head: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_f666faa5ec6be5353f10dcd1d8997a42.png' }
        ]
      }
    },

    // Skillset Modes (Source 2756564)
    skillModes: [
      {
        id: 'default',
        label: 'Mode Biasa (Base)',
        icon: 'fa-solid fa-wind',
        color: 'bg-slate-700 text-white',
        skills: [
          {
            skillid: 13140,
            skillname: 'Mystic Surge',
            type: 'Pasif',
            cost: 'No Cost',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3612a82fab54424686631e59c7a8c322.png',
            tags: ['Buff'],
            desc: 'Sora bisa memasuki mode Thunder atau Torrent dengan Ultimate-nya. Setelah berganti mode, memberikan damage ke hero atau unit panggilan akan menambah 1 stack Cloudstep. Saat stack mencapai 5, dia membuka True Art.'
          },
          {
            skillid: 13110,
            skillname: 'Sundering Strike',
            type: 'Skill 1',
            cost: 'CD: 5s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3e241dd044b166bccbc62957f2aaf0f8.png',
            tags: ['Damage'],
            desc: 'Sora menyerang dua kali, memberikan 140 (+50% Total Physical Attack) Physical Damage, kemudian menerjang ke depan, memberikan 240 (+5% Max HP) Physical Damage. Dia bisa melakukan dash setelah menyerang.'
          },
          {
            skillid: 13120,
            skillname: 'Windstride',
            type: 'Skill 2',
            cost: 'CD: 8s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_14dbfe16a6a19c482ecc88eb0d9307a7.png',
            tags: ['Blink', 'Damage'],
            desc: 'Sora melompat ke depan, memberikan 140 (+55% Total Physical Attack) Physical Damage. Jika mengenai hero lawan atau mencapai jangkauan maksimum, dia menghantam tanah memberikan slow 40% dan mereset CD 2 detik.'
          },
          {
            skillid: 13130,
            skillname: 'Shifting Skies',
            type: 'Ultimate',
            cost: 'CD: 32s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_cea96e22851430931feb523f9bfac657.png',
            tags: ['Damage', 'Buff'],
            desc: 'Geser ke kiri untuk masuk ke mode Thunder selama 10s (Assassin Style, petir 3x). Geser ke kanan untuk masuk ke mode Torrent selama 10s (Tank Style, kebal CC & menarik musuh).'
          }
        ]
      },
      {
        id: 'thunder',
        label: 'Mode Thunder (Assassin Style)',
        icon: 'fa-solid fa-bolt',
        color: 'bg-amber-600 text-white',
        skills: [
          {
            skillid: 13140,
            skillname: 'Mystic Surge (Thunder)',
            type: 'Pasif',
            cost: 'No Cost',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3612a82fab54424686631e59c7a8c322.png',
            tags: ['Buff'],
            desc: 'Gaya Assassin: Mengonversi 30% Max HP menjadi Physical Attack. Memberikan mobilitas tinggi dan burst damage ekstrim pada backline lawan.'
          },
          {
            skillid: 1013110,
            skillname: 'Sundering Strike - Thunder Flash',
            type: 'Skill 1',
            cost: 'CD: 5s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_e7981942a32da2499ed7ee5d955274bf.png',
            tags: ['Damage', 'Blink'],
            desc: 'Sora menyerang empat kali secara kilat dengan 140 (+50% Total Physical Attack) Physical Damage, kemudian meluncur ke depan. Dia bebas bergerak selama skill aktif.'
          },
          {
            skillid: 1013120,
            skillname: 'Windstride - Thunder Rush',
            type: 'Skill 2',
            cost: 'CD: 8s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_44c7378609f0dbc2cbc31eda36e1b41d.png',
            tags: ['Blink', 'Damage'],
            desc: 'Sora melompat memanggil badai petir, memberikan slow 50% selama 0.5 detik. Skill ini bisa digunakan kembali dalam 4 detik jika mengenai lawan!'
          },
          {
            skillid: 3013130,
            skillname: "Heaven's Wrath",
            type: 'Ultimate True Art',
            cost: 'CD: 0.2s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_7dd6e441e24c876f2a908d7bb23f91bb.png',
            tags: ['Damage', 'Invulnerable'],
            desc: 'Sora melompat ke udara dan menghujani target sebanyak 16 kali serangan kilat, masing-masing 60 (+40% Total Physical Attack) Physical Damage tanpa bisa ditargetkan lawan.'
          }
        ]
      },
      {
        id: 'torrent',
        label: 'Mode Torrent (Tank/CC Style)',
        icon: 'fa-solid fa-water',
        color: 'bg-blue-600 text-white',
        skills: [
          {
            skillid: 13140,
            skillname: 'Mystic Surge (Torrent)',
            type: 'Pasif',
            cost: 'No Cost',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3612a82fab54424686631e59c7a8c322.png',
            tags: ['Buff', 'Defense'],
            desc: 'Gaya Tank: Mengonversi 30% Attack menjadi bonus HP masif (10 HP untuk tiap 1 Attack). Sangat tebal di garis depan tim.'
          },
          {
            skillid: 2013110,
            skillname: 'Sundering Strike - Overwhelm',
            type: 'Skill 1',
            cost: 'CD: 5s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_6d3d6f49e87e9b470decddd96ceeb8f7.png',
            tags: ['Damage', 'CC'],
            desc: 'Sora menyerang 2x dengan efek 40% slow, disusul terjang ke depan yang memberikan stun selama 0.5 detik dan damage berbasis Max HP.'
          },
          {
            skillid: 2013120,
            skillname: 'Windstride - Skyfall',
            type: 'Skill 2',
            cost: 'CD: 8s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_6238f98e4a8ecc15e9ab7787882edce9.png',
            tags: ['Blink', 'Airborne', 'CC'],
            desc: 'Sora melompat memberi efek airborne mendorong lawan ke titik pendaratan, kemudian membanting tanah menghasilkan airborne beruntun 0.5 detik.'
          },
          {
            skillid: 3013132,
            skillname: 'Stormbind',
            type: 'Ultimate True Art',
            cost: 'CD: 0.2s',
            icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_110416b6328d192138f7a74c88f96242.png',
            tags: ['Damage', 'Stun', 'CC'],
            desc: 'Sora melompat ke udara mengikat area pertarungan dengan 5 kali guncangan air pasang, tiap serangan memberikan stun area dan damage scaling HP.'
          }
        ]
      }
    ],

    // API 3: Combos & Tactical Guides (Source 2674711)
    combos: [
      {
        id: 'teamfight',
        title: 'KOMBO TEAM FIGHT',
        badge: 'Pertempuran Tim',
        desc: 'Saat team fight di mid hingga late game, Sora dapat menyesuaikan diri dengan kondisi pertarungan. Gunakan mode Thunder untuk menerobos ke barisan belakang lawan, atau mode Torrent untuk mengendalikan pertempuran dengan efek CC yang kuat.',
        steps: [
          { skill: 'Skill 2 (Windstride)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_14dbfe16a6a19c482ecc88eb0d9307a7.png' },
          { skill: 'Ultimate (Mode Switch)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_cea96e22851430931feb523f9bfac657.png' },
          { skill: 'Skill 1 (Sundering)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3e241dd044b166bccbc62957f2aaf0f8.png' },
          { skill: 'Skill 2 (Rush/Skyfall)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_14dbfe16a6a19c482ecc88eb0d9307a7.png' },
          { skill: 'Basic / True Art', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_f98d2e98eaebfb31c6c5101cf1c3201a.png' },
          { skill: 'Ultimate Finish', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_cea96e22851430931feb523f9bfac657.png' }
        ]
      },
      {
        id: 'laning',
        title: 'KOMBO KORIDOR / LANING',
        badge: '1v1 Trade',
        desc: 'Saat lawan mendekat untuk farming minion, gunakan Skill 1 untuk mencicil HP musuh lalu gunakan Skill 2 untuk menghindar mundur. Mobilitas Skill 1 dan 2 memungkinkan strategi hit-and-run tanpa terkena balasan musuh.',
        steps: [
          { skill: 'Skill 2 (Approach)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_14dbfe16a6a19c482ecc88eb0d9307a7.png' },
          { skill: 'Skill 1 (Strike 2x)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3e241dd044b166bccbc62957f2aaf0f8.png' },
          { skill: 'Ultimate Buff', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_cea96e22851430931feb523f9bfac657.png' },
          { skill: 'Basic Attack Stack', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_f98d2e98eaebfb31c6c5101cf1c3201a.png' },
          { skill: 'Skill 2 (Disengage)', icon: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_14dbfe16a6a19c482ecc88eb0d9307a7.png' }
        ]
      }
    ]
  }
};

export const getHeroDetailById = (id) => {
  const numId = Number(id);
  if (HERO_DETAILS[numId]) {
    return HERO_DETAILS[numId];
  }
  // Fallback generic detail based on Sora format
  const base = HERO_DETAILS[131];
  return {
    ...base,
    hero_id: numId,
    name: 'Hero #' + numId,
    title: 'Mobile Legends Warrior'
  };
};
