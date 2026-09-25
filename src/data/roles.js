// src/data/roles.js
// Data definisi role MLBB yang dipisah secara modular

export const ROLE_META = {
  all: {
    label: "All",
    icon: "fa-layer-group",
    grad: "from-amber-500 to-yellow-400",
    color: "bg-slate-800 text-slate-300 border-slate-700"
  },
  tank: {
    label: "Tank",
    icon: "fa-shield-halved",
    color: "bg-sky-500/25 text-sky-300 border-sky-500/40",
    grad: "from-sky-500 to-cyan-400",
  },
  fighter: {
    label: "Fighter",
    icon: "fa-hand-fist",
    color: "bg-red-500/25 text-red-300 border-red-500/40",
    grad: "from-red-500 to-orange-400",
  },
  assassin: {
    label: "Assassin",
    icon: "fa-user-ninja",
    color: "bg-purple-500/25 text-purple-300 border-purple-500/40",
    grad: "from-purple-500 to-fuchsia-400",
  },
  mage: {
    label: "Mage",
    icon: "fa-hat-wizard",
    color: "bg-indigo-500/25 text-indigo-300 border-indigo-500/40",
    grad: "from-indigo-500 to-violet-400",
  },
  marksman: {
    label: "Marksman",
    icon: "fa-crosshairs",
    color: "bg-emerald-500/25 text-emerald-300 border-emerald-500/40",
    grad: "from-emerald-500 to-green-400",
  },
  support: {
    label: "Support",
    icon: "fa-hand-holding-heart",
    color: "bg-pink-500/25 text-pink-300 border-pink-500/40",
    grad: "from-pink-500 to-rose-400",
  },
};

export const LANE_ICONS = {
  "exp lane": "fa-mountain-sun",
  "gold lane": "fa-coins",
  "mid lane": "fa-wand-magic-sparkles",
  jungle: "fa-tree",
  roam: "fa-shield-heart",
};
