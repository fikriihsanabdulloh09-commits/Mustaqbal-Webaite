/*
  # Animation & Logo Management System
  
  ## New Tables
  1. animations - Store built-in and custom animations
  2. section_animations - Link animations to page sections
  3. site_branding - Logo and branding assets
  
  ## Features
  - Built-in animation library
  - Custom animation upload
  - Per-section animation settings
  - Logo management (main, favicon, footer)
  - Real-time updates
*/

-- ========================================
-- 1. ANIMATIONS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS animations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'css', -- 'css', 'keyframe', 'library'
  category text NOT NULL DEFAULT 'entrance', -- 'entrance', 'exit', 'attention', 'scroll'
  animation_code text NOT NULL, -- CSS animation code or class name
  preview_url text,
  is_builtin boolean DEFAULT true,
  is_active boolean DEFAULT true,
  duration_ms integer DEFAULT 1000,
  easing text DEFAULT 'ease',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active animations"
  ON animations FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage animations"
  ON animations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 2. SECTION ANIMATIONS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS section_animations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES page_sections(id) ON DELETE CASCADE,
  animation_id uuid REFERENCES animations(id) ON DELETE SET NULL,
  trigger_type text DEFAULT 'viewport', -- 'viewport', 'click', 'hover', 'load'
  trigger_offset integer DEFAULT 0, -- percentage for viewport trigger
  delay_ms integer DEFAULT 0,
  repeat boolean DEFAULT false,
  custom_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE section_animations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read section animations"
  ON section_animations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage section animations"
  ON section_animations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 3. SITE BRANDING TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS site_branding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  asset_type text NOT NULL, -- 'logo', 'favicon', 'og_image'
  url text NOT NULL,
  alt_text text,
  width integer,
  height integer,
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active branding"
  ON site_branding FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage branding"
  ON site_branding FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 4. SEED BUILT-IN ANIMATIONS
-- ========================================

INSERT INTO animations (name, display_name, description, category, animation_code, duration_ms, easing) VALUES
  -- ENTRANCE ANIMATIONS
  ('fadeIn', 'Fade In', 'Smooth fade in effect', 'entrance', 'animate-fadeIn', 800, 'ease-in'),
  ('slideInUp', 'Slide In Up', 'Slide in from bottom', 'entrance', 'animate-slideInUp', 600, 'ease-out'),
  ('slideInDown', 'Slide In Down', 'Slide in from top', 'entrance', 'animate-slideInDown', 600, 'ease-out'),
  ('slideInLeft', 'Slide In Left', 'Slide in from left', 'entrance', 'animate-slideInLeft', 600, 'ease-out'),
  ('slideInRight', 'Slide In Right', 'Slide in from right', 'entrance', 'animate-slideInRight', 600, 'ease-out'),
  ('zoomIn', 'Zoom In', 'Scale up from small', 'entrance', 'animate-zoomIn', 600, 'ease-out'),
  ('bounceIn', 'Bounce In', 'Bounce entrance effect', 'entrance', 'animate-bounceIn', 800, 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'),
  ('rotateIn', 'Rotate In', 'Rotate and fade in', 'entrance', 'animate-rotateIn', 800, 'ease'),
  
  -- SCROLL ANIMATIONS
  ('parallaxSlow', 'Parallax Slow', 'Slow parallax scroll effect', 'scroll', 'animate-parallax-slow', 0, 'linear'),
  ('parallaxFast', 'Parallax Fast', 'Fast parallax scroll effect', 'scroll', 'animate-parallax-fast', 0, 'linear'),
  ('stickyReveal', 'Sticky Reveal', 'Reveal on scroll with sticky', 'scroll', 'animate-sticky-reveal', 600, 'ease-out'),
  
  -- ATTENTION ANIMATIONS
  ('pulse', 'Pulse', 'Pulsing effect', 'attention', 'animate-pulse', 1000, 'ease-in-out'),
  ('shake', 'Shake', 'Shaking effect', 'attention', 'animate-shake', 500, 'ease'),
  ('bounce', 'Bounce', 'Bouncing effect', 'attention', 'animate-bounce', 1000, 'ease'),
  ('swing', 'Swing', 'Swinging effect', 'attention', 'animate-swing', 1000, 'ease-in-out'),
  ('tada', 'Tada', 'Attention-grabbing effect', 'attention', 'animate-tada', 1000, 'ease'),
  ('wobble', 'Wobble', 'Wobbling effect', 'attention', 'animate-wobble', 1000, 'ease')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- 5. SEED DEFAULT BRANDING
-- ========================================

INSERT INTO site_branding (key, asset_type, url, alt_text, settings) VALUES
  ('main_logo', 'logo', '/images/logo.png', 'SMK Mustaqbal Logo', '{"position": "header", "maxHeight": 60}'::jsonb),
  ('favicon', 'favicon', '/favicon.ico', 'SMK Mustaqbal Favicon', '{"size": 32}'::jsonb),
  ('og_image', 'og_image', '/images/og-image.jpg', 'SMK Mustaqbal', '{"width": 1200, "height": 630}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- 6. ADD ANIMATION COLUMN TO PAGE_SECTIONS
-- ========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_sections' AND column_name = 'animation_settings'
  ) THEN
    ALTER TABLE page_sections ADD COLUMN animation_settings jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ========================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_animations_category ON animations(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_animations_type ON animations(type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_section_animations_section ON section_animations(section_id);
CREATE INDEX IF NOT EXISTS idx_site_branding_key ON site_branding(key) WHERE is_active = true;
