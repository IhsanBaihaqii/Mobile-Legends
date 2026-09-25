// src/data/heroList.js
// Data array list hero Mobile Legends hasil scraping API Moonton

export const HERO_LIST = [
  {
    hero_id: 131,
    name: 'Sora',
    title: 'The Skyward Blade',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_8143d7bbd4318d7c699908e808de885e.png',
    painting: 'https://akmweb.youngjoygame.com/web/gms/image/bc8375c54a43cc02fedcc304033c23bb.webp',
    roles: ['fighter', 'assassin'],
    roleLabels: ['Fighter', 'Assassin'],
    lanes: ['exp'],
    laneLabels: ['EXP Lane'],
    difficulty: 50,
    winRate: 49.48,
    appearanceRate: 0.55,
    banRate: 2.75,
    relation: {
      assist: [41, 6, 19],
      strong: [18, 1, 60],
      weak: [57, 17, 120]
    },
    speciality: ['Charge', 'Burst']
  },
  {
    hero_id: 132,
    name: 'Marcel',
    title: 'The Warden of Tides',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_dd980a8816698f1503cdb76201d17dd0.png',
    roles: ['support'],
    roleLabels: ['Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 45,
    winRate: 51.20,
    appearanceRate: 1.15,
    banRate: 3.40,
    relation: {
      assist: [60, 121],
      strong: [18, 38],
      weak: [84, 83]
    },
    speciality: ['Guard', 'Regen']
  },
  {
    hero_id: 128,
    name: 'Kalea',
    title: 'Wavebound Guardian',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_9c5f2904026ba88b7aba8c9b2722f4ad.png',
    roles: ['support', 'fighter'],
    roleLabels: ['Support', 'Fighter'],
    lanes: ['roam', 'exp'],
    laneLabels: ['Roam', 'EXP Lane'],
    difficulty: 60,
    winRate: 52.14,
    appearanceRate: 2.30,
    banRate: 8.65,
    relation: {
      assist: [15, 42, 13],
      strong: [18, 61],
      weak: [48, 19]
    },
    speciality: ['Control', 'Crowd']
  },
  {
    hero_id: 124,
    name: 'Chip',
    title: 'Phase Portal Badger',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_85e15c66733cab7d8d73f7f725f31f1e.png',
    roles: ['support', 'tank'],
    roleLabels: ['Support', 'Tank'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 65,
    winRate: 50.88,
    appearanceRate: 3.25,
    banRate: 18.42,
    relation: {
      assist: [28, 60, 75],
      strong: [38, 18, 121],
      weak: [99, 6]
    },
    speciality: ['Teleport', 'Initiator']
  },
  {
    hero_id: 112,
    name: 'Floryn',
    title: 'The Budding Hope',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_5168f0a54304b2f20f976a1ffa96e1dc.png',
    roles: ['support'],
    roleLabels: ['Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 30,
    winRate: 53.40,
    appearanceRate: 4.80,
    banRate: 12.10,
    relation: {
      assist: [82, 72],
      strong: [59, 20],
      weak: [8, 3]
    },
    speciality: ['Global Heal', 'Poke']
  },
  {
    hero_id: 102,
    name: 'Mathilda',
    title: 'Swift Plume',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_c3d601a8f6a69409359083ba599f0bb6.png',
    roles: ['support', 'assassin'],
    roleLabels: ['Support', 'Assassin'],
    lanes: ['roam', 'mid'],
    laneLabels: ['Roam', 'Mid Lane'],
    difficulty: 55,
    winRate: 51.95,
    appearanceRate: 3.10,
    banRate: 15.20,
    relation: {
      assist: [3, 15],
      strong: [23, 66],
      weak: [10, 74]
    },
    speciality: ['Mobility', 'Burst']
  },
  {
    hero_id: 92,
    name: 'Carmilla',
    title: 'Shadow of Twilight',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_358d6ad9cff97fc3bfef8a2bd4acbadd.png',
    roles: ['support', 'tank'],
    roleLabels: ['Support', 'Tank'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 40,
    winRate: 52.80,
    appearanceRate: 1.45,
    banRate: 2.10,
    relation: {
      assist: [91, 36],
      strong: [85, 37],
      weak: [60, 89]
    },
    speciality: ['Curse Link', 'Sustain']
  },
  {
    hero_id: 76,
    name: 'Faramis',
    title: 'Soul Binder',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_4bed236fc260d9924b030e576793a26b.png',
    roles: ['support', 'mage'],
    roleLabels: ['Support', 'Mage'],
    lanes: ['mid', 'roam'],
    laneLabels: ['Mid Lane', 'Roam'],
    difficulty: 50,
    winRate: 52.65,
    appearanceRate: 2.80,
    banRate: 7.90,
    relation: {
      assist: [67, 58],
      strong: [3, 15],
      weak: [119, 52]
    },
    speciality: ['Resurrection', 'CC']
  },
  {
    hero_id: 62,
    name: 'Kaja',
    title: 'Nazar Commander',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_bd2dce5f2da92dd0fa3a4bb8b45f685e.png',
    roles: ['support', 'fighter'],
    roleLabels: ['Support', 'Fighter'],
    lanes: ['roam', 'exp'],
    laneLabels: ['Roam', 'EXP Lane'],
    difficulty: 45,
    winRate: 50.40,
    appearanceRate: 1.60,
    banRate: 4.30,
    relation: {
      assist: [46, 52, 121],
      strong: [18, 121, 38],
      weak: [25, 30, 126]
    },
    speciality: ['Suppress', 'Pick-off']
  },
  {
    hero_id: 55,
    name: 'Angela',
    title: 'Bunny Love',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_a815a3adad8df99481700c84abaf3c41.png',
    roles: ['support'],
    roleLabels: ['Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 35,
    winRate: 51.10,
    appearanceRate: 7.40,
    banRate: 14.50,
    relation: {
      assist: [47, 109],
      strong: [59, 70],
      weak: [84, 42]
    },
    speciality: ['Possession', 'Shield']
  },
  {
    hero_id: 48,
    name: 'Diggie',
    title: 'Timekeeper',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_7a7a688cf1562a124f7183b2c2957608.png',
    roles: ['support'],
    roleLabels: ['Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 40,
    winRate: 53.91,
    appearanceRate: 3.90,
    banRate: 26.70,
    relation: {
      assist: [18, 1],
      strong: [93, 20],
      weak: [84, 109]
    },
    speciality: ['Anti-CC', 'Vision']
  },
  {
    hero_id: 34,
    name: 'Estes',
    title: 'Moon Elf King',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_a3619b68f415405f0a1ad77be31eb64d.png',
    roles: ['support'],
    roleLabels: ['Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 25,
    winRate: 52.30,
    appearanceRate: 6.20,
    banRate: 19.80,
    relation: {
      assist: [53, 60],
      strong: [57, 4],
      weak: [3, 15]
    },
    speciality: ['Continuous Heal', 'Teamfight']
  },
  {
    hero_id: 32,
    name: 'Johnson',
    title: 'Mustang',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_9939e5cc09011a287a989b7d4b3aec4d.png',
    roles: ['tank', 'support'],
    roleLabels: ['Tank', 'Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 60,
    winRate: 49.75,
    appearanceRate: 5.10,
    banRate: 11.20,
    relation: {
      assist: [46, 75],
      strong: [7, 16],
      weak: [73, 25]
    },
    speciality: ['Crash', 'Gank']
  },
  {
    hero_id: 20,
    name: 'Lolita',
    title: 'Steel Elf',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_55de18c865efe8e360b3b9ae463d76a2.png',
    roles: ['support', 'tank'],
    roleLabels: ['Support', 'Tank'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 45,
    winRate: 54.10,
    appearanceRate: 2.10,
    banRate: 6.50,
    relation: {
      assist: [60, 18],
      strong: [71, 33],
      weak: [84, 103]
    },
    speciality: ['Projectile Shield', 'AoE Stun']
  },
  {
    hero_id: 19,
    name: 'Minotaur',
    title: 'Son of Minos',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_3b7cb3a2be4264d3927f3b5a5050117a.png',
    roles: ['tank', 'support'],
    roleLabels: ['Tank', 'Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 35,
    winRate: 53.25,
    appearanceRate: 4.50,
    banRate: 8.70,
    relation: {
      assist: [79, 114],
      strong: [103, 116],
      weak: [18, 53]
    },
    speciality: ['Rage Slam', 'AoE Airborne']
  },
  {
    hero_id: 14,
    name: 'Rafaela',
    title: 'Wings of Healing',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_f22e22659e8b1acfb665aec8eaffabd7.png',
    roles: ['support'],
    roleLabels: ['Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 20,
    winRate: 50.85,
    appearanceRate: 2.40,
    banRate: 1.20,
    relation: {
      assist: [22, 37],
      strong: [88, 99],
      weak: [84, 21]
    },
    speciality: ['Speed Boost', 'Slow Reveal']
  },
  {
    hero_id: 6,
    name: 'Tigreal',
    title: 'Warrior of Dawn',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_8b30576754be1a4f8bebd09df8d6bec7.png',
    roles: ['tank', 'support'],
    roleLabels: ['Tank', 'Support'],
    lanes: ['roam'],
    laneLabels: ['Roam'],
    difficulty: 30,
    winRate: 52.40,
    appearanceRate: 8.90,
    banRate: 16.80,
    relation: {
      assist: [131, 60],
      strong: [18, 1],
      weak: [48, 20]
    },
    speciality: ['Mass CC', 'Vacuum']
  },
  {
    hero_id: 18,
    name: 'Layla',
    title: 'Energy Gunner',
    avatar: 'https://akmweb.youngjoygame.com/web/svnres/img/test/homepage_2_2_16_1232_1/100_b2b38e9406ea0de0b866db7674feea0f.png',
    roles: ['marksman'],
    roleLabels: ['Marksman'],
    lanes: ['gold'],
    laneLabels: ['Gold Lane'],
    difficulty: 25,
    winRate: 48.90,
    appearanceRate: 11.20,
    banRate: 4.10,
    relation: {
      assist: [6, 19, 48],
      strong: [7, 34],
      weak: [131, 57, 108]
    },
    speciality: ['Ultra Long Range', 'Critical']
  }
];

export const getHeroById = (id) => {
  const numId = Number(id);
  return HERO_LIST.find(h => h.hero_id === numId) || HERO_LIST[0];
};
