Prompt Master: Konfigurasi Sidebar CMS (Revisi Profil & CRUD)
Context: Saya sedang mengembangkan CMS kustom untuk website sekolah (SMK Mustaqbal) dengan Next.js. Saya ingin memperbarui konfigurasi struktur Sidebar CMS saya menjadi konsep "Page-Centric & Master Data".

Tugas Anda:
Buatkan variabel array/object (misalnya const sidebarItems = [...]) yang berisi struktur menu di bawah ini. Pastikan mendukung nested array (sub-menu) dan berikan icon dari pustaka seperti lucide-react.

Sistem CRUD & Pengelolaan Data (WAJIB DIPERHATIKAN AI):

Pada Manajemen Halaman, setiap menu berfungsi untuk melakukan Update/Edit layout dan konten statis di halaman tersebut.

Pada Master Data, setiap menu HARUS disiapkan untuk sistem CRUD Penuh (Create, Read, Update, Delete). Ini adalah data dinamis di mana admin bisa Menambah, Mengedit, dan Menghapus item (misal: tambah/hapus Portfolio, nambah/hapus Berita, dll).

Berikut adalah struktur Final Sidebar CMS-nya:

📊 Dashboard (Menu Tunggal)

📄 MANAJEMEN HALAMAN (Grup Label - Fokus pada Update/Edit Teks & Layout)

🏠 Beranda

Hero & Download E-Brosur

Keunggulan & Fasilitas

Preview Program Keahlian

Kerjasama Industri & Statistik

Kisah Sukses (Testimoni)

Konsultasi WA (Floating Widget pojok kanan bawah)

ℹ️ Tentang Kami

Profil (Mencakup pengeditan Profil, Video Tagline, dan Visi & Misi sekaligus)

Sambutan Kepala Sekolah

Layout Profil Guru

🎓 Program Keahlian

Layout Header

Fasilitas & Prospek Karir

💼 Portfolio

Layout Halaman Portfolio

📰 Berita & Artikel

Layout Header & Filter Tab

📞 Hubungi Kami

Informasi Kontak & Peta

📝 Pendaftaran PPDB

Layout Form Pendaftaran

🗃️ MASTER DATA (Grup Label - Fokus pada CRUD Dinamis)

👥 Data Guru & Staff (Tambah/Edit/Hapus Guru)

📚 Data Program Keahlian (Tambah/Edit/Hapus Jurusan)

🚀 Data Portfolio Siswa (Tambah/Edit/Hapus Portfolio)

📄 Data Berita & Pengumuman (Tambah/Edit/Hapus Berita)

💬 Data Testimoni Alumni (Tambah/Edit/Hapus Testimoni)

📥 Data Pendaftar PPDB (Lihat/Edit Status/Hapus Pendaftar)

🖼️ Media & Galeri (Tambah/Hapus Foto & Video)

⚙️ PENGATURAN GLOBAL (Grup Label - Fokus pada Update Pengaturan)

🏫 Informasi Umum Sekolah

🎨 Branding & Logo

🌐 Social Media

🦶 Footer Link & Hak Cipta

Aturan Penulisan Kode (PENTING):

Jangan menulis ulang seluruh komponen UI sidebar saya dari awal!

Cukup berikan bentuk data Array of Objects-nya saja untuk menggantikan array menu lama saya.

Beri tanda/komentar yang jelas pada struktur array tersebut agar saya mudah melakukan mapping di komponen UI.





Tambahan Instruksi: Fokus UI/UX (Tanpa Database)
🔴 FASE 1: UI/UX & LAYOUTING SAJA (MOCKUP)
Untuk saat ini, JANGAN membuat integrasi database (Supabase), Server Actions, atau API Routes sama sekali. Kita akan fokus 100% membangun UI/UX Backend CMS-nya terlebih dahulu.

Aturan Pengembangan Fase 1:

Gunakan Dummy Data: Untuk halaman yang menampilkan tabel atau list (seperti Data Guru, Portfolio, Berita), buatkan data dummy berupa hardcoded array of objects di dalam komponen agar saya bisa melihat bentuk visual tabel/kartunya.

Desain Form Kosong: Untuk form Tambah/Edit (CRUD) dan form Manajemen Halaman (Hero, Visi Misi, dll), buatkan struktur form UI-nya menggunakan Tailwind CSS. Sertakan elemen input (input text, textarea, select, tombol upload gambar, dll) yang rapi dan responsif.

Interaksi Dummy: Buat tombol-tombol (Simpan, Hapus, Edit) hanya berfungsi sebatas memunculkan console.log atau dummy notifikasi/toast. Jangan buat logic query apapun.

Gunakan Tabs/Modals: Jika ada layout yang membutuhkan Tabs (seperti di Manajemen Halaman) atau Modal/Dialog (untuk konfirmasi hapus), implementasikan UI-nya menggunakan state React sederhana (seperti useState).

Tujuan: Saya ingin melihat dan me-review tampilan visual (frontend CMS) dan struktur komponennya terlebih dahulu. Jika UI-nya sudah saya setujui, baru kita akan lanjut ke Fase 2 (Integrasi Database). Berikan kodingan UI-nya sekarang.