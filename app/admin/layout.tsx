'use client';

import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAdmin>
      <Navbar admin />
      <div>{children}</div>
    </AuthGuard>
  );
}
