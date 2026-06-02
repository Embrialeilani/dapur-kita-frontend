'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { isLoggedIn, isAdmin } from '@/lib/auth';
import { useToast } from '@/components/Toast';

interface GuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin: needAdmin = false }: GuardProps) {
  const router = useRouter();
  const toast = useToast();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      toast.error('Kamu harus login dulu untuk mengakses halaman ini.');
      setTimeout(() => router.replace('/login'), 1500);
      return;
    }
    if (needAdmin && !isAdmin()) {
      toast.error('Halaman ini khusus untuk admin.');
      setTimeout(() => router.replace('/'), 1500);
      return;
    }
    setOk(true);
  }, [router, needAdmin]);

  if (!ok) {
    return (
      <div className="container" style={{ padding: 60, textAlign: 'center' }}>
        <div className="loading"><span className="spinner"></span>Memuat...</div>
      </div>
    );
  }

  return <>{children}</>;
}