-- Add category column to partners table
-- This restores the category feature that was in the original hardcoded partners array

ALTER TABLE partners ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT NULL;

-- Create index on category for filtered queries
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category) WHERE category IS NOT NULL;

-- Update comment
COMMENT ON COLUMN partners.category IS 'Kategori mitra (cth: Perbankan, Otomotif, Energi, Telekomunikasi)';
