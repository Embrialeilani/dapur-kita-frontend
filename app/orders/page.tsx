'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { formatRupiah, formatDate, statusLabel, statusBadge } from '@/lib/helpers';
import { useToast } from '@/components/Toast';
import OrderProgress from '@/components/OrderProgress';

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  eventDate: string;
  eventAddress: string;
  createdAt: string;
  items: Array<{ id: number; quantity: number; subtotal: number; package: { name: string } }>;
}

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get<Order[]>('/orders')
      .then(setOrders)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Yakin batalkan pesanan? Stok akan dikembalikan.')) return;
    toast.info('Sedang membatalkan pesanan...');
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Pesanan dibatalkan');
      load();
    } catch (err: any) {
      toast.error(err.message || 'Gagal membatalkan pesanan');
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Pesanan Saya</h1>
          <p>Pantau status pesanan kamu di sini</p>
        </div>
        <div className="page-content">
          {loading ? (
            <div className="loading"><span className="spinner"></span>Memuat pesanan...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>Belum ada pesanan</h3>
              <Link href="/menu" className="btn btn-primary" style={{ marginTop: 20 }}>Pesan Sekarang</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orders.map((o) => (
                <div key={o.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        #{String(o.id).padStart(4, '0')} • {formatDate(o.createdAt)}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        Acara: <strong>{formatDate(o.eventDate)}</strong>
                      </div>
                    </div>
                    <span className={`badge badge-${statusBadge(o.status)}`}>{statusLabel(o.status)}</span>
                  </div>

                  {/* TIMELINE PROGRESS USER */}
                  <OrderProgress status={o.status} variant="user" />

                  <div style={{ background: 'rgba(140,100,60,0.05)', padding: 10, borderRadius: 8, margin: '10px 0', fontSize: 13 }}>
                    {o.items.map((i) => (
                      <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{i.package.name} ×{i.quantity}</span>
                        <span>{formatRupiah(i.subtotal)}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: 6, marginTop: 6, borderTop: '1px solid rgba(140,100,60,0.2)' }}>
                      <span>Total</span>
                      <span style={{ color: 'var(--primary)' }}>{formatRupiah(o.totalAmount)}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-medium)' }}>
                    📍 {o.eventAddress}{o.paymentMethod ? ` • 💳 ${o.paymentMethod}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {o.status === 'PENDING' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(o.id)}>❌ Batalkan</button>
                    )}
                    {o.status === 'WAITING_PAYMENT' && (
                      <Link href={`/payment/${o.id}`} className="btn btn-primary btn-sm">💳 BAYAR SEKARANG</Link>
                    )}
                    {(o.status === 'PAID' || o.status === 'DELIVERING' || o.status === 'DELIVERED' || o.status === 'COMPLETED') && (
                      <Link href={`/receipt/${o.id}`} target="_blank" className="btn btn-receipt btn-sm">🧾 Lihat Struk</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}