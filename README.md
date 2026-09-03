# 💼 MyJobTrack - Pelacak Lamaran Kerja Modern

**MyJobTrack** adalah aplikasi manajemen & pelacak lamaran kerja berbasis web yang responsif, cepat, dan aman. Dirancang untuk membantu pencari kerja mengorganisir alur lamaran, memantau tahapan seleksi, dan menganalisis performa pencarian kerja secara *real-time*.

---

## ✨ Fitur Utama

- 📊 **Dasbor Analitik Real-Time**
  - Ringkasan total lamaran, jumlah wawancara, penawaran kerja (*offer*), dan rasio respons secara langsung.
  - Pantau lamaran terbaru yang baru ditambahkan.

- 📝 **Manajemen Lamaran Kerja (CRUD)**
  - Tambah, edit, filter, dan hapus lamaran kerja secara fleksibel.
  - Status lamaran: *Dilamar, Seleksi Administrasi, Wawancara, Penawaran, Diterima, Ditolak*.
  - Link langsung ke URL lowongan kerja.

- 📍 **Pencarian Lokasi Perusahaan (Combobox)**
  - Autocomplete kustom berisi **514 Kota & Kabupaten di seluruh Indonesia** (misal: *Kota Malang, Kabupaten Malang, Kota Jakarta Selatan, Kota Surabaya, dll.*) serta opsi **Remote** dan **Hybrid**.

- 📌 **Kanban Board**
  - Tampilan visual alur lamaran berdasarkan tahapan status.
  - Tombol pindah tahap cepat (*Mundur / Lanjut*) pada kartu lamaran.

- 📈 **Statistik & Visual Insights**
  - Analisis rasio konversi: *Tingkat Respons (%), Lolos Wawancara (%), dan Tingkat Penawaran (%)*.
  - Visualisasi grafik distribusi status, sumber lamaran terbanyak (LinkedIn, JobStreet, Glints, dll.), dan lokasi perusahaan terbanyak.

- 📥 **Ekspor Data (CSV)**
  - Fitur unduh cadangan data seluruh lamaran kerja ke format CSV kapan saja dari halaman Pengaturan.

- 🔐 **Autentikasi Aman & Row Level Security (RLS)**
  - Pendaftaran & login pengguna yang terintegrasi dengan **Supabase Auth**.
  - Menggunakan *Row Level Security (RLS)* sehingga setiap pengguna hanya dapat mengakses dan mengelola datanya sendiri.

- 🌙 **Dukungan Tema Gelap & Terang**
  - Tampilan antarmuka modern yang nyaman di mata dengan mode *Dark* dan *Light*.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Library Client & UI**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), `next-themes`
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, `@supabase/ssr`)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Cara Menjalankan Project

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
Buat file `.env.local` di akar folder project dan isi dengan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Eksekusi Migration Database (Supabase)
Jalankan SQL script yang terdapat pada file `supabase/001_initial_schema.sql` melalui **SQL Editor** di Supabase Dashboard kamu untuk membuat tabel `job_applications` dan mengaktifkan RLS policies.

### 5. Jalankan Server Development
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser kamu.

---

## 🏗️ Production Build

Untuk membuat build produksi:
```bash
npm run build
npm run start
```

---

## 📄 Lisensi

Project ini dibuat untuk kebutuhan personal & portofolio. Bebas digunakan dan dikembangkan lebih lanjut.

