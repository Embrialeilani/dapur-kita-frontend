'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  const toast = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(setUser)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Profil Saya</h1>
          <p>Informasi akun kamu</p>
        </div>
        <div className="page-content">
          {loading ? (
            <div className="loading"><span className="spinner"></span>Memuat...</div>
          ) : user ? (
            <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input className="form-input" value={user.fullName || ''} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user.email || ''} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input className="form-input" value={user.role || ''} disabled />
              </div>
            </div>
          ) : (
            <div className="empty-state"><h3>Gagal memuat profil</h3></div>
          )}
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}