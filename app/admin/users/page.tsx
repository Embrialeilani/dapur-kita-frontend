'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

interface User { id: number; fullName: string; email: string; phone?: string; role: string; createdAt: string; }

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<User[]>('/users')
      .then(setUsers)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Kelola Users</h1>
        <p>Daftar semua pengguna yang terdaftar</p>
      </div>
      <div className="page-content">
        {loading ? (
          <div className="loading"><span className="spinner"></span>Memuat...</div>
        ) : users.length === 0 ? (
          <div className="empty-state"><h3>Belum ada user</h3></div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Nama</th><th>Email</th><th>Telepon</th><th>Role</th><th>Bergabung</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td><strong>{u.fullName}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      <span className={`badge badge-${u.role === 'ADMIN' ? 'info' : 'success'}`}>{u.role}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
