'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { getUser, isLoggedIn, logout, User } from '@/lib/auth';
import { getCart } from '@/lib/helpers';

interface NavbarProps {
  admin?: boolean; // kalau di admin section, tampilan beda dikit
}

export default function Navbar({ admin = false }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
    setLoggedIn(isLoggedIn());
    const cart = getCart();
    setCartCount(cart.reduce((s, i) => s + i.quantity, 0));

    // Update cart count saat ada perubahan localStorage
    const handler = () => {
      const c = getCart();
      setCartCount(c.reduce((s, i) => s + i.quantity, 0));
    };
    window.addEventListener('storage', handler);
    window.addEventListener('cart-updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('cart-updated', handler);
    };
  }, [pathname]);


  const handleLogout = () => {
    if (confirm('Yakin mau logout?')) logout();
  };

  if (!mounted) {
    // Render shell sederhana saat SSR untuk menghindari hydration mismatch
    return (
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="navbar-brand">
            <Logo />
            <span className="brand-text">
              DAPUR<span className="brand-accent">KITA</span>
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  if (admin) {
    return (
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="navbar-brand">
            <Logo />
            <span className="brand-text">
              DAPUR<span className="brand-accent">KITA</span>
            </span>
            <small style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 500, marginLeft: 6 }}>ADMIN</small>
          </Link>
          <ul className="navbar-menu">
            <li><Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>DASHBOARD</Link></li>
            <li><Link href="/admin/categories" className={pathname === '/admin/categories' ? 'active' : ''}>KATEGORI</Link></li>
            <li><Link href="/admin/packages" className={pathname === '/admin/packages' ? 'active' : ''}>PAKET</Link></li>
            <li><Link href="/admin/orders" className={pathname === '/admin/orders' ? 'active' : ''}>PESANAN</Link></li>
            <li><Link href="/admin/users" className={pathname === '/admin/users' ? 'active' : ''}>USERS</Link></li>
          </ul>
          <div className="navbar-actions">
            {user && (
              <span className="navbar-user">
                {user.fullName} <span className="role">{user.role}</span>
              </span>
            )}
            <Link href="/" className="btn btn-outline btn-sm">SITE</Link>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <Logo />
          <span className="brand-text">
            DAPUR<span className="brand-accent">KITA</span>
          </span>
        </Link>
        <ul className="navbar-menu">
          <li><Link href="/" className={pathname === '/' ? 'active' : ''}>HOME</Link></li>
          <li><Link href="/menu" className={pathname?.startsWith('/menu') ? 'active' : ''}>PAKET</Link></li>
          <li><Link href="/#portfolio">PORTFOLIO</Link></li>
          <li><Link href="/#tentang">TENTANG</Link></li>
          <li><Link href="/#lokasi">LOKASI</Link></li>
          {loggedIn && <li><Link href="/orders" className={pathname === '/orders' ? 'active' : ''}>PESANAN</Link></li>}
          {user?.role === 'ADMIN' && <li><Link href="/admin">ADMIN</Link></li>}
        </ul>
        <div className="navbar-actions">
          {loggedIn && user && (
            <span className="navbar-user">
              Halo, {user.fullName} <span className="role">{user.role}</span>
            </span>
          )}
          {user?.role === 'USER' && (
            <Link href="/cart" className="btn btn-outline btn-sm">
              🛒 {cartCount}
            </Link>
          )}
          {!loggedIn && <Link href="/login" className="btn btn-outline btn-sm">LOGIN</Link>}
          {!loggedIn && <Link href="/register" className="btn btn-primary btn-sm">SIGN UP</Link>}
          {loggedIn && (
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              LOGOUT
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
