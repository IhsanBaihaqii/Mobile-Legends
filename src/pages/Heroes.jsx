// src/pages/Heroes.jsx
// Halaman katalog lengkap hero dengan filter role, jalur (lane), dan pencarian

import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import HeroFilter from '../components/heroes/HeroFilter.jsx';
import HeroGrid from '../components/heroes/HeroGrid.jsx';
import { mlbbService } from '../services/mlbbService.js';

export default function Heroes({ onSelectHero, onNavigate }) {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('all');
  const [lane, setLane] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    mlbbService.getHeroes({ role, lane, search })
      .then((res) => {
        if (isMounted) {
          setHeroes(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [role, lane, search]);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        title="Katalog Hero Mobile Legends"
        subtitle="Data hero real-time dari API GMS Moonton dengan filter role & lane"
        searchValue={search}
        onSearchChange={setSearch}
        onNavigate={onNavigate}
      />

      <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full">
        {/* Filters */}
        <HeroFilter
          activeRole={role}
          onRoleChange={setRole}
          activeLane={lane}
          onLaneChange={setLane}
          totalResults={heroes.length}
        />

        {/* Hero Grid */}
        <HeroGrid
          heroes={heroes}
          loading={loading}
          onSelectHero={onSelectHero}
        />
      </div>
    </div>
  );
}
