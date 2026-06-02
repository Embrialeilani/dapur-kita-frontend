'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveAuth, isLoggedIn, getUser } from '@/lib/auth';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pendingEmail, setPendingEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const u = getUser();
      router.replace(u?.role === 'ADMIN' ? '/admin' : '/');
    }
  }, [router]);

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: any = await api.post('/auth/login', { email, password });
      setPendingEmail(data.email);
      setOtpCode(data.otp);
      setStep('otp');
      toast.success('Kode verifikasi telah dibuat. Cek kode di bawah.');
    } catch (err: any) {
      toast.error(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const data: any = await api.post('/auth/verify-otp', { email: pendingEmail, otp: otpInput });
      saveAuth(data.access_token, data.user);
      toast.success('Verifikasi berhasil! Selamat datang 🎉');
      setTimeout(() => {
        router.push(data.user.role === 'ADMIN' ? '/admin' : '/');
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || 'Kode OTP salah');
      setVerifying(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual login-bg">
          <div className="auth-visual-content">
            <div className="auth-tag">WELCOME BACK</div>
            <h1>LOGIN</h1>
            <p>Nikmati kemudahan memesan catering dengan layanan cepat, lezat, dan terpercaya.</p>
          </div>
           <Link href="/" className="auth-back">← Kembali ke beranda</Link>
        </div>

        <div className="auth-form-side">
          {step === 'login' ? (
            <>
              <h2 className="auth-title">Welcome</h2>
              <p className="auth-subtitle">Sign in to continue your journey</p>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password</label>
                  <div className="input-with-action">
                    <input
                      className="form-input"
                      type={showPass ? 'text' : 'password'}
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button type="button" className="input-action" onClick={() => setShowPass(!showPass)}>
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? <><span className="spinner"></span> Loading...</> : 'LOGIN'}
                </button>
              </form>
              <div className="auth-footer">
                Don&apos;t have an account?
                <Link href="/register">Sign Up</Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="auth-title">Verifikasi Identitas</h2>
              <p className="auth-subtitle">
                Demi keamanan akun, masukkan kode verifikasi yang telah dikirim ke <strong>{pendingEmail}</strong>
              </p>

              <div className="otp-info-card">
                <div className="otp-info-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#8b5a2b" />
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="otp-info-content">
                  <div className="otp-info-label">KODE VERIFIKASI</div>
                  <div className="otp-code-display">{otpCode}</div>
                  <div className="otp-info-meta">
                    <span className="demo-badge">DEMO</span>
                    <span>Berlaku 5 menit</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerify} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="otpInput">Masukkan 6 Digit Kode</label>
                  <input
                    className="form-input otp-input"
                    type="text"
                    id="otpInput"
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={verifying}>
                  {verifying ? <><span className="spinner"></span> Verifikasi...</> : 'VERIFIKASI'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  style={{ marginTop: 10 }}
                  onClick={() => { setStep('login'); setOtpInput(''); }}
                >
                  ← Kembali
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
