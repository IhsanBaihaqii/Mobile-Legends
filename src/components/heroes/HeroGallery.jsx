// src/components/heroes/HeroGallery.jsx
// Main Hero Gallery Component dengan Live Scrape, Filter Role, Search, Infinite Scroll Batch 21, dan Navigasi URL ke /hero/:id

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ROLE_META } from '../../data/roles.js';
import { mlbbService } from '../../services/mlbbService.js';

export default function HeroGallery({ onSelectHero }) {
  const [role, setRole] = useState('all');
  const [heroes, setHeroes] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showToTop, setShowToTop] = useState(false);

  // Sentinel ref for IntersectionObserver
  const observerRef = useRef(null);

  // Helper normalizing API hero items
  const parseTagArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x === 'object' && x.data)
      .map((x) => ({
        id: String(x.data.sort_id ?? x.data.road_sort_id ?? ''),
        title: (x.data.sort_title ?? x.data.road_sort_title ?? '').toLowerCase(),
        rawTitle: x.data.sort_title ?? x.data.road_sort_title ?? '',
        icon: x.data.sort_icon ?? x.data.road_sort_icon ?? '',
      }))
      .filter((x) => x.title);
  };

  const normalizeItem = (item) => {
    const hd = item?.data?.hero?.data || {};
    const roles = parseTagArray(hd.sortid);
    const roads = parseTagArray(hd.roadsort);
    return {
      id: item.id,
      heroId: item?.data?.hero_id ?? '-',
      name: hd.name || 'Unknown Hero',
      img: hd.smallmap || '',
      roles,
      roads,
      primaryRole: roles[0]?.title || '',
    };
  };

  // Function to load hero page from real API
  const loadHeroPage = useCallback(async (targetRole, targetPage, isReset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await mlbbService.fetchHeroPage({
        role: targetRole,
        page: targetPage,
        pageSize: 21,
      });

      const rawItems = res?.data || [];
      const normalized = rawItems.map(normalizeItem);

      setHeroes((prev) => {
        if (isReset) return normalized;
        const existingIds = new Set(prev.map((h) => h.heroId));
        const newOnes = normalized.filter((h) => !existingIds.has(h.heroId));
        return [...prev, ...newOnes];
      });

      if (normalized.length < 21 || targetPage >= 7) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error('Failed to load heroes:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  // Handle role switch (Reset state & fetch page 1)
  useEffect(() => {
    setInitialLoading(true);
    setHeroes([]);
    setPage(1);
    setHasMore(true);
    loadHeroPage(role, 1, true);
  }, [role]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadHeroPage(role, nextPage, false);
        }
      },
      { rootMargin: '300px' }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, page, role, initialLoading, loadHeroPage]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroClick = (heroId) => {
    if (onSelectHero) {
      onSelectHero(heroId);
    }
  };

  // Search filtering in client
  const filteredHeroes = search.trim()
    ? heroes.filter((h) => h.name.toLowerCase().includes(search.toLowerCase().trim()))
    : heroes;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-200">
      {/* Sticky Header with Clean Solid Dark Background */}
      <header className="sticky top-0 z-40 bg-[#0a0e17]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-[#0a0e17]">
              <i className="fa-solid fa-dragon text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
                MLBB <span className="text-amber-400">Hero Gallery</span>
              </h1>
              <p className="text-[11px] text-gray-400 tracking-wider uppercase mt-0.5">
                Live Moonton API Explorer
              </p>
            </div>
          </div>

          {/* Desktop Search Input */}
          <div className="relative w-full max-w-xs hidden sm:block">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari hero..."
              className="w-full bg-gray-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        {/* Role Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(ROLE_META).map(([key, r]) => {
            const isActive = role === key;
            return (
              <button
                key={key}
                onClick={() => setRole(key)}
                className={`relative overflow-hidden rounded-xl border px-3 sm:px-4 py-2 text-sm transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-400 text-gray-950 font-bold border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-gray-900/80 border-white/10 text-gray-300 hover:border-amber-400/40'
                }`}
              >
                <i className={`fa-solid ${r.icon} text-xs`}></i>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Search Input */}
        <div className="sm:hidden mb-4 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari hero..."
            className="w-full bg-gray-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition"
          />
        </div>

        {/* Status Count Indicator */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            Menampilkan <span className="text-amber-400 font-bold">{filteredHeroes.length}</span> hero
            {page > 1 && <span className="text-gray-500 text-xs ml-1">(Halaman 1 s/d {page})</span>}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Scrape</span>
          </div>
        </div>

        {/* Initial Skeleton Loader */}
        {initialLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/5 bg-gray-900 animate-pulse">
                <div className="aspect-square bg-gray-800"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-gray-800"></div>
                  <div className="h-2 w-1/2 rounded bg-gray-800"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero Cards Grid */}
        {!initialLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredHeroes.map((h) => {
              const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(h.name)}&background=111827&color=f5c451&size=256&bold=true`;
              const imgSrc = h.img || fallback;

              return (
                <div
                  key={h.heroId}
                  onClick={() => handleHeroClick(h.heroId)}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/20"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-950">
                    <img
                      src={imgSrc}
                      alt={h.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none"></div>

                    {/* Top Left: Role Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {h.roles.slice(0, 2).map((r) => {
                        const m = ROLE_META[r.title] || { icon: 'fa-circle-question', color: 'bg-gray-800 text-gray-300 border-gray-700' };
                        return (
                          <span
                            key={r.title}
                            title={r.rawTitle}
                            className={`w-6 h-6 rounded-md flex items-center justify-center border backdrop-blur-sm ${m.color}`}
                          >
                            <i className={`fa-solid ${m.icon} text-[10px]`}></i>
                          </span>
                        );
                      })}
                    </div>

                    {/* Top Right: Hero ID */}
                    <span className="absolute top-2 right-2 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-400">
                      #{h.heroId}
                    </span>

                    {/* Bottom Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-amber-400 transition-colors">
                        {h.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {h.roles.map((r) => r.rawTitle).join(' • ') || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!initialLoading && filteredHeroes.length === 0 && (
          <div className="text-center py-20">
            <i className="fa-regular fa-face-frown text-5xl text-gray-600 mb-3 block"></i>
            <p className="text-gray-400 text-sm">Tidak ada hero ditemukan.</p>
          </div>
        )}

        {/* Infinite Scroll Trigger Sentinel */}
        <div ref={observerRef} className="h-16 flex items-center justify-center mt-4">
          {loading && !initialLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <i className="fa-solid fa-circle-notch fa-spin text-base"></i>
              <span>Memuat hero halaman {page}...</span>
            </div>
          )}
          {!hasMore && heroes.length > 0 && !loading && (
            <p className="text-xs text-gray-600">Semua hero telah dimuat.</p>
          )}
        </div>
      </main>

      {/* Floating Scroll To Top Button */}
      {showToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-amber-400 text-gray-950 shadow-lg shadow-amber-400/30 hover:scale-110 transition-transform flex items-center justify-center font-bold"
          title="Kembali ke atas"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
}
