/*
  # Page Builder & Theme Management System

  1. New Tables:
    - page_sections: Section components yang bisa ditambah/hapus/edit
    - themes: Theme presets (colors, fonts, spacing)
    - page_styles: Custom styles per page
    - section_types: Template section yang tersedia
    - media_library: Manage uploaded images/files
    - global_styles: Global CSS variables

  2. Features:
    - Visual page builder
    - Section management (add, edit, delete, reorder)
    - Theme customization (colors, fonts, spacing)
    - Style editor per section
    - Media library management

  3. Security:
    - RLS enabled on all tables
    - Admin-only write access
*/

-- ====================================
-- 1. SECTION TYPES (Templates)
-- ====================================
CREATE TABLE IF NOT EXISTS section_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  category text DEFAULT 'general',
  default_content jsonb DEFAULT '{}'::jsonb,
  default_styles jsonb DEFAULT '{}'::jsonb,
  preview_image text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE section_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read section types" ON section_types;
CREATE POLICY "Anyone can read section types" ON section_types
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage section types" ON section_types;
CREATE POLICY "Admins can manage section types" ON section_types
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- Insert default section types
INSERT INTO section_types (name, display_name, description, category, default_content, default_styles) VALUES
('hero', 'Hero Section', 'Large banner with title and CTA', 'header', 
  '{"title": "Welcome", "subtitle": "Your subtitle here", "buttonText": "Get Started", "buttonLink": "/", "backgroundImage": ""}'::jsonb,
  '{"backgroundColor": "#0d9488", "textColor": "#ffffff", "height": "600px", "fontSize": "48px"}'::jsonb),
  
('text_block', 'Text Block', 'Simple text content block', 'content',
  '{"title": "Section Title", "content": "Your content here", "alignment": "left"}'::jsonb,
  '{"backgroundColor": "#ffffff", "textColor": "#1f2937", "padding": "64px", "fontSize": "16px"}'::jsonb),

('image_text', 'Image + Text', 'Image alongside text content', 'content',
  '{"title": "Title", "content": "Content", "imageUrl": "", "imagePosition": "left"}'::jsonb,
  '{"backgroundColor": "#f9fafb", "textColor": "#1f2937", "padding": "64px", "fontSize": "16px"}'::jsonb),

('cards_grid', 'Cards Grid', 'Grid of cards (features, services, etc)', 'content',
  '{"title": "Our Services", "cards": [{"title": "Card 1", "description": "Description", "icon": "Star"}]}'::jsonb,
  '{"backgroundColor": "#ffffff", "cardBackground": "#f9fafb", "textColor": "#1f2937", "columns": 3}'::jsonb),

('cta_banner', 'Call to Action', 'CTA banner with button', 'cta',
  '{"title": "Ready to Start?", "subtitle": "Join us today", "buttonText": "Sign Up", "buttonLink": "/ppdb"}'::jsonb,
  '{"backgroundColor": "#10b981", "textColor": "#ffffff", "padding": "80px", "fontSize": "32px"}'::jsonb),

('gallery', 'Gallery', 'Image gallery grid', 'media',
  '{"title": "Gallery", "images": []}'::jsonb,
  '{"backgroundColor": "#ffffff", "columns": 4, "gap": "16px"}'::jsonb),

('testimonials', 'Testimonials', 'Customer testimonials slider', 'content',
  '{"title": "What People Say", "testimonials": []}'::jsonb,
  '{"backgroundColor": "#f9fafb", "textColor": "#1f2937", "padding": "64px"}'::jsonb),

('stats', 'Statistics', 'Number stats display', 'content',
  '{"title": "Our Impact", "stats": [{"label": "Students", "value": "1000+"}]}'::jsonb,
  '{"backgroundColor": "#0d9488", "textColor": "#ffffff", "padding": "64px"}'::jsonb),

('contact_form', 'Contact Form', 'Contact form with fields', 'form',
  '{"title": "Get in Touch", "fields": ["name", "email", "message"]}'::jsonb,
  '{"backgroundColor": "#ffffff", "textColor": "#1f2937", "padding": "64px"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ====================================
-- 2. PAGE SECTIONS (Actual Sections)
-- ====================================
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  section_type_id uuid REFERENCES section_types(id) ON DELETE CASCADE,
  section_name text,
  order_position integer DEFAULT 0,
  content jsonb DEFAULT '{}'::jsonb,
  styles jsonb DEFAULT '{}'::jsonb,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read visible sections" ON page_sections;
CREATE POLICY "Anyone can read visible sections" ON page_sections
  FOR SELECT TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins can manage sections" ON page_sections;
CREATE POLICY "Admins can manage sections" ON page_sections
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 3. THEMES
-- ====================================
CREATE TABLE IF NOT EXISTS themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  colors jsonb NOT NULL,
  fonts jsonb NOT NULL,
  spacing jsonb DEFAULT '{}'::jsonb,
  borders jsonb DEFAULT '{}'::jsonb,
  shadows jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT false,
  preview_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read themes" ON themes;
CREATE POLICY "Anyone can read themes" ON themes
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage themes" ON themes;
CREATE POLICY "Admins can manage themes" ON themes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- Insert default themes
INSERT INTO themes (name, display_name, description, colors, fonts, is_active) VALUES
('default', 'Default Theme', 'Original teal theme', 
  '{
    "primary": "#0d9488",
    "secondary": "#10b981",
    "accent": "#3b82f6",
    "background": "#ffffff",
    "foreground": "#1f2937",
    "muted": "#f9fafb",
    "mutedForeground": "#6b7280",
    "border": "#e5e7eb",
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444"
  }'::jsonb,
  '{
    "heading": "Poppins",
    "body": "Inter",
    "headingSizes": {
      "h1": "48px",
      "h2": "36px",
      "h3": "30px",
      "h4": "24px",
      "h5": "20px",
      "h6": "18px"
    },
    "bodySize": "16px",
    "lineHeight": {
      "heading": "1.2",
      "body": "1.6"
    }
  }'::jsonb,
  true),

('modern', 'Modern Dark', 'Modern dark theme with blue accents',
  '{
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#06b6d4",
    "background": "#0f172a",
    "foreground": "#f8fafc",
    "muted": "#1e293b",
    "mutedForeground": "#94a3b8",
    "border": "#334155",
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444"
  }'::jsonb,
  '{
    "heading": "Inter",
    "body": "Inter",
    "headingSizes": {
      "h1": "56px",
      "h2": "40px",
      "h3": "32px",
      "h4": "24px",
      "h5": "20px",
      "h6": "18px"
    },
    "bodySize": "16px",
    "lineHeight": {
      "heading": "1.1",
      "body": "1.7"
    }
  }'::jsonb,
  false),

('minimalist', 'Minimalist', 'Clean minimalist theme',
  '{
    "primary": "#18181b",
    "secondary": "#52525b",
    "accent": "#a1a1aa",
    "background": "#ffffff",
    "foreground": "#09090b",
    "muted": "#f4f4f5",
    "mutedForeground": "#71717a",
    "border": "#e4e4e7",
    "success": "#22c55e",
    "warning": "#eab308",
    "error": "#dc2626"
  }'::jsonb,
  '{
    "heading": "Inter",
    "body": "Inter",
    "headingSizes": {
      "h1": "42px",
      "h2": "34px",
      "h3": "28px",
      "h4": "22px",
      "h5": "18px",
      "h6": "16px"
    },
    "bodySize": "15px",
    "lineHeight": {
      "heading": "1.3",
      "body": "1.65"
    }
  }'::jsonb,
  false)
ON CONFLICT (name) DO NOTHING;

-- ====================================
-- 4. PAGE STYLES (Custom per page)
-- ====================================
CREATE TABLE IF NOT EXISTS page_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  custom_css text,
  custom_js text,
  meta_tags jsonb DEFAULT '{}'::jsonb,
  seo_settings jsonb DEFAULT '{}'::jsonb,
  theme_overrides jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_styles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read page styles" ON page_styles;
CREATE POLICY "Anyone can read page styles" ON page_styles
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage page styles" ON page_styles;
CREATE POLICY "Admins can manage page styles" ON page_styles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- 5. GLOBAL STYLES (CSS Variables)
-- ====================================
CREATE TABLE IF NOT EXISTS global_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  category text DEFAULT 'general',
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE global_styles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read global styles" ON global_styles;
CREATE POLICY "Anyone can read global styles" ON global_styles
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage global styles" ON global_styles;
CREATE POLICY "Admins can manage global styles" ON global_styles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- Insert default global styles
INSERT INTO global_styles (key, value, category, description) VALUES
('--font-heading', 'Poppins', 'typography', 'Heading font family'),
('--font-body', 'Inter', 'typography', 'Body font family'),
('--color-primary', '#0d9488', 'colors', 'Primary brand color'),
('--color-secondary', '#10b981', 'colors', 'Secondary brand color'),
('--spacing-base', '8px', 'spacing', 'Base spacing unit'),
('--border-radius', '8px', 'borders', 'Default border radius'),
('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)', 'shadows', 'Small shadow'),
('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1)', 'shadows', 'Medium shadow')
ON CONFLICT (key) DO NOTHING;

-- ====================================
-- 6. MEDIA LIBRARY
-- ====================================
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_filename text NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  mime_type text NOT NULL,
  size integer NOT NULL,
  width integer,
  height integer,
  alt_text text,
  caption text,
  folder text DEFAULT 'root',
  uploaded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read media" ON media_library;
CREATE POLICY "Anyone can read media" ON media_library
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage media" ON media_library;
CREATE POLICY "Admins can manage media" ON media_library
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role IN ('admin', 'editor')
    )
  );

-- ====================================
-- INDEXES
-- ====================================
CREATE INDEX IF NOT EXISTS idx_page_sections_path ON page_sections(page_path, order_position);
CREATE INDEX IF NOT EXISTS idx_page_sections_type ON page_sections(section_type_id);
CREATE INDEX IF NOT EXISTS idx_page_styles_path ON page_styles(page_path);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_library(mime_type);
CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active);

-- ====================================
-- TRIGGERS
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_page_sections_updated_at') THEN
    CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON page_sections
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_themes_updated_at') THEN
    CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_page_styles_updated_at') THEN
    CREATE TRIGGER update_page_styles_updated_at BEFORE UPDATE ON page_styles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_global_styles_updated_at') THEN
    CREATE TRIGGER update_global_styles_updated_at BEFORE UPDATE ON global_styles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
