'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatRupiah, formatDate, statusLabel, statusBadge } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

const PAID_STATUSES = ['PAID', 'DELIVERING', 'DELIVERED', 'COMPLETED'];

export default function AdminDashboardPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0, pendingCount: 0, waitingPayCount: 0,
    inProgressCount: 0, completedCount: 0, totalPackages: 0,
    totalUsers: 0, revenue: 0, paidOrdersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/packages'),
      api.get('/users'),
    ])
      .then(([orders, packages, users]: any[]) => {
        const revenue = orders
          .filter((o: any) => PAID_STATUSES.includes(o.status))
          .reduce((s: number, o: any) => s + o.totalAmount, 0);

        setStats({
          totalOrders: orders.length,
          pendingCount: orders.filter((o: any) => o.status === 'PENDING').length,
          waitingPayCount: orders.filter((o: any) => ['WAITING_PAYMENT', 'PAYMENT_REVIEW'].includes(o.status)).length,
          inProgressCount: orders.filter((o: any) => ['PAID', 'DELIVERING'].includes(o.status)).length,
          completedCount: orders.filter((o: any) => ['DELIVERED', 'COMPLETED'].includes(o.status)).length,
          totalPackages: packages.length,
          totalUsers: users.length,
          revenue,
          paidOrdersCount: orders.filter((o: any) => PAID_STATUSES.includes(o.status)).length,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Dashboard Admin</h1>
        <p>Ringkasan kinerja catering Dapur Kita</p>
      </div>
      <div className="page-content">
        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <StatTile icon="📦" num={stats.totalOrders} label="Total Pesanan" badge={stats.pendingCount > 0 ? `${stats.pendingCount} PENDING` : undefined} />
              <StatTile icon="⏳" num={stats.waitingPayCount} label="Menunggu Pembayaran" />
              <StatTile icon="🚚" num={stats.inProgressCount} label="Diproses / Diantar" />
              <StatTile icon="✅" num={stats.completedCount} label="Pesanan Selesai" />
              <StatTile icon="🍱" num={stats.totalPackages} label="Total Paket" />
              <StatTile icon="👥" num={stats.totalUsers} label="Total User" />

              {/* Revenue card */}
              <div className="revenue-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ opacity: 0.85, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>💰 Total Pendapatan</div>
                    <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{formatRupiah(stats.revenue)}</div>
                    <div style={{ opacity: 0.9, marginTop: 8, fontSize: 13 }}>Dari {stats.paidOrdersCount} pesanan terbayar lunas</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '14px 18px', borderRadius: 12 }}>
                      <div style={{ fontSize: 12, opacity: 0.85 }}>Rata-rata per Pesanan</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                        {stats.paidOrdersCount > 0 ? formatRupiah(Math.round(stats.revenue / stats.paidOrdersCount)) : 'Rp 0'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: 40, marginBottom: 16, color: 'var(--primary-dark)' }}>Pesanan Terbaru</h3>
            {recentOrders.length === 0 ? (
              <div className="empty-state"><h3>Belum ada pesanan</h3></div>
            ) : (
              <>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr><th>ID</th><th>Pelanggan</th><th>Total</th><th>Status</th><th>Tanggal</th></tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.id}>
                          <td>#{String(o.id).padStart(4, '0')}</td>
                          <td>{o.user.fullName}</td>
                          <td><strong>{formatRupiah(o.totalAmount)}</strong></td>
                          <td><span className={`badge badge-${statusBadge(o.status)}`}>{statusLabel(o.status)}</span></td>
                          <td style={{ fontSize: 12, color: 'var(--text-medium)' }}>{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <Link href="/admin/orders" className="btn btn-outline btn-sm">Lihat Semua Pesanan →</Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatTile({ icon, num, label, badge }: { icon: string; num: number; label: string; badge?: string }) {
  return (
    <div className="card stat-tile">
      {badge && <span className="stat-tile-badge">{badge}</span>}
      <div className="stat-tile-icon">{icon}</div>
      <div className="stat-tile-num">{num.toLocaleString('id-ID')}</div>
      <div className="stat-tile-label">{label}</div>
    </div>
  );
}
