'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { formatRupiah, formatDate } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  eventDate: string;
  eventAddress: string;
  items: Array<{ id: number; quantity: number; subtotal: number; package: { name: string } }>;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [proofFile, setProofFile] = useState<string>('');
  const [proofPreview, setProofPreview] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get<Order>(`/orders/${id}`)
      .then((data) => {
        setOrder(data);
        if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
        if (data.status !== 'WAITING_PAYMENT') {
          toast.error('Pesanan tidak dalam status menunggu pembayaran');
          setTimeout(() => router.push('/orders'), 1500);
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File terlalu besar (max 5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProofFile(result);
      setProofPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (paymentMethod !== 'Cash on Delivery' && !proofFile) {
      toast.error('Upload bukti pembayaran dulu');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/orders/${id}/pay`, {
        paymentMethod,
        paymentProof: proofFile || undefined,
      });
      toast.success('Pembayaran berhasil dikirim, menunggu verifikasi admin');
      setTimeout(() => router.push('/orders'), 1000);
    } catch (err: any) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Pembayaran</h1>
          <p>Selesaikan pembayaran untuk memproses pesanan</p>
        </div>
        <div className="page-content">
          {loading ? (
            <div className="loading"><span className="spinner"></span>Memuat...</div>
          ) : !order ? (
            <div className="empty-state"><h3>Pesanan tidak ditemukan</h3></div>
          ) : (
            <div className="checkout-grid">
              <div className="card" style={{ background: 'var(--cream)' }}>
                <h3 style={{ marginTop: 0 }}>Detail Pembayaran</h3>
                <div className="form-group">
                  <label className="form-label">Metode Pembayaran</label>
                  <select className="form-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option>Transfer Bank</option>
                    <option>QRIS</option>
                    <option>Cash on Delivery</option>
                  </select>
                </div>

                {paymentMethod !== 'Cash on Delivery' && (
                  <>
                    <div className="card" style={{ background: 'white', marginBottom: 16 }}>
                      <h4 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>
                        {paymentMethod === 'Transfer Bank' ? '🏦 Transfer ke Rekening' : '📱 Scan QRIS'}
                      </h4>
                      {paymentMethod === 'Transfer Bank' ? (
                        <div style={{ fontSize: 14 }}>
                          <div><strong>BCA</strong> — 1234567890</div>
                          <div><strong>Mandiri</strong> — 1234567890</div>
                          <div><strong>BNI</strong> — 1234567890</div>
                          <div style={{ color: 'var(--text-muted)', marginTop: 8 }}>a/n Dapur Kita Catering</div>
                        </div>
                      ) : (
                       <div style={{ textAlign: 'center' }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=DapurKita-Order${order.id}-${order.totalAmount}`}
                            alt="QRIS Dapur Kita"
                            style={{ width: 220, height: 220, margin: '0 auto', borderRadius: 8 }}
                          />
                          <div style={{ marginTop: 10, fontWeight: 700, color: 'var(--primary-dark)' }}>
                            Dapur Kita Catering
                          </div>
                          <div style={{ marginTop: 4, color: 'var(--text-muted)', fontSize: 13 }}>
                            Scan dengan aplikasi mobile banking / e-wallet
                          </div>
                          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
                            {formatRupiah(order.totalAmount)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload Bukti Transfer *</label>
                      <input className="form-input" type="file" accept="image/*" onChange={handleFile} />
                      {proofPreview && (
                        <img src={proofPreview} alt="Bukti" style={{ marginTop: 12, maxWidth: '100%', borderRadius: 8 }} />
                      )}
                    </div>
                  </>
                )}

                <button className="btn btn-primary btn-block btn-lg" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <><span className="spinner"></span> Memproses...</> : '✅ KONFIRMASI PEMBAYARAN'}
                </button>
              </div>

              <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
                <h3 style={{ marginTop: 0 }}>Ringkasan Pesanan</h3>
                {order.items.map((i) => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border)' }}>
                    <span>{i.package.name} × {i.quantity}</span>
                    <span>{formatRupiah(i.subtotal)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 20, fontWeight: 700 }}>
                  <span>Total Bayar</span>
                  <span style={{ color: 'var(--primary)' }}>{formatRupiah(order.totalAmount)}</span>
                </div>
                <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  📅 {formatDate(order.eventDate)}<br />📍 {order.eventAddress}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
