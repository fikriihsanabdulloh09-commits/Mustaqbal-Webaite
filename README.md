<<<<<<< HEAD
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
=======
# Mustaqbal-Website



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/user/project/repository/web_editor/#create-a-file) or [upload](https://docs.gitlab.com/user/project/repository/web_editor/#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/fikri69/mustaqbal-website.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

* [Set up project integrations](https://gitlab.com/fikri69/mustaqbal-website/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/user/project/merge_requests/creating_merge_requests/)
* [Automatically close issues from merge requests](https://docs.gitlab.com/user/project/issues/managing_issues/#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/topics/autodevops/requirements/)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ci/environments/protected_environments/)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> 8bfca94b2e61fa2312e647b9ed6cdcb2fc150050
