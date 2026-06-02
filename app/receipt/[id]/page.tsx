'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { formatRupiah, formatDate, statusLabel, statusBadge } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
  eventDate: string;
  eventAddress: string;
  createdAt: string;
  user: { fullName: string; email: string };
  items: Array<{ id: number; quantity: number; subtotal: number; package: { name: string } }>;
}

export default function ReceiptPage() {
  const params = useParams();
  const toast = useToast();
  const id = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<Order>(`/orders/${id}`)
      .then(setOrder)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPdf = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, jsPDFMod] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const jsPDF = (jsPDFMod as any).jsPDF || (jsPDFMod as any).default;

      const el = document.getElementById('receiptCard');
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const w = canvas.width * ratio * 0.85;
      const h = canvas.height * ratio * 0.85;
      const x = (pdfWidth - w) / 2;
      pdf.addImage(imgData, 'PNG', x, 15, w, h);
      pdf.save(`Struk-DapurKita-${String(order.id).padStart(4, '0')}.pdf`);
      toast.success('Struk berhasil diunduh!');
    } catch (err: any) {
      toast.error('Gagal mengunduh: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Link href="/orders" style={{ color: 'var(--text-muted)' }}>← Kembali ke pesanan</Link>
        </div>

        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat struk...</div>
        ) : !order ? (
          <div className="empty-state"><h3>Struk tidak ditemukan</h3></div>
        ) : (
          <>
            <div
              id="receiptCard"
              style={{
                maxWidth: 420,
                margin: '0 auto',
                background: 'white',
                color: '#2d2d2d',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ background: 'linear-gradient(135deg, #8b5a2b 0%, #6d4520 100%)', color: 'white', padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>
                  DAPUR <span style={{ color: '#f5cd7a' }}>KITA</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Catering Modern & Terpercaya</div>
                <div style={{ marginTop: 12, fontSize: 28 }}>🧾</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>STRUK PEMBELIAN</div>
              </div>

              <div style={{ padding: 28, background: 'white' }}>
                <Row label="No. Pesanan" value={<strong>#{String(order.id).padStart(4, '0')}</strong>} />
                <Row label="Tanggal" value={formatDate(order.createdAt)} />
                <Row label="Pelanggan" value={order.user.fullName} />
                <Row label="Status" value={<span className={`badge badge-${statusBadge(order.status)}`}>{statusLabel(order.status)}</span>} />
                <hr style={{ border: 'none', borderTop: '2px dashed #ddd', margin: '16px 0' }} />
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>DETAIL PESANAN</div>
                {order.items.map((i) => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                    <span>{i.package.name} × {i.quantity}</span>
                    <span>{formatRupiah(i.subtotal)}</span>
                  </div>
                ))}
                <hr style={{ border: 'none', borderTop: '2px dashed #ddd', margin: '16px 0' }} />
                <Row label="TOTAL" value={<span style={{ color: '#8b5a2b' }}>{formatRupiah(order.totalAmount)}</span>} big />
                <hr style={{ border: 'none', borderTop: '2px dashed #ddd', margin: '16px 0' }} />
                <Row label="Metode Bayar" value={<strong>{order.paymentMethod || '-'}</strong>} />
                {order.paidAt && <Row label="Dibayar" value={formatDate(order.paidAt)} />}
                <Row label="Acara" value={formatDate(order.eventDate)} />
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>📍 {order.eventAddress}</div>
                <hr style={{ border: 'none', borderTop: '2px dashed #ddd', margin: '16px 0' }} />
                <div style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>
                  Terima kasih telah memesan di Dapur Kita! 🍱w
                  <br />
                  Simpan struk ini sebagai bukti pembayaran.
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button className="btn btn-receipt" onClick={downloadPdf} disabled={downloading}>
                {downloading ? <><span className="spinner"></span> Memproses PDF...</> : '📥 Unduh Struk PDF'}
              </button>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}

function Row({ label, value, big }: { label: string; value: React.ReactNode; big?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      fontSize: big ? 18 : 14,
      fontWeight: big ? 800 : 400,
    }}>
      <span style={{ color: big ? undefined : '#888' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
