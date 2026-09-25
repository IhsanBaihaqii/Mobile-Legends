// src/data/navigation.js
// Data menu navigasi dan routing aplikasi

export const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fa-solid fa-chart-pie',
    badge: 'Stats',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    path: '/heroes',
    label: 'Katalog Hero',
    icon: 'fa-solid fa-users',
    badge: '130+',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    path: '/synergy',
    label: 'Sinergi & Counter',
    icon: 'fa-solid fa-handshake-angle',
    badge: 'Baru',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    path: '/api-explorer',
    label: 'Struktur API (JS)',
    icon: 'fa-solid fa-code',
    badge: 'Docs',
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    path: '/login',
    label: 'Akun / Login',
    icon: 'fa-solid fa-user-lock',
    badge: null
  }
];
