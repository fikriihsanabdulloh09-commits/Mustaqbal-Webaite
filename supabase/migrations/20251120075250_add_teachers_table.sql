/*
  # Add Teachers Table

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key)
      - `full_name` (text) - Teacher's full name
      - `nip` (text, optional) - Teacher ID number
      - `position` (text) - Position/role (e.g., "Kepala Sekolah", "Guru Produktif")
      - `subject` (text, optional) - Subject/expertise area
      - `photo_url` (text, optional) - Teacher's photo URL
      - `education` (text, optional) - Educational background
      - `certifications` (text[], optional) - List of certifications
      - `bio` (text, optional) - Short biography
      - `email` (text, optional) - Contact email
      - `phone` (text, optional) - Contact phone
      - `is_active` (boolean) - Whether teacher is currently active
      - `order_position` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `teachers` table
    - Add policy for public read access (teachers info is public)
    - Add policy for authenticated admin insert/update

  3. Sample Data
    - Insert sample teacher profiles
*/

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  nip text,
  position text NOT NULL,
  subject text,
  photo_url text,
  education text,
  certifications text[],
  bio text,
  email text,
  phone text,
  is_active boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers are publicly readable"
  ON teachers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert teachers"
  ON teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update teachers"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample teachers data
INSERT INTO teachers (full_name, nip, position, subject, photo_url, education, certifications, bio, email, phone, order_position) VALUES
(
  'Dr. Ahmad Fauzi, M.Pd',
  '196805151994031005',
  'Kepala Sekolah',
  'Manajemen Pendidikan',
  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
  'S3 Manajemen Pendidikan - Universitas Negeri Jakarta',
  ARRAY['Sertifikat Pendidik', 'Certified Educational Leader', 'ISO 9001 Auditor'],
  'Berpengalaman lebih dari 25 tahun dalam dunia pendidikan vokasi. Memiliki visi untuk mengembangkan SMK Mustaqbal menjadi lembaga pendidikan vokasi terkemuka yang menghasilkan lulusan berkompeten dan siap kerja.',
  'ahmad.fauzi@smkmustaqbal.sch.id',
  '081234567890',
  1
),
(
  'Ir. Budi Santoso, S.T., M.T',
  '197203101998021003',
  'Wakil Kepala Sekolah Bidang Kurikulum',
  'Teknik Elektro',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
  'S2 Teknik Elektro - Institut Teknologi Bandung',
  ARRAY['Sertifikat Pendidik', 'Certified Automation Engineer', 'Project Management Professional'],
  'Ahli dalam pengembangan kurikulum berbasis industri. Aktif berkolaborasi dengan perusahaan untuk memastikan kurikulum sesuai kebutuhan dunia kerja.',
  'budi.santoso@smkmustaqbal.sch.id',
  '081234567891',
  2
),
(
  'Siti Nurhaliza, S.Kom., M.Kom',
  '198505202010012015',
  'Ketua Program Keahlian TKJ',
  'Teknik Komputer dan Jaringan',
  'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
  'S2 Ilmu Komputer - Universitas Indonesia',
  ARRAY['Sertifikat Pendidik', 'CCNA', 'MTCNA', 'CompTIA Network+'],
  'Spesialis jaringan komputer dengan pengalaman industri 8 tahun sebelum menjadi pendidik. Berfokus pada pembelajaran praktis dan hands-on.',
  'siti.nurhaliza@smkmustaqbal.sch.id',
  '081234567892',
  3
),
(
  'Rizki Ramadhan, S.Pd., M.T',
  '199001152015041002',
  'Guru Produktif Robotika',
  'Teknik Otomasi & Robotik',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  'S2 Teknik Mekatronika - Institut Teknologi Sepuluh Nopember',
  ARRAY['Sertifikat Pendidik', 'Arduino Certified', 'Certified ROS Developer'],
  'Penggiat robotika dan IoT. Membimbing siswa meraih berbagai prestasi di kompetisi robotika tingkat nasional.',
  'rizki.ramadhan@smkmustaqbal.sch.id',
  '081234567893',
  4
),
(
  'Dian Pratiwi, S.Ds., M.Ds',
  '199203252016032008',
  'Guru Produktif Desain',
  'Product Design & 3D',
  'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
  'S2 Desain Produk - Institut Teknologi Bandung',
  ARRAY['Sertifikat Pendidik', 'Autodesk Certified', 'Adobe Certified Professional'],
  'Desainer profesional dengan portfolio klien internasional. Mengajarkan desain dengan pendekatan design thinking dan user-centered design.',
  'dian.pratiwi@smkmustaqbal.sch.id',
  '081234567894',
  5
),
(
  'Eko Prasetyo, S.Kom., M.M',
  '198808102014021001',
  'Guru Produktif Web Development',
  'Web Dev & Digital Marketing',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'S2 Manajemen Marketing - Universitas Gadjah Mada',
  ARRAY['Sertifikat Pendidik', 'Google Digital Marketing', 'Meta Blueprint Certified'],
  'Full-stack developer dan digital marketing strategist. Berpengalaman mengelola proyek digital untuk berbagai UMKM dan startup.',
  'eko.prasetyo@smkmustaqbal.sch.id',
  '081234567895',
  6
);
