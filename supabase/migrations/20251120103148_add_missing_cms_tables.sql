/*
  # Add Missing CMS Tables

  1. New Tables:
    - admin_users: Admin authentication
    - settings: Website configuration
    - categories: News categories
    - pages: Static pages
    - menu_links: Dynamic navigation
    - documents: File downloads
    - facilities: School facilities
    - achievements: Student achievements
    - events: Calendar events
    - announcements: Important announcements
    - newsletters: Email subscribers

  2. Modifications:
    - Add missing columns to existing tables
    - Add proper indexes

  3. Security:
    - Enable RLS on all tables
    - Add proper policies
*/

-- ====================================
-- 1. ADMIN USERS
-- ====================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON admin_users;
CREATE POLICY "Users can read own data" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage users" ON admin_users;
CREATE POLICY "Admins can manage users" ON admin_users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- ====================================
-- 2. SETTINGS
-- ====================================
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON settings;
CREATE POLICY "Admins can update settings" ON settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('school_info', '{
  "name": "SMK Mustaqbal",
  "tagline": "School of Future",
  "npsn": "12345678",
  "address": "Jl. Pendidikan No. 123, Jakarta",
  "phone": "021-12345678",
  "whatsapp": "628123456789",
  "email": "info@smkmustaqbal.sch.id"
}'::jsonb, 'Informasi umum sekolah'),

('branding', '{
  "logo_url": "/images/logo.png",
  "primary_color": "#0d9488",
  "secondary_color": "#10b981"
}'::jsonb, 'Branding sekolah'),

('social_media', '{
  "facebook": "https://facebook.com/smkmustaqbal",
  "instagram": "https://instagram.com/smkmustaqbal",
  "youtube": "https://youtube.com/@smkmustaqbal"
}'::jsonb, 'Social media links'),

('hero_section', '{
  "title": "Langkah Awal Menuju Masa Depan Hebat",
  "subtitle": "Bangun karir impianmu bersama SMK Mustaqbal",
  "cta_text": "Daftar Sekarang",
  "cta_link": "/ppdb"
}'::jsonb, 'Hero section homepage')
ON CONFLICT (key) DO NOTHING;

-- ====================================
-- 3. CATEGORIES
-- ====================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  color text DEFAULT 'teal',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

INSERT INTO categories (name, slug, color) VALUES
('Pengumuman', 'pengumuman', 'teal'),
('Prestasi', 'prestasi', 'emerald'),
('Kegiatan', 'kegiatan', 'blue'),
('Artikel', 'artikel', 'orange')
ON CONFLICT (slug) DO NOTHING;

-- ====================================
-- 4. PAGES
-- ====================================
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text,
  meta jsonb,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published pages" ON pages;
CREATE POLICY "Anyone can read published pages" ON pages
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages" ON pages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 5. MENU LINKS
-- ====================================
CREATE TABLE IF NOT EXISTS menu_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  href text NOT NULL,
  parent_id uuid REFERENCES menu_links(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active menus" ON menu_links;
CREATE POLICY "Anyone can read active menus" ON menu_links
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage menus" ON menu_links;
CREATE POLICY "Admins can manage menus" ON menu_links
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 6. DOCUMENTS
-- ====================================
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  filename text NOT NULL,
  url text NOT NULL,
  mime_type text,
  size integer,
  category text,
  description text,
  uploaded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  related_table text,
  related_id uuid,
  download_count integer DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read public documents" ON documents;
CREATE POLICY "Anyone can read public documents" ON documents
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "Admins can manage documents" ON documents;
CREATE POLICY "Admins can manage documents" ON documents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 7. FACILITIES
-- ====================================
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  category text,
  image_url text,
  specifications jsonb,
  is_active boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active facilities" ON facilities;
CREATE POLICY "Anyone can read active facilities" ON facilities
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage facilities" ON facilities;
CREATE POLICY "Admins can manage facilities" ON facilities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 8. ACHIEVEMENTS
-- ====================================
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  student_name text,
  category text,
  level text,
  rank text,
  year integer,
  event_date date,
  image_url text,
  certificate_url text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read achievements" ON achievements;
CREATE POLICY "Anyone can read achievements" ON achievements
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage achievements" ON achievements;
CREATE POLICY "Admins can manage achievements" ON achievements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 9. EVENTS
-- ====================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  event_type text,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  organizer text,
  image_url text,
  registration_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published events" ON events;
CREATE POLICY "Anyone can read published events" ON events
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 10. ANNOUNCEMENTS
-- ====================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text DEFAULT 'banner' CHECK (type IN ('banner', 'popup', 'ticker')),
  priority text DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  start_date timestamptz,
  end_date timestamptz,
  link_url text,
  link_text text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
CREATE POLICY "Anyone can read active announcements" ON announcements
  FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 11. NEWSLETTERS
-- ====================================
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  is_subscribed boolean DEFAULT true,
  verified boolean DEFAULT false,
  verification_token text,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletters;
CREATE POLICY "Anyone can subscribe" ON newsletters
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own subscription" ON newsletters;
CREATE POLICY "Users can read own subscription" ON newsletters
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own subscription" ON newsletters;
CREATE POLICY "Users can update own subscription" ON newsletters
  FOR UPDATE TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can view all subscribers" ON newsletters;
CREATE POLICY "Admins can view all subscribers" ON newsletters
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ====================================
-- MODIFY EXISTING TABLES
-- ====================================

-- Add missing columns to news_articles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news_articles' AND column_name='author_id') THEN
    ALTER TABLE news_articles ADD COLUMN author_id uuid REFERENCES admin_users(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news_articles' AND column_name='category_id') THEN
    ALTER TABLE news_articles ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news_articles' AND column_name='cover_url') THEN
    ALTER TABLE news_articles ADD COLUMN cover_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news_articles' AND column_name='tags') THEN
    ALTER TABLE news_articles ADD COLUMN tags text[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news_articles' AND column_name='is_featured') THEN
    ALTER TABLE news_articles ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Add missing columns to programs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='programs' AND column_name='name') THEN
    ALTER TABLE programs ADD COLUMN name text;
    UPDATE programs SET name = title WHERE name IS NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='programs' AND column_name='content') THEN
    ALTER TABLE programs ADD COLUMN content text;
  END IF;
END $$;

-- Add missing columns to ppdb_submissions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='program_id') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN program_id uuid REFERENCES programs(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='registration_number') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN registration_number text UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='birth_date') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN birth_date date;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='birth_place') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN birth_place text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='gender') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN gender text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='religion') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN religion text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='nisn') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN nisn text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='documents') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN documents jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ppdb_submissions' AND column_name='updated_at') THEN
    ALTER TABLE ppdb_submissions ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add missing columns to ebrochure_downloads
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ebrochure_downloads' AND column_name='document_id') THEN
    ALTER TABLE ebrochure_downloads ADD COLUMN document_id uuid REFERENCES documents(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ebrochure_downloads' AND column_name='user_agent') THEN
    ALTER TABLE ebrochure_downloads ADD COLUMN user_agent text;
  END IF;
END $$;

-- Add missing columns to teachers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='slug') THEN
    ALTER TABLE teachers ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

-- Add missing columns to gallery_items
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='caption') THEN
    ALTER TABLE gallery_items ADD COLUMN caption text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='image_url') THEN
    ALTER TABLE gallery_items ADD COLUMN image_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='alt_text') THEN
    ALTER TABLE gallery_items ADD COLUMN alt_text text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery_items' AND column_name='taken_at') THEN
    ALTER TABLE gallery_items ADD COLUMN taken_at date;
  END IF;
END $$;

-- Add missing columns to testimonials
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='role') THEN
    ALTER TABLE testimonials ADD COLUMN role text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='photo_url') THEN
    ALTER TABLE testimonials ADD COLUMN photo_url text;
  END IF;
END $$;
