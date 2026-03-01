Prompt Master: Membangun CMS Page Builder "Beranda"
Context: Saya sedang membangun CMS kustom mirip WordPress menggunakan Next.js (App Router), Tailwind CSS, dan Supabase. Saya ingin merapikan form pengeditan untuk halaman "Beranda" (Homepage) agar dinamis dan terkelompok berdasarkan Section/Bagian menggunakan sistem Tabs UI.

Tugas: Buatkan struktur UI halaman Admin untuk pengeditan "Beranda" (/admin/pages/beranda) dan berikan skema database Supabase yang dibutuhkan.

Detail Per Section (Tolong buatkan UI berbentuk Tabs untuk ke-7 bagian ini):

Tab 1: Hero Section (Sudah ada, butuh rapihan & fitur baru)

Existing: Teks Welcome, Tombol Daftar, Link Unduh Kurikulum (sudah berjalan, cukup kelompokkan di tab ini).

New Feature: Tambahkan form input untuk "Download E-Brosur". Butuh input untuk: Judul Card E-Brosur, Subteks, dan URL/File PDF Brosur-nya.

Tab 2: Keunggulan & Fasilitas (Fitur Baru)

Buatkan input untuk Judul Section ("Keunggulan Akademik & Fasilitas Terbaik") dan Sub-judul.

Buatkan UI Repeater/Dynamic Field untuk mengedit 3 kotak keunggulan (Pembelajaran 70% Praktik, Guru Praktisi, Penyaluran Kerja). Masing-masing butuh input: Icon (opsional/string nama icon), Judul Kotak, dan Deskripsi. Saran: Simpan data ini sebagai JSONB di tabel settings.

Tab 3: Program Keahlian (Sudah ada, butuh rapihan)

Data utamanya sudah ada di tabel lain. Di tab ini, cukup berikan input untuk mengedit Judul Section ("Siapkan Diri Menjadi Ahli") dan Sub-judulnya.

Tab 4: Kerjasama Industri (Sudah ada, butuh rapihan)

Data logo Mitra sudah ada. Di tab ini, tambahkan form untuk mengedit Statistik Angka di atas logo mitra:

Input Angka 1 (Misal: "50+") & Label 1 ("Mitra Industri")

Input Angka 2 (Misal: "90%") & Label 2 ("Siswa Tersalurkan")

Input Angka 3 (Misal: "1000+") & Label 3 ("Alumni Bekerja")

Tab 5: Kisah Sukses / Testimoni Alumni (Fitur Baru)

Berikan skema tabel baru testimonials (id, nama, role, kutipan_teks, inisial_avatar).

Di tab ini, buatkan tabel/list sederhana untuk CRUD data testimoni alumni tersebut.

Tab 6: Berita Terkini (Sudah ada, butuh rapihan)

Data berita ditarik dari tabel berita. Di tab ini cukup tambahkan input untuk mengubah Judul Section ("Seputar SMK Mustaqbal") saja.

Tab 7: Widget & Konsultasi Gratis (Fitur Baru)

Buatkan form pengaturan untuk Floating WhatsApp Widget di pojok kanan bawah.

Input yang dibutuhkan: Teks Judul Pop-up ("Konsultasi Gratis"), Teks Deskripsi, dan Nomor WhatsApp tujuan.

Aturan Penulisan Kode (PENTING):

Gunakan UI Tabs: Gunakan state management sederhana atau Headless UI agar ke-7 section di atas bisa diakses lewat Tab Menu Horizontal/Vertical di halaman /admin/pages/beranda, agar halamannya tidak memanjang ke bawah.

Skema Database: Berikan rekomendasi query SQL Supabase. Saya menyarankan penggunaan 1 tabel page_settings dengan kolom page_name (isi: 'beranda') dan kolom content bertipe JSONB untuk menyimpan teks judul, subjudul, statisik mitra, widget WA, dan keunggulan. Sedangkan untuk Testimoni buatkan tabel terpisah.

Berikan kode UI komponen tab-nya terlebih dahulu, jangan ubah file lain di luar konteks.