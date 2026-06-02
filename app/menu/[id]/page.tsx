'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { formatRupiah, addToCart } from '@/lib/helpers';
import { isLoggedIn, getUser } from '@/lib/auth';
import { useToast } from '@/components/Toast';

interface Pkg {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  category?: { id: number; name: string };
}

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id;

  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    api.get<Pkg>(`/packages/${id}`)
      .then(setPkg)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddCart = () => {
    if (!isLoggedIn()) {
      toast.error('Login dulu untuk pesan');
      router.push('/login');
      return;
    }
    const user = getUser();
    if (user?.role === 'ADMIN') {
      toast.error('Admin tidak bisa memesan paket');
      return;
    }
    if (!pkg) return;
    if (qty > pkg.stock) {
      toast.error(`Stok hanya tersisa ${pkg.stock}`);
      return;
    }
    addToCart({
      packageId: pkg.id,
      name: pkg.name,
      price: pkg.price,
      quantity: qty,
      imageUrl: pkg.imageUrl,
    });
    window.dispatchEvent(new Event('cart-updated'));
    toast.success('Ditambahkan ke keranjang');
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat detail...</div>
        ) : error || !pkg ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>Paket tidak ditemukan</h3>
            <Link href="/menu" className="btn btn-primary" style={{ marginTop: 20 }}>← Kembali ke Menu</Link>
          </div>
        ) : (
          <div className="page-content" style={{ marginTop: 30 }}>
            <Link href="/menu" style={{ color: 'var(--text-muted)', display: 'inline-block', marginBottom: 20 }}>
              ← Kembali ke daftar paket
            </Link>
            <div className="detail-grid">
              <div className="detail-image" style={pkg.imageUrl ? { backgroundImage: `url('${pkg.imageUrl}')` } : {}}></div>
              <div className="detail-info">
                <div className="package-category">{pkg.category?.name || ''}</div>
                <h1>{pkg.name}</h1>
                <div className="detail-price">{formatRupiah(pkg.price)}</div>
                <p className="detail-desc">{pkg.description}</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '20px 0' }}>
                  <span>Stok: <strong>{pkg.stock}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                  <label>Jumlah:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 80, textAlign: 'center' }}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(pkg.stock, parseInt(e.target.value) || 1)))}
                      min={1}
                      max={pkg.stock}
                    />
                    <button className="btn btn-outline btn-sm" onClick={() => setQty(Math.min(pkg.stock, qty + 1))}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-primary btn-lg" onClick={handleAddCart}>🛒 Tambah ke Keranjang</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
