/*
  # Partners/Mitra Table Migration
  
  1. Create partners table with UUID primary key
  2. Add RLS policies for public read and authenticated write
  3. Create index on sort_order for query optimization
  4. Add storage bucket for partner logos
*/

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  link_url TEXT DEFAULT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on sort_order for optimized queries
CREATE INDEX IF NOT EXISTS idx_partners_sort_order ON partners(sort_order ASC);

-- Create index on is_active for filtered queries
CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies if any
DROP POLICY IF EXISTS "Anyone can read partners" ON partners;
DROP POLICY IF EXISTS "Authenticated users can insert partners" ON partners;
DROP POLICY IF EXISTS "Authenticated users can update partners" ON partners;
DROP POLICY IF EXISTS "Authenticated users can delete partners" ON partners;

-- RLS Policies
-- Public read access
CREATE POLICY "Anyone can read partners" ON partners 
FOR SELECT USING (is_active = true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert partners" ON partners 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update partners" ON partners 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete partners" ON partners 
FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;

-- Create trigger
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('partner-logos', 'partner-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Public read access for partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete partner logos" ON storage.objects;

-- Storage policies for partner-logos bucket
CREATE POLICY "Public read access for partner logos" ON storage.objects 
FOR SELECT USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can upload partner logos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'partner-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update partner logos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'partner-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete partner logos" ON storage.objects 
FOR DELETE USING (bucket_id = 'partner-logos' AND auth.role() = 'authenticated');
