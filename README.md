# 💼 MyJobTrack - Pelacak Lamaran Kerja Modern

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**MyJobTrack** adalah aplikasi manajemen & pelacak lamaran kerja berbasis web yang responsif, cepat, dan aman. Dirancang untuk membantu pencari kerja mengorganisir alur lamaran, memantau tahapan seleksi, dan menganalisis performa pencarian kerja secara *real-time*.

---

## ✨ Fitur Utama

- 📊 **Dasbor Analitik Real-Time**
  - Ringkasan total lamaran, jumlah wawancara, penawaran kerja (*offer*), dan rasio respons secara langsung.
  - Pengingat agenda *Follow-up* dan daftar lamaran terbaru.

- 📝 **Manajemen Lamaran Kerja (CRUD)**
  - Tambah, edit, filter status/pencarian, dan hapus (soft-delete) lamaran kerja secara efisien.
  - Pelacakan status: *Dilamar, Seleksi Administrasi, Wawancara, Penawaran, Diterima, Ditolak*.
  - Link otomatis ke URL lowongan kerja.

- 📍 **Autocomplete Lokasi Perusahaan (Combobox)**
  - Pencarian interaktif berisi **514 Kota & Kabupaten di seluruh Indonesia** (seperti *Kota Malang, Kota Jakarta Selatan, Kota Surabaya, dll.*) serta opsi **Remote** dan **Hybrid**.

- 📌 **Kanban Board Visual**
  - Tampilan visual kolom status pergerakan lamaran.
  - Fitur navigasi tahap cepat (*Mundur / Lanjut*) pada setiap kartu lamaran.

- 📈 **Statistik & Visual Insights**
  - Analisis rasio konversi: *Tingkat Respons (%), Lolos Wawancara (%), dan Tingkat Penawaran (%)*.
  - Visualisasi grafik distribusi status, platform sumber lamaran (LinkedIn, JobStreet, Glints, dll.), serta sebaran lokasi perusahaan.

- 📥 **Ekspor Data (CSV)**
  - Cadangkan data seluruh riwayat lamaran kerja ke dalam format file CSV kapan saja via halaman Pengaturan.

- 🔐 **Autentikasi Aman & Row Level Security (RLS)**
  - Terintegrasi dengan **Supabase Auth** (`@supabase/ssr`) dan *Proxy Middleware* Next.js 16.
  - Menerapkan *Row Level Security (RLS)* sehingga data antar-pengguna terisolasi dengan aman.

- 🌙 **Tema Gelap & Terang Modern**
  - Menggunakan `next-themes` dengan switch toggle tema yang diposisikan di header navigasi.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Server Components)
- **Frontend & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), `next-themes`
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, `@supabase/ssr`)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Cara Menjalankan Project (Lokal)

### 1. Clone Repository
```bash
git clone https://github.com/YedijaAdyaVesaka/MyJobTrack.git
cd MyJobTrack
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di direktori utama project dan tambahkan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup Database Schema (Supabase)
Jalankan script SQL yang ada pada file `supabase/001_initial_schema.sql` melalui **SQL Editor** di Supabase Dashboard untuk membuat tabel `job_applications` serta mengaktifkan RLS (*Row Level Security*).

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📦 Deploy ke Vercel

1. Push kode ke repository GitHub Anda.
2. Buka [Vercel Dashboard](https://vercel.com/) dan impor repository `MyJobTrack`.
3. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Klik **Deploy**.

---

## 📄 Lisensi

Project ini dibuat untuk kebutuhan personal & portofolio. Bebas digunakan dan dikembangkan.

