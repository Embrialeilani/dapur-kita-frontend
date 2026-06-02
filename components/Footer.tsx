import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Mulai</h4>
            <ul>
              <li><Link href="/menu">Pesan Catering</Link></li>
              <li><Link href="/menu">Lihat Paket</Link></li>
              <li><Link href="/#tentang">Layanan</Link></li>
              <li><Link href="/orders">Pesanan Saya</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Kontak</h4>
            <ul>
              <li>+62 812-3456-7890</li>
              <li>info@dapurkita.com</li>
              <li>Malang, Jawa Timur</li>
              <li>Gedung Kuliner Lt. 1</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Tentang</h4>
            <ul>
              <li><Link href="/#tentang">Profil</Link></li>
              <li><Link href="/#portfolio">Portfolio</Link></li>
              <li><Link href="/#lokasi">Lokasi</Link></li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Ikuti Kami</h4>
            <ul>
              <li>Instagram @dapurkita.id</li>
              <li>Facebook Dapur Kita</li>
              <li>TikTok @dapurkita</li>
              <li>WhatsApp Business</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Dapur Kita. Hak Cipta Dilindungi.</div>
      </div>
    </footer>
  );
}