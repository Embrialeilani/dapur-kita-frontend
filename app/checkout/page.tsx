'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { formatRupiah, getCart, clearCart, cartTotal, CartItem } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    eventDate: '',
    eventAddress: '',
    paymentMethod: 'Transfer Bank',
    notes: '',
  });

  useEffect(() => {
    const c = getCart();
    if (c.length === 0) {
      toast.error('Keranjang kosong');
      router.push('/menu');
      return;
    }
    setCart(c);
  }, []);

  const total = cartTotal(cart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items = cart.map((c) => ({ packageId: c.packageId, quantity: c.quantity }));
      const data: any = await api.post('/orders', {
        items,
        eventDate: form.eventDate,
        eventAddress: form.eventAddress,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      clearCart();
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Pesanan berhasil dibuat!');
      setTimeout(() => router.push('/orders'), 600);
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat pesanan');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <AuthGuard>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Checkout Pesanan</h1>
          <p>Lengkapi detail acara, pesanan akan diproses oleh admin</p>
        </div>
        <div className="page-content">
          <div className="checkout-grid">
            <form onSubmit={handleSubmit} className="card" style={{ background: 'var(--cream)' }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>Detail Acara</h3>
              <div className="form-group">
                <label className="form-label">Tanggal Acara *</label>
                <input className="form-input" type="datetime-local" name="eventDate"
                  value={form.eventDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Alamat Pengiriman *</label>
                <textarea className="form-input" name="eventAddress" rows={3}
                  placeholder="Alamat lengkap lokasi acara"
                  value={form.eventAddress} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Metode Pembayaran *</label>
                <select className="form-input" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  <option>Transfer Bank</option>
                  <option>QRIS</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Catatan (opsional)</label>
                <textarea className="form-input" name="notes" rows={2}
                  placeholder="Tambahan permintaan atau catatan untuk admin"
                  value={form.notes} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? <><span className="spinner"></span> Memproses...</> : 'BUAT PESANAN'}
              </button>
            </form>

            <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary-dark)' }}>Ringkasan Pesanan</h3>
              {cart.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.quantity} × {formatRupiah(c.price)}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{formatRupiah(c.price * c.quantity)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontSize: 20, fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatRupiah(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
