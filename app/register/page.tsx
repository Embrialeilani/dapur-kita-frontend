'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const toast  = useToast();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isLoggedIn()) router.replace('/');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Password dan konfirmasi tidak sama');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/signup', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success('Registrasi berhasil! Silakan login dengan akun barumu 🎉');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      toast.error(err.message || 'Registrasi gagal, coba lagi');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual register-bg">
          <div className="auth-visual-content">
            <div className="auth-tag">JOIN US</div>
            <h1>SIGN UP</h1>
            <p>Daftarkan akun sekarang dan mulai pesan paket catering favoritmu.</p>
          </div>
          <Link href="/" className="auth-back">← Kembali ke beranda</Link>
        </div>

        <div className="auth-form-side">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Isi form di bawah untuk membuat akun baru</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input className="form-input" type="text" name="fullName"
                placeholder="Nama lengkap kamu"
                value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email"
                placeholder="email@contoh.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" name="password"
                placeholder="Minimal 6 karakter"
                value={form.password} onChange={handleChange}
                required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Konfirmasi Password *</label>
              <input className="form-input" type="password" name="confirmPassword"
                placeholder="Ketik ulang password"
                value={form.confirmPassword} onChange={handleChange}
                required minLength={6} />
            </div>

            <button type="submit" className="btn btn-primary btn-block"
              disabled={loading}>
              {loading
                ? <><span className="spinner"></span> Sedang Mendaftar...</>
                : 'DAFTAR SEKARANG'}
            </button>
          </form>

          <div className="auth-footer">
            Sudah punya akun? <Link href="/login">Login di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
}