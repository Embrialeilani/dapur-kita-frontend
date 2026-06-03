'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { getUser, isLoggedIn, logout, User } from '@/lib/auth';
import { getCart } from '@/lib/helpers';

interface NavbarProps {
  admin?: boolean;
}

export default function Navbar({ admin = false }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
    setLoggedIn(isLoggedIn());
    const cart = getCart();
    setCartCount(cart.reduce((s, i) => s + i.quantity, 0));

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }
    const sections = ['portfolio', 'tentang', 'lokasi'];
    const handleScroll = () => {
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    if (confirm('Yakin mau logout?')) logout();
  };

  const closeMenu = () => setMenuOpen(false);

  if (!mounted) {
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

          <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>

          <div className={`navbar-collapse${menuOpen ? ' open' : ''}`}>
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
              <Link href="/" className="btn btn-outline btn-sm" onClick={closeMenu}>SITE</Link>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>LOGOUT</button>
            </div>
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

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-collapse${menuOpen ? ' open' : ''}`}>
          <ul className="navbar-menu">
            <li><Link href="/" className={pathname === '/' && activeSection === '' ? 'active' : ''}>HOME</Link></li>
            <li><Link href="/menu" className={pathname?.startsWith('/menu') ? 'active' : ''}>PAKET</Link></li>
            <li><Link href="/#portfolio" className={activeSection === 'portfolio' ? 'active' : ''}>PORTFOLIO</Link></li>
            <li><Link href="/#tentang" className={activeSection === 'tentang' ? 'active' : ''}>TENTANG</Link></li>
            <li><Link href="/#lokasi" className={activeSection === 'lokasi' ? 'active' : ''}>LOKASI</Link></li>
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
              <Link href="/cart" className="btn btn-outline btn-sm" onClick={closeMenu}>
                🛒 {cartCount}
              </Link>
            )}
            {!loggedIn && <Link href="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>LOGIN</Link>}
            {!loggedIn && <Link href="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>SIGN UP</Link>}
            {loggedIn && (
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}