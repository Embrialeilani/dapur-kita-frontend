'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { formatRupiah, getCart, saveCart, cartTotal, CartItem } from '@/lib/helpers';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const update = (idx: number, delta: number) => {
    const next = [...cart];
    next[idx].quantity = Math.max(1, next[idx].quantity + delta);
    setCart(next);
    saveCart(next);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const remove = (idx: number) => {
    if (!confirm('Hapus item ini dari keranjang?')) return;
    const next = cart.filter((_, i) => i !== idx);
    setCart(next);
    saveCart(next);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cartTotal(cart);

  return (
    <AuthGuard>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Keranjang Belanja</h1>
          <p>Cek paket yang sudah kamu pilih sebelum checkout</p>
        </div>
        <div className="page-content">
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>Keranjang kosong</h3>
              <p>Yuk pilih paket catering favoritmu</p>
              <Link href="/menu" className="btn btn-primary" style={{ marginTop: 20 }}>Lihat Menu</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cart.map((item, idx) => (
                  <div key={idx} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        background: item.imageUrl ? `url('${item.imageUrl}') center/cover` : 'var(--cream-dark)',
                        borderRadius: 8,
                        flexShrink: 0,
                      }}
                    ></div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>{item.name}</h3>
                      <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: 4 }}>
                        {formatRupiah(item.price)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => update(idx, -1)}>-</button>
                      <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                      <button className="btn btn-outline btn-sm" onClick={() => update(idx, +1)}>+</button>
                    </div>
                    <div style={{ minWidth: 110, textAlign: 'right', fontWeight: 700 }}>
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(idx)}>×</button>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginTop: 20, background: 'var(--cream)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20 }}>
                  <strong>Total</strong>
                  <strong style={{ color: 'var(--primary)', fontSize: 28 }}>{formatRupiah(total)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
                <Link href="/menu" className="btn btn-outline">← Lanjut Belanja</Link>
                <Link href="/checkout" className="btn btn-primary btn-lg">Checkout →</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
