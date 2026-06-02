'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatRupiah, formatDate, statusLabel, statusBadge } from '@/lib/helpers';
import { useToast } from '@/components/Toast';
import OrderProgress from '@/components/OrderProgress';

const FILTERS = [
  { label: 'Semua', value: '' },
  { label: 'Perlu Konfirmasi', value: 'PENDING' },
  { label: 'Verifikasi Bayar', value: 'PAYMENT_REVIEW' },
  { label: 'Siap Dikirim', value: 'PAID' },
  { label: 'Sedang Diantar', value: 'DELIVERING' },
  { label: 'Selesai', value: 'DELIVERED' },
  { label: 'Dibatalkan', value: 'CANCELLED' },
];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [proofModal, setProofModal] = useState<any>(null);

  const load = () => {
    setLoading(true);
    api.get('/orders')
      .then(setAllOrders)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const act = async (id: number, action: string) => {
    try {
      await api.patch(`/orders/${id}/${action}`, {});
      toast.success('Status pesanan diperbarui');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const reject = async (id: number) => {
    if (!confirm('Yakin menolak pesanan ini? Stok akan dikembalikan & pesanan masuk daftar Dibatalkan.')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Pesanan ditolak & dibatalkan');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const permDelete = async (id: number) => {
    if (!confirm('Hapus PERMANEN pesanan ini? Tidak bisa di-undo!')) return;
    if (!confirm('Yakin BANGET? Data akan hilang dari database selamanya.')) return;
    try {
      await api.delete(`/orders/${id}/permanent`);
      toast.success('Pesanan dihapus permanen');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const ProofButton = ({ order }: { order: any }) =>
    order.paymentProof ? (
      <button className="btn btn-sm btn-secondary" onClick={() => setProofModal(order)}>
        👁️ Lihat Bukti
      </button>
    ) : null;

  const orders = filter ? allOrders.filter((o) => o.status === filter) : allOrders;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Kelola Pesanan</h1>
        <p>Konfirmasi, verifikasi, kirim, atau tolak & hapus pesanan</p>
      </div>
      <div className="page-content">
        <div className="filter-bar" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`btn btn-outline btn-sm${filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat pesanan...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📦</div><h3>Tidak ada pesanan</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map((o) => (
              <div key={o.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      #{String(o.id).padStart(4, '0')} • {formatDate(o.createdAt)}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                      {o.user.fullName}
                      <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}> ({o.user.email})</span>
                    </div>
                  </div>
                  <span className={`badge badge-${statusBadge(o.status)}`}>{statusLabel(o.status)}</span>
                </div>

                {/* TIMELINE PROGRESS ADMIN */}
                <OrderProgress status={o.status} variant="admin" />

                <div style={{ background: 'rgba(140,100,60,0.05)', padding: 10, borderRadius: 8, margin: '10px 0', fontSize: 13 }}>
                  {o.items.map((i: any) => (
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
                  📅 {formatDate(o.eventDate)} &nbsp;|&nbsp; 📍 {o.eventAddress}
                  {o.paymentMethod ? ` | 💳 ${o.paymentMethod}` : ''}
                </div>

                <div className="admin-actions">
                  {o.status === 'PENDING' && (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => act(o.id, 'confirm')}>✅ Konfirmasi</button>
                      <button className="btn btn-sm btn-danger" onClick={() => reject(o.id)}>❌ Tolak</button>
                    </>
                  )}
                  {o.status === 'WAITING_PAYMENT' && (
                    <>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Menunggu user bayar...</span>
                      <button className="btn btn-sm btn-danger" onClick={() => reject(o.id)}>❌ Tolak</button>
                    </>
                  )}
                  {o.status === 'PAYMENT_REVIEW' && (
                    <>
                      <ProofButton order={o} />
                      <button className="btn btn-sm btn-success" onClick={() => act(o.id, 'verify-payment')}>💰 Verifikasi Bayar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => reject(o.id)}>❌ Tolak</button>
                    </>
                  )}
                  {o.status === 'PAID' && (
                    <>
                      <ProofButton order={o} />
                      <Link href={`/receipt/${o.id}`} target="_blank" className="btn btn-sm btn-receipt">🧾 Struk</Link>
                      <button className="btn btn-sm btn-primary" onClick={() => act(o.id, 'deliver')}>🚚 Kirim Pesanan</button>
                    </>
                  )}
                  {o.status === 'DELIVERING' && (
                    <>
                      <ProofButton order={o} />
                      <Link href={`/receipt/${o.id}`} target="_blank" className="btn btn-sm btn-receipt">🧾 Struk</Link>
                      <button className="btn btn-sm btn-success" onClick={() => act(o.id, 'complete')}>🎉 Tandai Sampai</button>
                    </>
                  )}
                  {(o.status === 'DELIVERED' || o.status === 'COMPLETED') && (
                    <>
                      <ProofButton order={o} />
                      <Link href={`/receipt/${o.id}`} target="_blank" className="btn btn-sm btn-receipt">🧾 Struk</Link>
                      <span style={{ fontSize: 12, color: 'var(--success)', alignSelf: 'center' }}>Selesai ✅</span>
                    </>
                  )}
                  {o.status === 'CANCELLED' && (
                    <>
                      <ProofButton order={o} />
                      <button className="btn btn-sm btn-danger" onClick={() => permDelete(o.id)}>🗑️ Hapus Permanen</button>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Dibatalkan</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`modal-overlay${proofModal ? ' active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setProofModal(null); }}>
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">Bukti Pembayaran</h3>
            <button className="modal-close" onClick={() => setProofModal(null)}>×</button>
          </div>
          {proofModal && (
            <div style={{ textAlign: 'center' }}>
              {proofModal.paymentProof ? (
                <img src={proofModal.paymentProof} alt="Bukti" style={{ maxWidth: '100%', borderRadius: 8 }} />
              ) : (
                <p style={{ color: 'var(--text-medium)' }}>Tidak ada bukti transfer (kemungkinan COD)</p>
              )}
              <div style={{ marginTop: 12, color: 'var(--text-medium)' }}>Metode: {proofModal.paymentMethod || '-'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}