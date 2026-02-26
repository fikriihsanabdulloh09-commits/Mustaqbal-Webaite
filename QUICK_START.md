# 🚀 Quick Start Guide - SMK Mustaqbal Website

## Prerequisites
- Node.js 18+ installed
- Akun Supabase (gratis)
- Text editor (VS Code recommended)

## Setup dalam 5 Menit

### 1. Setup Supabase Database

1. Buka [supabase.com](https://supabase.com) dan buat akun gratis
2. Buat project baru
3. Dapatkan URL dan Anon Key dari Settings > API
4. Database schema sudah otomatis dibuat saat pertama kali project dijalankan

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser

## ✅ Checklist

- [ ] Database terbuat otomatis dengan sample data
- [ ] Homepage terlihat dengan slideshow hero
- [ ] Navigasi menu berfungsi
- [ ] Form e-brochure bisa submit
- [ ] Halaman program keahlian menampilkan 4 program
- [ ] Halaman berita menampilkan 3 artikel
- [ ] Form PPDB bisa diakses

## 📋 Sample Data

Database sudah terisi dengan:
- ✅ 4 Program Keahlian
- ✅ 3 Artikel Berita
- ✅ 3 Testimonial Alumni
- ✅ 6 Foto Galeri
- ✅ 3 Video Galeri

## 🎨 Kustomisasi Cepat

### Ganti Warna Tema
Edit `tailwind.config.ts`, cari bagian `colors` dan ubah nilai `teal`:

```typescript
// Ubah dari teal ke warna lain, misalnya blue
'bg-teal-600' → 'bg-blue-600'
'text-teal-600' → 'text-blue-600'
```

### Ganti Logo
Tempatkan logo di folder `public/logo.png` dan update di:
- `components/Header.tsx`
- `components/Footer.tsx`

### Update Konten
Semua konten disimpan di database Supabase. Edit via:
1. Supabase Dashboard > Table Editor
2. Atau buat halaman admin (coming soon)

## 🔧 Troubleshooting

**Problem: Error koneksi database**
- Pastikan `.env.local` berisi URL dan Key yang benar
- Cek koneksi internet

**Problem: Halaman kosong**
- Cek console browser (F12) untuk error
- Pastikan database berisi sample data

**Problem: Build error**
- Hapus folder `.next` dan `node_modules`
- Run `npm install` lagi
- Run `npm run build`

## 📱 Deploy to Production

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables
4. Deploy!

### Deploy ke Netlify

1. Build dulu: `npm run build`
2. Upload folder `.next` ke Netlify
3. Set environment variables
4. Deploy!

## 🎯 Next Steps

1. **Tambah Konten**: Isi database dengan konten asli sekolah
2. **Kustomisasi**: Sesuaikan warna, font, dan layout
3. **Add Features**:
   - Admin dashboard
   - Online payment
   - Student portal
   - E-learning integration

## 💡 Tips

- Gunakan Supabase Studio untuk manage data dengan mudah
- Test di berbagai device (mobile, tablet, desktop)
- Optimize images sebelum upload
- Backup database secara berkala

## 🆘 Need Help?

Dokumentasi lengkap ada di `README.md`

## 🎉 Selamat!

Website sekolah Anda siap digunakan! 🚀
