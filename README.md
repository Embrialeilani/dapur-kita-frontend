# 🚀 PANDUAN SETUP FRONTEND NEXT.JS — DAPUR KITA
## Untuk Teman Frontend (dari nol sampai jalan)

---

## 🎯 APA INI?

Ini adalah frontend **Dapur Kita** yang dibuat dengan **Next.js 14** (React framework modern).  
Sudah terhubung ke backend NestJS yang berjalan di Railway — artinya data langsung masuk ke database online, bukan hanya di localhost.

```
Frontend (Next.js)  ──API calls──▶  Backend NestJS (Railway)  ──▶  Database MySQL (Railway)
http://localhost:3000              https://catering-backend.up.railway.app
```

---

## 📦 YANG PERLU DIINSTALL DULU

### 1. Node.js (wajib)
- Download: https://nodejs.org → pilih versi **LTS**
- Cek: buka terminal → `node -v` → harus muncul `v18.x.x` atau lebih baru

### 2. VS Code (editor)
- Download: https://code.visualstudio.com
- Install extension: **ES7+ React/Redux/React-Native snippets**

### 3. Git (opsional tapi bagus)
- Download: https://git-scm.com

---

## 🔥 CARA MENJALANKAN (step-by-step)

### Step 1 — Extract ZIP

Extract `catering-nextjs.zip` ke folder yang mudah diakses.  
Contoh: `D:\projects\catering-nextjs`

### Step 2 — Buka di VS Code

```
File → Open Folder → pilih folder catering-nextjs
```

### Step 3 — Cek file `.env.local`

Di root folder, pastikan ada file **`.env.local`** dengan isi:
```
NEXT_PUBLIC_API_URL=https://catering-backend-production-220d.up.railway.app
```

> ⚠️ Kalau URL Railway backend berbeda, minta URL dari teman backend dan ganti di sini.  
> Kalau mau test dengan backend lokal: ganti jadi `http://localhost:3000`

### Step 4 — Install Dependencies

Buka terminal di VS Code (Ctrl + backtick) lalu jalankan:
```bash
npm install
```

Tunggu 2-5 menit. Akan muncul folder `node_modules`.

### Step 5 — Jalankan Dev Server

```bash
npm run dev
```

Output yang muncul:
```
▲ Next.js 14.2.5
- Local: http://localhost:3000
- Ready in 2.1s
```

Buka browser ke **http://localhost:3000** → Website Dapur Kita muncul! 🎉

---

## 🗂️ STRUKTUR PROJECT

```
catering-nextjs/
│
├── app/                    ← Semua halaman (Next.js App Router)
│   ├── page.tsx            ← Home /
│   ├── login/page.tsx      ← /login
│   ├── register/page.tsx   ← /register
│   ├── menu/
│   │   ├── page.tsx        ← /menu (daftar paket)
│   │   └── [id]/page.tsx   ← /menu/1 (detail paket)
│   ├── cart/page.tsx       ← /cart
│   ├── checkout/page.tsx   ← /checkout
│   ├── orders/page.tsx     ← /orders
│   ├── payment/[id]/       ← /payment/1
│   ├── receipt/[id]/       ← /receipt/1
│   ├── profile/page.tsx    ← /profile
│   ├── admin/
│   │   ├── page.tsx        ← /admin (dashboard)
│   │   ├── categories/     ← /admin/categories
│   │   ├── packages/       ← /admin/packages
│   │   ├── orders/         ← /admin/orders
│   │   └── users/          ← /admin/users
│   ├── globals.css         ← CSS global (style utama)
│   └── layout.tsx          ← Root layout
│
├── components/             ← Komponen yang dipakai ulang
│   ├── Navbar.tsx          ← Navbar dengan role-based menu
│   ├── Footer.tsx          ← Footer
│   ├── Logo.tsx            ← Logo SVG Dapur Kita
│   ├── Toast.tsx           ← Notifikasi (success/error)
│   └── AuthGuard.tsx       ← Proteksi halaman (cek login)
│
├── lib/                    ← Utilitas & helpers
│   ├── config.ts           ← BASE_API_URL (dari env variable)
│   ├── api.ts              ← Fetch wrapper ke Railway API
│   ├── auth.ts             ← Auth helpers (localStorage)
│   └── helpers.ts          ← Format rupiah, status, cart
│
├── .env.local              ← ⚠️ PENTING: URL backend Railway
├── .env.example            ← Contoh env variable
├── next.config.js          ← Config Next.js
├── package.json            ← Dependencies
└── tsconfig.json           ← TypeScript config
```

---

## ⚙️ CARA KERJA KONEKSI KE BACKEND

Semua request ke backend melewati `lib/api.ts`:

```typescript
// lib/config.ts
export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// lib/api.ts - contoh request
const url = `${BASE_API_URL}/packages`;  // ← seperti contoh kamu!
const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
```

Jadi kalau `.env.local` berisi:
```
NEXT_PUBLIC_API_URL=https://catering-backend-production-220d.up.railway.app
```

Maka setiap request akan ke Railway, bukan localhost. **Data langsung masuk database Railway.** ✅

---

## 👤 AKUN DEFAULT (Seed dari Backend)

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@catering.com | admin123 |
| USER | user@catering.com | user123 |

---

## 🧪 TEST ALUR TRANSAKSI LENGKAP

1. **Login user** (`user@catering.com`) → masukkan OTP yang ditampilkan
2. **Menu** → pilih paket → **Tambah ke Keranjang**
3. **Cart** → **Checkout** → isi tanggal & alamat
4. **Login admin** (tab/browser lain: `admin@catering.com`)
5. **Admin → Pesanan** → klik **✅ Konfirmasi**
6. **Kembali user** → **Pesanan Saya** → klik **💳 BAYAR SEKARANG**
7. Pilih Transfer Bank → upload gambar (foto apa saja) → **Konfirmasi Pembayaran**
8. **Admin** → filter "Verifikasi Bayar" → **👁️ Lihat Bukti** → **💰 Verifikasi Bayar**
9. **User** → **🧾 Lihat Struk** → **📥 Unduh Struk PDF**
10. **Admin** → **🚚 Kirim Pesanan** → **🎉 Tandai Sampai**

---

## 🌐 DEPLOY KE VERCEL (Gratis, Paling Mudah)

### Cara paling cepat:

1. Push project ke GitHub (lihat di bawah)
2. Buka https://vercel.com → Login pakai GitHub
3. **Add New Project** → Import repo `catering-nextjs`
4. Di **Environment Variables**, tambah:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://catering-backend-production-220d.up.railway.app`
5. Klik **Deploy** → URL siap! 🎉

### Push ke GitHub:

```bash
# Di folder catering-nextjs
git init
git add .
git commit -m "Initial: Dapur Kita Next.js frontend"
git branch -M main
git remote add origin https://github.com/username/catering-nextjs.git
git push -u origin main
```

---

## ✏️ CARA EDIT HALAMAN

Setiap file di folder `app/` adalah halaman. Contoh:

- Mau ubah home page → edit `app/page.tsx`
- Mau ubah tampilan login → edit `app/login/page.tsx`  
- Mau ubah style → edit `app/globals.css`

Setelah simpan, Next.js **auto-refresh** browser (Hot Module Replacement).

---

## 🆘 TROUBLESHOOTING

### Error saat `npm install`
```
npm cache clean --force
npm install
```

### "NEXT_PUBLIC_API_URL not found"
Pastikan file `.env.local` ada di root folder (bukan di dalam folder lain).

### Paket tidak muncul di home / halaman kosong
1. Buka browser console (F12 → Console)
2. Kalau ada error `Failed to fetch` → backend Railway mungkin down
3. Cek: buka URL Railway di browser, kalau tidak respond → minta teman backend cek

### CORS error di console
Backend perlu enable CORS. Minta teman backend cek `src/main.ts`:
```typescript
app.enableCors(); // harus ada di backend
```

### Build error saat `npm run build`
```
npm run build 2>&1 | head -50
```
Screenshot error, minta bantuan teman.

### Halaman admin tidak bisa diakses
Pastikan login dengan akun ADMIN (`admin@catering.com`).  
Token disimpan di localStorage — kalau expired, logout dan login ulang.

---

## 📝 CATATAN TAMBAHAN

- Nomor WhatsApp di home page perlu diganti — cari `const WA_NUMBER = '6281234567890'` di `app/page.tsx`
- localStorage yang dipakai: `dk_token`, `dk_user`, `dk_cart`
- PDF struk menggunakan library `html2canvas` + `jsPDF` (client-side)
- Foto bukti pembayaran dikonversi ke base64 dan disimpan di database (bukan upload file)

---

**Selamat ngoding! Kalau ada masalah, tanya teman backend. 🍱✨**
