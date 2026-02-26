/*
  # Seed Default Data for School CMS
  
  Comprehensive seed data for testing and demo purposes.
  Includes: settings, categories, menu links, achievements, events,
  announcements, facilities, and additional testimonials.
*/

-- Temporarily disable RLS for seeding
ALTER TABLE IF EXISTS settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS menu_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS facilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials DISABLE ROW LEVEL SECURITY;

-- 1. SETTINGS
INSERT INTO settings (key, value, description, updated_at)
VALUES
  (
    'school_basic_info',
    '{"school_name": "SMK Mustaqbal", "tagline": "Mencetak Generasi Unggul & Berakhlak Mulia", "address": "Jl. Pendidikan No. 123, Bandung, Jawa Barat 40123", "phone": "022-1234567", "email": "info@smkmustaqbal.sch.id", "whatsapp": "6281234567890", "principal_name": "Drs. H. Ahmad Hidayat, M.Pd", "accreditation": "A", "npsn": "20219876", "established_year": 2010}'::jsonb,
    'Informasi dasar sekolah',
    NOW()
  ),
  (
    'social_media_links',
    '{"instagram": "https://instagram.com/smkmustaqbal", "facebook": "https://facebook.com/SMKMustaqbal", "youtube": "https://youtube.com/@SMKMustaqbalOfficial", "tiktok": "https://tiktok.com/@smkmustaqbal"}'::jsonb,
    'Link social media',
    NOW()
  )
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();

-- 2. MENU LINKS  
INSERT INTO menu_links (id, title, href, parent_id, position, icon, is_active, created_at)
VALUES
  (gen_random_uuid(), 'Beranda', '/', NULL, 1, 'Home', true, NOW()),
  (gen_random_uuid(), 'Program', '/program', NULL, 2, 'GraduationCap', true, NOW()),
  (gen_random_uuid(), 'Berita', '/berita', NULL, 3, 'Newspaper', true, NOW()),
  (gen_random_uuid(), 'Galeri', '/galeri', NULL, 4, 'Images', true, NOW()),
  (gen_random_uuid(), 'PPDB', '/ppdb', NULL, 5, 'UserPlus', true, NOW()),
  (gen_random_uuid(), 'Kontak', '/kontak', NULL, 6, 'Phone', true, NOW())
ON CONFLICT DO NOTHING;

-- 3. ACHIEVEMENTS
INSERT INTO achievements (id, title, slug, student_name, category, level, rank, year, event_date, description, image_url, is_featured, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Juara 1 LKS Web Development Kota Bandung',
    'juara-1-lks-web-dev-2024',
    'Ahmad Rizki Pratama',
    'teknologi',
    'kota',
    'Juara 1',
    2024,
    '2024-08-15',
    'Berhasil meraih juara 1 kompetisi web development dengan aplikasi e-commerce modern menggunakan Next.js',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Medali Emas OSN Informatika Provinsi',
    'medali-emas-osn-informatika-2024',
    'Siti Nurhaliza',
    'akademik',
    'provinsi',
    'Medali Emas',
    2024,
    '2024-05-20',
    'Meraih medali emas dalam Olimpiade Sains Nasional bidang Informatika tingkat Jawa Barat',
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Best Innovation Award Robotics National',
    'best-innovation-robotics-2024',
    'Tim Robotika SMK Mustaqbal',
    'teknologi',
    'nasional',
    'Best Innovation',
    2024,
    '2024-10-05',
    'Robot AI dengan sistem obstacle avoidance terbaik dalam kompetisi nasional',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Juara 2 Hackathon Mobile App Development',
    'juara-2-hackathon-2023',
    'Budi Santoso & Team',
    'teknologi',
    'nasional',
    'Juara 2',
    2023,
    '2023-11-10',
    'Aplikasi mobile management untuk UMKM dengan fitur lengkap',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Juara 1 Design Competition 3D Product',
    'juara-1-design-3d-2024',
    'Dewi Lestari',
    'seni',
    'nasional',
    'Juara 1',
    2024,
    '2024-07-22',
    'Desain produk furniture eco-friendly menggunakan Blender dan software 3D profesional',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Juara 3 Futsal Antar SMK Jawa Barat',
    'juara-3-futsal-2024',
    'Tim Futsal SMK Mustaqbal',
    'olahraga',
    'provinsi',
    'Juara 3',
    2024,
    '2024-09-15',
    'Meraih juara 3 dalam turnamen futsal Piala Gubernur Jawa Barat',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    false,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. EVENTS
INSERT INTO events (id, title, slug, description, event_type, start_date, end_date, location, organizer, image_url, is_published, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Open House & School Tour 2025',
    'open-house-2025',
    'Kunjungi sekolah kami dan lihat langsung fasilitas lengkap serta program unggulan. Dapatkan informasi lengkap tentang PPDB 2025.',
    'open-house',
    '2025-01-15 08:00:00+07',
    '2025-01-15 15:00:00+07',
    'SMK Mustaqbal Campus',
    'Panitia PPDB',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Workshop IoT for Students',
    'workshop-iot-2025',
    'Pelatihan Internet of Things menggunakan Arduino dan ESP32. Gratis untuk siswa dan umum.',
    'workshop',
    '2025-01-20 09:00:00+07',
    '2025-01-20 16:00:00+07',
    'Lab Robotika SMK Mustaqbal',
    'Jurusan Teknik Otomasi & Robotik',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Industry Visit to Tech Company',
    'industry-visit-jan-2025',
    'Kunjungan industri ke perusahaan teknologi terkemuka di Jakarta untuk melihat penerapan teknologi di dunia kerja.',
    'field-trip',
    '2025-02-10 07:00:00+07',
    '2025-02-10 17:00:00+07',
    'Jakarta',
    'Program Studi',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Tech Expo 2025 - Student Projects',
    'tech-expo-2025',
    'Pameran proyek akhir siswa kelas XII. Showcase inovasi teknologi terbaru dari siswa SMK Mustaqbal.',
    'exhibition',
    '2025-03-15 08:00:00+07',
    '2025-03-17 17:00:00+07',
    'Aula SMK Mustaqbal',
    'Panitia Tech Expo',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- 5. ANNOUNCEMENTS
INSERT INTO announcements (id, title, content, priority, start_date, end_date, link_url, link_text, is_active, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Libur Semester Ganjil 2024/2025',
    'Libur semester ganjil tahun ajaran 2024/2025 akan dimulai tanggal 20 Desember 2024 sampai dengan 5 Januari 2025. Siswa masuk kembali pada tanggal 6 Januari 2025. Selamat berlibur!',
    'high',
    '2024-12-20 00:00:00+07',
    '2025-01-05 23:59:59+07',
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pendaftaran PPDB Gelombang 1 Dibuka',
    'Pendaftaran Penerimaan Peserta Didik Baru (PPDB) gelombang 1 tahun ajaran 2025/2026 telah dibuka! Daftar sekarang dan dapatkan diskon biaya pendaftaran hingga 50%. Buruan daftar, kuota terbatas!',
    'high',
    '2025-01-01 00:00:00+07',
    '2025-03-31 23:59:59+07',
    '/ppdb',
    'Daftar Sekarang',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Info Beasiswa Prestasi 2025',
    'Tersedia beasiswa penuh untuk siswa berprestasi akademik dan non-akademik. Untuk informasi lengkap persyaratan dan cara pendaftaran, silakan hubungi bagian kesiswaan atau WA 0812-3456-7890.',
    'normal',
    NOW(),
    '2025-12-31 23:59:59+07',
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Jadwal Ujian Akhir Semester',
    'Ujian Akhir Semester (UAS) akan dilaksanakan tanggal 10-17 Desember 2024. Jadwal lengkap per kelas dapat dilihat di portal siswa masing-masing.',
    'normal',
    '2024-12-01 00:00:00+07',
    '2024-12-17 23:59:59+07',
    NULL,
    NULL,
    true,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- 6. FACILITIES
INSERT INTO facilities (id, name, slug, description, category, image_url, specifications, is_active, order_position, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Lab Komputer',
    'lab-komputer',
    'Laboratorium komputer modern dilengkapi dengan 40 unit PC dengan spesifikasi tinggi. Cocok untuk pembelajaran programming, design, dan multimedia.',
    'laboratory',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    '{"capacity": 40, "features": ["AC", "Proyektor 4K", "Whiteboard Digital", "High-Speed Internet 1Gbps"]}'::jsonb,
    true,
    1,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lab Robotika & Otomasi',
    'lab-robotika',
    'Laboratorium lengkap untuk praktek robotika, IoT, dan sistem otomasi industri. Dilengkapi dengan berbagai kit robot dan peralatan modern.',
    'laboratory',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    '{"capacity": 30, "features": ["Robot Kit", "Arduino & ESP32", "PLC Trainer", "3D Printer"]}'::jsonb,
    true,
    2,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Studio Multimedia & 3D Design',
    'studio-multimedia',
    'Studio profesional untuk desain grafis, video editing, animasi 3D, dan multimedia. Menggunakan workstation kelas atas.',
    'laboratory',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    '{"capacity": 35, "features": ["iMac Pro", "Wacom Tablet", "Green Screen Studio", "Professional Camera"]}'::jsonb,
    true,
    3,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Workshop Elektronika',
    'workshop-elektronika',
    'Workshop lengkap untuk praktek elektronika dan assembly. Dilengkapi dengan berbagai tools dan measuring instruments profesional.',
    'workshop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    '{"capacity": 25, "features": ["Soldering Station", "Digital Multimeter", "Oscilloscope", "Regulated Power Supply"]}'::jsonb,
    true,
    4,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Perpustakaan Digital',
    'perpustakaan',
    'Perpustakaan modern dengan koleksi buku lengkap dan akses ke digital library internasional. Ruang baca nyaman dengan AC dan WiFi gratis.',
    'library',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
    '{"capacity": 100, "features": ["10.000+ Books", "E-Library Access", "Private Study Rooms", "Free High-Speed WiFi"]}'::jsonb,
    true,
    5,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Masjid & Tempat Ibadah',
    'masjid',
    'Masjid luas dan nyaman untuk kegiatan ibadah harian dan kajian keagamaan. Dilengkapi dengan sound system dan AC.',
    'religious',
    'https://images.unsplash.com/photo-1564769610726-4f1fbcf1e0ad?w=800',
    '{"capacity": 200, "features": ["AC", "Sound System", "Tempat Wudhu", "Perpustakaan Islami"]}'::jsonb,
    true,
    6,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lapangan Olahraga',
    'lapangan-olahraga',
    'Lapangan serbaguna untuk kegiatan olahraga seperti futsal, basket, dan voli. Dilengkapi dengan tribun penonton.',
    'sports',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
    '{"capacity": 200, "features": ["Futsal Court", "Basketball Court", "Volleyball Court", "Tribun 100 seats"]}'::jsonb,
    true,
    7,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Kantin & Cafeteria',
    'kantin',
    'Kantin bersih dan nyaman dengan berbagai pilihan menu makanan sehat dan harga terjangkau.',
    'facility',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
    '{"capacity": 150, "features": ["AC", "Free WiFi", "Healthy Food Options", "Cashless Payment"]}'::jsonb,
    true,
    8,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- 7. MORE TESTIMONIALS
INSERT INTO testimonials (id, name, program, graduation_year, current_position, company, role, testimonial_text, photo_url, rating, is_featured, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Budi Santoso',
    'Web Dev & Digital Marketing',
    2023,
    'Frontend Developer',
    'Gojek',
    'Alumni',
    'SMK Mustaqbal memberikan bekal skill programming yang sangat solid. Pembelajaran praktis dan project-based membuat saya siap kerja langsung setelah lulus. Sekarang saya bekerja di Gojek sebagai Frontend Developer.',
    'https://i.pravatar.cc/150?img=12',
    5,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Siti Rahmawati',
    'Product Design & 3D',
    2022,
    '3D Designer',
    'Tokopedia',
    'Alumni',
    'Belajar 3D modeling dan product design di SMK Mustaqbal sangat aplikatif. Guru-gurunya expert di bidangnya dan fasilitasnya lengkap. Sekarang saya bekerja sebagai 3D Designer di Tokopedia.',
    'https://i.pravatar.cc/150?img=45',
    5,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Andi Wijaya',
    'IT Support & Network',
    2023,
    'Network Engineer',
    'Telkom Indonesia',
    'Alumni',
    'Program IT Support sangat membantu saya memahami networking dan troubleshooting. Sertifikasi yang didapat juga recognized oleh industri. Langsung kerja setelah lulus di Telkom Indonesia!',
    'https://i.pravatar.cc/150?img=33',
    5,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Rina Kusuma',
    'Teknik Otomasi & Robotik',
    2022,
    'Automation Engineer',
    'PT. Astra Manufacturing',
    'Alumni',
    'Praktikum robotika yang intensif dan project real membuat saya sangat siap bekerja di industri manufaktur. Terima kasih SMK Mustaqbal atas ilmu dan pengalamannya!',
    'https://i.pravatar.cc/150?img=26',
    5,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Farhan Maulana',
    'Web Dev & Digital Marketing',
    2023,
    'Digital Marketing Specialist',
    'Shopee Indonesia',
    'Alumni',
    'Selain belajar coding, saya juga belajar digital marketing lengkap. Dari SEO, social media, sampai ads campaign. Skill ini sangat berguna untuk karir saya di Shopee.',
    'https://i.pravatar.cc/150?img=68',
    5,
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Dewi Anggraeni',
    'Product Design & 3D',
    2022,
    'Freelance Designer',
    'Self-Employed',
    'Alumni',
    'Setelah lulus saya memutuskan menjadi freelancer. Skill design dan 3D modeling yang dipelajari sangat membantu. Penghasilan saya sekarang bahkan lebih dari yang kerja kantoran!',
    'https://i.pravatar.cc/150?img=47',
    5,
    false,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Re-enable RLS
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS menu_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;
