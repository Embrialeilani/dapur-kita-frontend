'use client';

import { useState } from 'react';

interface EventItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  location: string;
  guests: string;
  desc: string;
}

const EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Resepsi Pernikahan Andi & Sari',
    category: 'Pernikahan',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    date: 'Maret 2026',
    location: 'Gedung Graha Cakrawala, Malang',
    guests: '500 tamu',
    desc: 'Paket prasmanan lengkap dengan 12 menu utama, dessert corner, dan live cooking station untuk resepsi pernikahan.',
  },
  {
    id: 2,
    title: 'Gathering Tahunan PT Maju Jaya',
    category: 'Korporat',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    date: 'Februari 2026',
    location: 'Hotel Santika, Malang',
    guests: '250 karyawan',
    desc: 'Catering buffet untuk acara gathering perusahaan dengan menu nusantara dan western, lengkap dengan coffee break.',
  },
  {
    id: 3,
    title: 'Arisan Keluarga Besar',
    category: 'Keluarga',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop',
    date: 'Januari 2026',
    location: 'Perumahan Blimbing Indah',
    guests: '60 tamu',
    desc: 'Nasi box premium dan aneka jajanan tradisional untuk acara arisan bulanan keluarga.',
  },
  {
    id: 4,
    title: 'Seminar Nasional Pendidikan',
    category: 'Korporat',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    date: 'Desember 2025',
    location: 'Universitas Negeri Malang',
    guests: '400 peserta',
    desc: 'Snack box dan makan siang untuk peserta seminar, dengan pengiriman tepat waktu sesuai rundown acara.',
  },
  {
    id: 5,
    title: 'Syukuran Khitanan',
    category: 'Keluarga',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    date: 'November 2025',
    location: 'Rumah Bpak Hartono, Sawojajar',
    guests: '150 tamu',
    desc: 'Tumpeng nasi kuning dan prasmanan untuk acara syukuran khitanan keluarga.',
  },
  {
    id: 6,
    title: 'Ulang Tahun Anak ke-7',
    category: 'Pernikahan',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop',
    date: 'Oktober 2025',
    location: 'Taman Krida Budaya, Malang',
    guests: '80 tamu',
    desc: 'Paket pesta ulang tahun dengan tema kartun, lengkap dengan kue, snack, dan menu anak-anak.',
  },
];

const CATEGORIES = ['Semua', 'Pernikahan', 'Korporat', 'Keluarga'];

export default function Portfolio() {
  const [activeCat, setActiveCat] = useState('Semua');
  const [selected, setSelected] = useState<EventItem | null>(null);

  const filtered =
    activeCat === 'Semua' ? EVENTS : EVENTS.filter((e) => e.category === activeCat);

  return (
    <section className="section" id="portfolio">
      <h2 className="section-title">Portfolio Acara Kami</h2>
      <p className="section-subtitle">Beberapa acara yang telah kami tangani dengan penuh dedikasi</p>

      <div className="portfolio-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`portfolio-tab${activeCat === cat ? ' active' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filtered.map((ev) => (
          <div key={ev.id} className="portfolio-item" onClick={() => setSelected(ev)}>
            <img src={ev.image} alt={ev.title} loading="lazy" />
            <div className="portfolio-overlay">
              <span className="portfolio-badge">{ev.category}</span>
              <h3>{ev.title}</h3>
              <p>📍 {ev.location}</p>
              <span className="portfolio-view">Lihat Detail →</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="portfolio-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="portfolio-modal">
            <button className="portfolio-modal-close" onClick={() => setSelected(null)}>×</button>
            <img src={selected.image} alt={selected.title} />
            <div className="portfolio-modal-body">
              <span className="portfolio-badge">{selected.category}</span>
              <h3>{selected.title}</h3>
              <p className="portfolio-modal-desc">{selected.desc}</p>
              <div className="portfolio-modal-meta">
                <div><strong>📅 Tanggal</strong><span>{selected.date}</span></div>
                <div><strong>📍 Lokasi</strong><span>{selected.location}</span></div>
                <div><strong>👥 Jumlah</strong><span>{selected.guests}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}