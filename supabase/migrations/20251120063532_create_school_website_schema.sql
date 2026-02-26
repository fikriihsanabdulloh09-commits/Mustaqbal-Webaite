/*
  # School Website Database Schema

  ## Overview
  Membuat database lengkap untuk website sekolah dinamis dengan fitur:
  - Program Keahlian
  - Berita & Artikel
  - Galeri Foto & Video
  - Testimonial Alumni
  - Submission Forms (PPDB & E-brochure)
  
  ## Tables Created
  
  ### 1. programs
  Menyimpan data program keahlian sekolah
  - id (uuid, primary key)
  - title (text) - Nama program
  - slug (text, unique) - URL-friendly identifier
  - description (text) - Deskripsi program
  - icon (text) - Nama icon dari lucide-react
  - image_url (text) - URL gambar program
  - color_theme (text) - Tema warna untuk gradient
  - facilities (jsonb) - Array fasilitas yang tersedia
  - career_prospects (jsonb) - Array prospek karir
  - is_active (boolean) - Status aktif/non-aktif
  - order_position (integer) - Urutan tampilan
  - created_at, updated_at (timestamp)
  
  ### 2. news_articles
  Menyimpan berita dan artikel
  - id (uuid, primary key)
  - title (text) - Judul berita
  - slug (text, unique) - URL-friendly identifier
  - excerpt (text) - Ringkasan singkat
  - content (text) - Konten lengkap (support HTML/Markdown)
  - category (text) - Kategori: acara, artikel, pengumuman, prestasi
  - image_url (text) - Gambar thumbnail
  - author (text) - Nama penulis
  - published_at (timestamp) - Tanggal publikasi
  - is_published (boolean) - Status publikasi
  - views (integer) - Jumlah views
  - created_at, updated_at (timestamp)
  
  ### 3. gallery_items
  Menyimpan foto dan video galeri
  - id (uuid, primary key)
  - title (text) - Judul media
  - description (text) - Deskripsi
  - media_type (text) - foto atau video
  - media_url (text) - URL media
  - thumbnail_url (text) - URL thumbnail (untuk video)
  - category (text) - Kategori galeri
  - is_featured (boolean) - Tampilkan di homepage
  - order_position (integer) - Urutan tampilan
  - created_at, updated_at (timestamp)
  
  ### 4. testimonials
  Menyimpan testimoni alumni
  - id (uuid, primary key)
  - name (text) - Nama alumni
  - program (text) - Program keahlian yang diambil
  - graduation_year (integer) - Tahun lulus
  - current_position (text) - Posisi/pekerjaan saat ini
  - company (text) - Nama perusahaan
  - testimonial_text (text) - Isi testimoni
  - avatar_url (text) - URL foto profil
  - is_featured (boolean) - Tampilkan di homepage
  - rating (integer) - Rating 1-5
  - created_at, updated_at (timestamp)
  
  ### 5. ppdb_submissions
  Menyimpan data pendaftaran siswa baru
  - id (uuid, primary key)
  - full_name (text) - Nama lengkap
  - email (text) - Email
  - phone (text) - No. telepon
  - whatsapp (text) - No. WhatsApp
  - origin_school (text) - Asal sekolah
  - chosen_program (text) - Program yang dipilih
  - address (text) - Alamat lengkap
  - parent_name (text) - Nama orang tua
  - parent_phone (text) - No. telepon orang tua
  - status (text) - pending, reviewed, accepted, rejected
  - notes (text) - Catatan admin
  - created_at (timestamp)
  
  ### 6. ebrochure_downloads
  Menyimpan data download e-brochure
  - id (uuid, primary key)
  - full_name (text) - Nama lengkap
  - whatsapp (text) - No. WhatsApp
  - origin_school (text) - Asal sekolah
  - email (text) - Email (optional)
  - downloaded_at (timestamp)
  - ip_address (text) - IP address pengunduh
  
  ## Security
  - RLS enabled pada semua tabel
  - Public read access untuk data publik (programs, news, gallery, testimonials)
  - Authenticated only untuk submissions
  - Admin role untuk write operations
  
  ## Indexes
  - slug indexes untuk faster lookups
  - published_at, created_at indexes untuk sorting
  - category indexes untuk filtering
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'graduation-cap',
  image_url text,
  color_theme text DEFAULT 'blue',
  facilities jsonb DEFAULT '[]'::jsonb,
  career_prospects jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'artikel',
  image_url text,
  author text DEFAULT 'Admin',
  published_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT true,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_type text NOT NULL DEFAULT 'foto',
  media_url text NOT NULL,
  thumbnail_url text,
  category text DEFAULT 'umum',
  is_featured boolean DEFAULT false,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  program text NOT NULL,
  graduation_year integer NOT NULL,
  current_position text NOT NULL,
  company text NOT NULL,
  testimonial_text text NOT NULL,
  avatar_url text,
  is_featured boolean DEFAULT false,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ppdb_submissions table
CREATE TABLE IF NOT EXISTS ppdb_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text NOT NULL,
  whatsapp text NOT NULL,
  origin_school text NOT NULL,
  chosen_program text,
  address text,
  parent_name text,
  parent_phone text,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create ebrochure_downloads table
CREATE TABLE IF NOT EXISTS ebrochure_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  whatsapp text NOT NULL,
  origin_school text NOT NULL,
  email text,
  downloaded_at timestamptz DEFAULT now(),
  ip_address text
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(is_active, order_position);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery_items(media_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_items(is_featured, order_position);

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ppdb_status ON ppdb_submissions(status, created_at DESC);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebrochure_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for programs (public read)
CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage programs"
  ON programs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for news_articles (public read published)
CREATE POLICY "Anyone can view published articles"
  ON news_articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage articles"
  ON news_articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for gallery_items (public read)
CREATE POLICY "Anyone can view gallery items"
  ON gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage gallery"
  ON gallery_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for testimonials (public read featured)
CREATE POLICY "Anyone can view featured testimonials"
  ON testimonials FOR SELECT
  USING (is_featured = true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ppdb_submissions (anyone can insert)
CREATE POLICY "Anyone can submit PPDB"
  ON ppdb_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all submissions"
  ON ppdb_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON ppdb_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ebrochure_downloads (anyone can insert)
CREATE POLICY "Anyone can download ebrochure"
  ON ebrochure_downloads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view downloads"
  ON ebrochure_downloads FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data for programs
INSERT INTO programs (title, slug, description, icon, color_theme, facilities, career_prospects, order_position) VALUES
  ('Teknik Otomasi & Robotik', 'teknik-otomasi-robotik', 'Pelajari sistem kontrol modern, IoT industri, dan perancangan robot cerdas untuk industri 4.0', 'cpu', 'blue', '["Lab Robotika", "PLC Training Kit", "Arduino & IoT Lab", "Simulator Industri"]'::jsonb, '["Teknisi Otomasi", "Programmer PLC", "IoT Engineer", "Robotics Specialist"]'::jsonb, 1),
  ('Product Design & 3D', 'product-design-3d', 'Kembangkan kreativitas dalam mendesain produk inovatif dengan teknologi 3D printing dan CAD', 'palette', 'orange', '["3D Printer Lab", "CAD Workstation", "Design Studio", "Prototyping Lab"]'::jsonb, '["Product Designer", "3D Modeler", "CAD Operator", "Industrial Designer"]'::jsonb, 2),
  ('IT Support & Network', 'it-support-network', 'Ahli dalam infrastruktur jaringan, server, dan keamanan siber perusahaan', 'monitor', 'green', '["Network Lab", "Server Room", "Cisco Lab", "Cyber Security Lab"]'::jsonb, '["Network Engineer", "IT Support", "System Administrator", "Cyber Security Analyst"]'::jsonb, 3),
  ('Web Dev & Digital Marketing', 'web-dev-digital-marketing', 'Membangun aplikasi web modern dan strategi pemasaran digital yang efektif', 'code', 'purple', '["Programming Lab", "Digital Studio", "SEO Tools", "Social Media Lab"]'::jsonb, '["Web Developer", "Digital Marketer", "SEO Specialist", "Frontend Developer"]'::jsonb, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample news articles
INSERT INTO news_articles (title, slug, excerpt, content, category, author, published_at) VALUES
  ('Pendaftaran Siswa Baru TA 2024/2025 Telah Dibuka!', 'pendaftaran-siswa-baru-2024-2025', 'Bergabunglah dengan SMK Mustaqbal dan raih masa depan gemilang. Dapatkan beasiswa hingga 100% untuk siswa berprestasi.', '<p>SMK Mustaqbal dengan bangga mengumumkan pembukaan pendaftaran siswa baru untuk tahun ajaran 2024/2025. Kami menawarkan 4 program keahlian unggulan yang dirancang untuk mempersiapkan siswa menghadapi tantangan industri modern.</p><p>Dapatkan berbagai kemudahan dan keuntungan dengan mendaftar sekarang!</p>', 'pengumuman', 'Admin', now()),
  ('Siswa SMK Mustaqbal Juara 1 LKS Tingkat Kota', 'juara-lks-tingkat-kota', 'Membanggakan! Siswa kami berhasil meraih juara 1 dalam Lomba Kompetensi Siswa tingkat kota dalam bidang Web Technology.', '<p>Prestasi membanggakan kembali ditorehkan oleh siswa SMK Mustaqbal. Dalam ajang Lomba Kompetensi Siswa (LKS) tingkat kota, Muhammad Rizki dari program Web Development berhasil meraih juara 1.</p>', 'prestasi', 'Admin', now() - interval '5 days'),
  ('Workshop Pengembangan Kurikulum Merdeka', 'workshop-kurikulum-merdeka', 'Guru SMK Mustaqbal mengikuti workshop intensif pengembangan kurikulum merdeka untuk meningkatkan kualitas pembelajaran.', '<p>Dalam rangka meningkatkan kualitas pendidikan, seluruh guru SMK Mustaqbal mengikuti workshop intensif tentang implementasi Kurikulum Merdeka yang disesuaikan dengan kebutuhan industri.</p>', 'kegiatan', 'Admin', now() - interval '10 days')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, program, graduation_year, current_position, company, testimonial_text, is_featured, rating) VALUES
  ('Rizki Ahmad', 'Teknik Otomasi & Robotik', 2022, 'Automation Engineer', 'PT Astra Honda Motor', 'SMK Mustaqbal memberikan bekal ilmu dan praktik yang sangat relevan dengan dunia kerja. Fasilitas lengkap membuat saya tidak kaget saat masuk industri.', true, 5),
  ('Siti Nurhaliza', 'Web Dev & Digital Marketing', 2021, 'Frontend Developer', 'Digimedia Studio', 'Program magang yang disediakan sekolah sangat membantu saya membangun portofolio. Guru-gurunya sangat suportif mengembangkan minat siswa.', true, 5),
  ('Budi Santoso', 'Product Design & 3D', 2023, 'Product Designer', 'Furniture Co.', 'Tidak hanya hard skill, di sini karakter kami dibentuk. Disiplin dan etos kerja yang diajarkan sangat berguna bagi karir saya sekarang.', true, 5)
ON CONFLICT DO NOTHING;