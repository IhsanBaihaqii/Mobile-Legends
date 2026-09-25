// src/App.jsx
// Routing Mandiri URL: Galeri Hero Utama (/) dan Halaman Detail Hero (/hero/:id) dengan History API

import React, { useState, useEffect } from 'react';
import HeroGallery from './components/heroes/HeroGallery.jsx';
import HeroPage from './pages/HeroPage.jsx';

export default function App() {
  // Parsing route dari window.location.pathname atau hash
  const parseCurrentRoute = () => {
    if (typeof window === 'undefined') return { page: 'gallery', heroId: null };

    // Support pathname /hero/:id atau hash #/hero/:id
    const hash = window.location.hash.replace('#', '');
    const pathname = window.location.pathname;
    const current = hash.startsWith('/hero/') ? hash : pathname;

    if (current.startsWith('/hero/')) {
      const parts = current.split('/hero/')[1];
      const cleanId = parts?.replace(/\/$/, '');
      if (cleanId) {
        return { page: 'hero', heroId: cleanId };
      }
    }

    return { page: 'gallery', heroId: null };
  };

  const [route, setRoute] = useState(parseCurrentRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToHero = (heroId) => {
    const targetUrl = `/hero/${heroId}`;
    try {
      window.history.pushState({}, '', targetUrl);
    } catch {
      window.location.hash = targetUrl;
    }
    setRoute({ page: 'hero', heroId });
  };

  const navigateToGallery = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '/';
    }
    setRoute({ page: 'gallery', heroId: null });
  };

  if (route.page === 'hero' && route.heroId) {
    return <HeroPage heroId={route.heroId} onBack={navigateToGallery} />;
  }

  return <HeroGallery onSelectHero={navigateToHero} />;
}
