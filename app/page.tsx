"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/helpers";
import { useScrollReveal, useCounterAnimation } from "@/hooks/useScrollReveal";
import Portfolio from "@/components/Portofolio";

const WA_NUMBER = "6281234567890";
const WA_MSG = encodeURIComponent(
  "Halo Dapur Kita! Saya tertarik dengan layanan catering. Boleh info lebih lanjut?",
);
const waLink = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

interface Pkg {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  category?: { name: string };
}

export default function HomePage() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useScrollReveal();
  useCounterAnimation();

  useEffect(() => {
    api
      .get<Pkg[]>("/packages")
      .then((data) => {
        setPackages((data || []).filter((p) => p.isActive).slice(0, 8));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">
        <section className="hero-own">
          <div className="hero-own-left">
            <h1>
              Temukan Catering <span className="accent">Lezat & Higienis</span>{" "}
              untuk Acaramu
            </h1>
            <p>
              Pesan paket catering untuk pernikahan, kantor, arisan, dan acara
              spesial lainnya. Mudah, cepat, dan tepat waktu.
            </p>
            <div className="hero-search">
              <span style={{ fontSize: 18 }}>🔍</span>
              <input
                type="text"
                placeholder="Cari paket catering favoritmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/menu?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              />
              <Link
                href={
                  searchQuery.trim()
                    ? `/menu?search=${encodeURIComponent(searchQuery.trim())}`
                    : "/menu"
                }
                className="btn btn-primary"
              >
                Cari Sekarang
              </Link>
            </div>
          </div>
          <div className="hero-own-right">
            <img
              src="https://catering.jagarasa.id/wp-content/uploads/2023/10/catering-pernikahan021.jpg"
              alt="Catering Dapur Kita"
            />
          </div>
        </section>
      </div>

      <div className="marquee">
        <div className="marquee-inner">
          <span>● DAPUR KITA CATERING</span>
          <span>● HALAL & HIGIENIS</span>
          <span>● LAYANAN TERPERCAYA</span>
          <span>● PENGIRIMAN TEPAT WAKTU</span>
          <span>● DAPUR KITA CATERING</span>
          <span>● HALAL & HIGIENIS</span>
          <span>● LAYANAN TERPERCAYA</span>
          <span>● PENGIRIMAN TEPAT WAKTU</span>
        </div>
      </div>

      <div className="container">
        <div className="stats-section reveal">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-number">
              <span data-count="1250">0</span>+
            </div>
            <div className="stat-label">Pesanan Selesai</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">
              <span data-count="98">0</span>%
            </div>
            <div className="stat-label">Pelanggan Puas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🍱</div>
            <div className="stat-number">
              <span data-count="50">0</span>+
            </div>
            <div className="stat-label">Menu Tersedia</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">
              <span data-count="8">0</span>
            </div>
            <div className="stat-label">Tahun Pengalaman</div>
          </div>
        </div>

        <section className="section" id="tentang">
          <h2 className="section-title reveal">Layanan Kami</h2>
          <p className="section-subtitle reveal">
            Pilih layanan catering sesuai kebutuhan acaramu
          </p>
          <div className="feat-grid">
            <div className="feat-card reveal">
              <div className="feat-icon">🚚</div>
              <h3>Pengiriman Cepat</h3>
              <p>
                Pesanan diantar tepat waktu ke lokasi acaramu, tidak pernah
                terlambat.
              </p>
              <Link href="/menu" className="btn btn-primary btn-sm">
                Lihat Paket
              </Link>
            </div>
            <div className="feat-card reveal reveal-delay-1">
              <div className="feat-icon">🍽️</div>
              <h3>Catering Acara</h3>
              <p>
                Paket lengkap untuk pernikahan, kantor, arisan, dan acara besar
                lainnya.
              </p>
              <Link href="/menu" className="btn btn-primary btn-sm">
                Lihat Paket
              </Link>
            </div>
            <div className="feat-card reveal reveal-delay-2">
              <div className="feat-icon">✨</div>
              <h3>Bahan Berkualitas</h3>
              <p>
                Bahan segar pilihan, diolah higienis dengan standar sanitasi
                tinggi.
              </p>
              <Link href="/menu" className="btn btn-primary btn-sm">
                Lihat Paket
              </Link>
            </div>
          </div>
        </section>

        <section className="section" id="paket">
          <h2 className="section-title reveal">Paket Pilihan Kami</h2>
          <p className="section-subtitle reveal">
            Paket favorit yang paling sering dipesan pelanggan
          </p>

          {loading ? (
            <div className="loading">
              <span className="spinner"></span>
              Memuat paket...
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3>Gagal memuat paket</h3>
              <p>Pastikan backend berjalan. Error: {error}</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍱</div>
              <h3>Belum ada paket tersedia</h3>
            </div>
          ) : (
            <div className="packages-grid">
              {packages.map((p, i) => (
                <div
                  key={p.id}
                  className={`package-card meal-card reveal reveal-delay-${(i % 3) + 1}`}
                >
                  <div
                    className="package-image"
                    style={
                      p.imageUrl
                        ? { backgroundImage: `url('${p.imageUrl}')` }
                        : {}
                    }
                  />
                  <div className="package-body">
                    <div className="package-category">
                      {p.category?.name || ""}
                    </div>
                    <h3 className="package-title">{p.name}</h3>
                    <div className="meal-rating">
                      ★★★★★{" "}
                      <span style={{ color: "#8aa3ac" }}>(120 ulasan)</span>
                    </div>
                    <p className="package-desc">{p.description}</p>
                    <div className="package-meta">
                      <div className="meal-price">{formatRupiah(p.price)}</div>
                      <div className="package-stock">Stok: {p.stock}</div>
                    </div>
                    <div className="package-actions">
                      <Link
                        href={`/menu/${p.id}`}
                        className="btn btn-primary btn-sm btn-block"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{ textAlign: "center", marginTop: 40 }}
            className="reveal"
          >
            <Link href="/menu" className="btn btn-primary btn-lg">
              LIHAT SEMUA MENU
            </Link>
          </div>
        </section>

        <Portfolio />

        {/* ===== TESTIMONIAL ===== */}
        <section className="section">
          <h2 className="section-title reveal">Apa Kata Mereka</h2>
          <p className="section-subtitle reveal">
            Pengalaman pelanggan menggunakan layanan Dapur Kita
          </p>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal-left">
              <div className="testimonial-avatar">B</div>
              <p className="testimonial-text">
                "Makanan sangat enak dan tepat waktu. Pelayanannya ramah."
              </p>
              <div className="testimonial-name">Budi Santoso</div>
              <div className="testimonial-event">Acara Syukuran Kantor</div>
            </div>
            <div className="testimonial-card reveal">
              <div className="testimonial-avatar">R</div>
              <p className="testimonial-text">
                "Rasanya juara! Tamu acara saya pada minta nambah."
              </p>
              <div className="testimonial-name">Roni Wijaya</div>
              <div className="testimonial-event">Ulang Tahun Anak</div>
            </div>
            <div className="testimonial-card reveal-right">
              <div className="testimonial-avatar">E</div>
              <p className="testimonial-text">
                "Admin gercep, harga oke. Recommended buat acara apapun."
              </p>
              <div className="testimonial-name">Eka Agustina</div>
              <div className="testimonial-event">Arisan</div>
            </div>
          </div>
        </section>

        {/* ===== LOKASI ===== */}
        <section className="section" id="lokasi">
          <h2 className="section-title reveal">Lokasi Kami</h2>
          <p className="section-subtitle reveal">
            Kunjungi dapur kami atau hubungi untuk konsultasi acara
          </p>
          <div className="map-wrap reveal">
            <iframe
              src="https://www.google.com/maps?q=Malang,Jawa+Timur&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>

      <Footer />

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        title="Chat WhatsApp"
      >
        💬
      </a>
    </>
  );
}
