# SMK Mustaqbal Website

Website sekolah dinamis yang dibangun dengan Next.js 13 (App Router), TypeScript, Tailwind CSS, dan Supabase sebagai database.

## 🚀 Fitur Utama

### Frontend
- ✨ **Next.js 13** dengan App Router
- 🎨 **Tailwind CSS** untuk styling
- 🎭 **Framer Motion** untuk animasi profesional dan interaktif
- 📱 **Fully Responsive** - Mobile, Tablet, Desktop
- 🎯 **shadcn/ui** untuk komponen UI yang konsisten
- 🔤 **Google Fonts** (Inter & Poppins)
- 💬 **WhatsApp Floating Button** untuk konsultasi gratis

### Backend & Database
- 🗄️ **Supabase** sebagai database (PostgreSQL)
- 🔐 **Row Level Security (RLS)** untuk keamanan data
- 📊 **Real-time** data fetching
- 🔄 **Revalidation** untuk caching optimal

### Halaman yang Tersedia

1. **Homepage** (`/`)
   - Hero section dengan slideshow dan form e-brochure
   - Keunggulan sekolah
   - Program keahlian
   - Testimonial alumni
   - Berita terkini

2. **Program Keahlian** (`/program`)
   - Daftar semua program
   - Detail program (`/program/[slug]`)
   - Fasilitas dan prospek karir

3. **Berita & Artikel** (`/berita`)
   - Filter berdasarkan kategori
   - Detail berita (`/berita/[slug]`)
   - View counter

4. **Tentang Kami**
   - Visi & Misi (`/tentang/visi-misi`)
   - Sambutan Kepala Sekolah (bisa ditambahkan)

5. **PPDB** (`/ppdb`)
   - Form pendaftaran siswa baru
   - Validasi form dengan Zod
   - Submit ke database Supabase

6. **Kontak** (`/kontak`)
   - Informasi kontak lengkap
   - Google Maps integration
   - Social media links

## 🗄️ Database Schema

### Tables
1. **programs** - Program keahlian
2. **news_articles** - Berita dan artikel
3. **gallery_items** - Galeri foto dan video
4. **testimonials** - Testimonial alumni
5. **ppdb_submissions** - Data pendaftaran PPDB
6. **ebrochure_downloads** - Log download e-brochure

Semua tabel sudah dilengkapi dengan:
- Row Level Security (RLS)
- Indexes untuk performa optimal
- Sample data untuk testing

## 🎨 Animasi & Interaktivitas

- Scroll animations dengan Framer Motion
- Smooth page transitions
- Hover effects pada cards
- Interactive navigation menu
- Loading states
- Toast notifications

## 🔧 Environment Variables

Pastikan file `.env.local` berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 💬 Konfigurasi WhatsApp

Edit nomor WhatsApp di `components/WhatsAppButton.tsx`:

```typescript
const whatsappNumber = '6281234567890'; // Ganti dengan nomor WA sekolah
const defaultMessage = 'Halo, saya ingin konsultasi gratis tentang SMK Mustaqbal';
```

Fitur ini memberikan:
- Floating button di pojok kanan bawah
- Popup informasi konsultasi
- Direct chat ke WhatsApp dengan pesan pre-filled
- Animasi smooth dan menarik

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Start production server
npm start
```

## 🎯 Cara Menambahkan Data

### 1. Menambah Program Keahlian
Buka Supabase Dashboard > Table Editor > programs

```sql
INSERT INTO programs (title, slug, description, icon, color_theme, facilities, career_prospects, order_position)
VALUES (
  'Nama Program',
  'nama-program',
  'Deskripsi program',
  'cpu',
  'blue',
  '["Fasilitas 1", "Fasilitas 2"]'::jsonb,
  '["Karir 1", "Karir 2"]'::jsonb,
  5
);
```

### 2. Menambah Berita
```sql
INSERT INTO news_articles (title, slug, excerpt, content, category, image_url)
VALUES (
  'Judul Berita',
  'judul-berita',
  'Ringkasan singkat',
  '<p>Konten lengkap berita</p>',
  'pengumuman',
  'https://example.com/image.jpg'
);
```

### 3. Menambah Testimonial
```sql
INSERT INTO testimonials (name, program, graduation_year, current_position, company, testimonial_text, is_featured)
VALUES (
  'Nama Alumni',
  'Program Keahlian',
  2023,
  'Posisi',
  'Perusahaan',
  'Teks testimonial',
  true
);
```

## 🎨 Kustomisasi Warna

Edit `tailwind.config.ts` untuk mengubah warna tema:

```typescript
colors: {
  primary: {
    // Ubah warna teal default
  }
}
```

Atau ubah di komponen individual dengan class Tailwind.

## 📱 Struktur Folder

```
/app
  /berita
    /[slug] - Detail berita
    page.tsx - List berita
  /program
    /[slug] - Detail program
    page.tsx - List program
  /ppdb - Halaman pendaftaran
  /tentang
    /visi-misi
  /kontak
  page.tsx - Homepage

/components
  Header.tsx - Navigation
  Footer.tsx
  Hero.tsx - Hero section homepage
  FeaturesSection.tsx
  ProgramsSection.tsx
  TestimonialsSection.tsx
  NewsSection.tsx
  /ui - shadcn/ui components

/lib
  supabase.ts - Supabase client & types
  utils.ts - Utility functions
```

## 🔐 Security

- Row Level Security (RLS) aktif di semua tabel
- Public read access untuk data publik
- Authenticated only untuk submissions
- Input validation dengan Zod
- SQL injection protection via Supabase

## 🚀 Performance

- Static generation untuk pages yang tidak berubah sering
- ISR (Incremental Static Regeneration) dengan revalidate: 60
- Image optimization dengan Next.js Image
- Code splitting otomatis
- CSS optimized dengan Tailwind

## 📝 TODO / Enhancement Ideas

- [ ] Admin dashboard untuk manage content
- [ ] Galeri foto/video page
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Blog comments
- [ ] Newsletter subscription
- [ ] Student portal
- [ ] Online exam system
- [ ] Payment gateway integration

## 👨‍💻 Development

Website ini menggunakan best practices:
- TypeScript untuk type safety
- ESLint untuk code quality
- Responsive design mobile-first
- Semantic HTML
- Accessible components
- SEO optimized

## 📄 License

© 2024 SMK Mustaqbal. All rights reserved.
