'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/helpers';

interface Pkg {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  categoryId?: number;
  category?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
}

function MenuContent() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCat, setFilterCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    Promise.all([api.get<Pkg[]>('/packages'), api.get<Category[]>('/categories')])
      .then(([pkgs, cats]) => {
        setPackages(pkgs.filter((p) => p.isActive));
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter berdasarkan kategori DAN pencarian
  const filtered = packages.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === null || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Paket Menu</h1>
          <p>Pilih paket catering yang sesuai dengan acara kamu</p>
        </div>

        <div className="page-content">
          {/* Kotak pencarian */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Cari paket catering..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </div>

          {/* Filter kategori */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${filterCat === null ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterCat(null)}
            >
              Semua
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`btn btn-sm ${filterCat === c.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterCat(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><span className="spinner"></span>Memuat paket...</div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3>Gagal memuat paket</h3>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍱</div>
              <h3>{search ? `Tidak ada paket cocok dengan "${search}"` : 'Belum ada paket tersedia'}</h3>
            </div>
          ) : (
            <div className="packages-grid">
              {filtered.map((p) => (
                <div key={p.id} className="package-card">
                  <div className="package-image" style={p.imageUrl ? { backgroundImage: `url('${p.imageUrl}')` } : {}}></div>
                  <div className="package-body">
                    <div className="package-category">{p.category?.name || ''}</div>
                    <h3 className="package-title">{p.name}</h3>
                    <p className="package-desc">{p.description}</p>
                    <div className="package-meta">
                      <div className="package-price">{formatRupiah(p.price)}</div>
                      <div className="package-stock">Stok: {p.stock}</div>
                    </div>
                    <div className="package-actions">
                      <Link href={`/menu/${p.id}`} className="btn btn-primary btn-sm btn-block">Lihat Detail</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="loading"><span className="spinner"></span>Memuat...</div>}>
      <MenuContent />
    </Suspense>
  );
}