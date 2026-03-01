-- ============================================================
-- FASE 2: Portfolio Dynamic CMS - Skema Database
-- Tanggal: 2026-03-01
-- ============================================================

-- 1. Tabel portfolio_items untuk menyimpan data portfolio siswa
-- Hapus tabel jika sudah ada (hati-hati: data akan hilang!)
DROP TABLE IF EXISTS portfolio_items;

-- Buat tabel baru
CREATE TABLE portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes untuk performa query
CREATE INDEX idx_portfolio_items_category ON portfolio_items(category);
CREATE INDEX idx_portfolio_items_program ON portfolio_items(program);
CREATE INDEX idx_portfolio_items_year ON portfolio_items(year);
CREATE INDEX idx_portfolio_items_is_featured ON portfolio_items(is_featured);
CREATE INDEX idx_portfolio_items_created_at ON portfolio_items(created_at DESC);

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_portfolio_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_portfolio_items_updated_at ON portfolio_items;
CREATE TRIGGER trigger_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_portfolio_items_updated_at();

-- 2. Row Level Security (RLS) Policies
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Hapus policies yang mungkin sudah ada
DROP POLICY IF EXISTS "Allow public read access" ON portfolio_items;
DROP POLICY IF EXISTS "Allow authenticated insert" ON portfolio_items;
DROP POLICY IF EXISTS "Allow authenticated update" ON portfolio_items;
DROP POLICY IF EXISTS "Allow authenticated delete" ON portfolio_items;

-- Buat policies baru
CREATE POLICY "Allow public read access" ON portfolio_items
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON portfolio_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON portfolio_items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON portfolio_items
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Insert default page_settings untuk Portfolio Layout
INSERT INTO page_settings (page_name, content, created_at, updated_at)
VALUES (
    'portfolio',
    '{
        "page_title": "Portfolio Karya Siswa",
        "page_subtitle": "Lihat karya terbaik dari siswa-siswi SMK Mustaqbal di berbagai bidang keahlian.",
        "show_filter": true,
        "show_search": true,
        "categories": ["Semua", "Teknik", "Design", "Web Development", "Networking", "Mobile Development", "Robotik"],
        "display_style": "grid",
        "items_per_page": 12
    }'::jsonb,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
)
ON CONFLICT (page_name) DO UPDATE SET
    content = EXCLUDED.content,
    updated_at = timezone('utc'::text, now());

-- 4. Insert sample data portfolio (optional - untuk testing)
INSERT INTO portfolio_items (title, student_name, program, category, year, description, image_url, project_url, is_featured)
VALUES
    ('Sistem Monitoring IoT Industri', 'Ahmad Rizki', 'Teknik Otomasi & Robotik', 'Teknik', 2023, 'Sistem monitoring suhu dan kelembaban industri berbasis IoT dengan notifikasi real-time', 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800', '', true),
    ('Desain Produk Furnitur Modular', 'Siti Nur Haliza', 'Product Design & 3D', 'Design', 2023, 'Desain furnitur modular yang dapat disesuaikan dengan berbagai kebutuhan ruangan', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800', '', true),
    ('Website E-Commerce Modern', 'Budi Santoso', 'Web Dev & Digital Marketing', 'Web Development', 2023, 'Platform e-commerce dengan fitur payment gateway dan sistem tracking pengiriman', 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://demo.com', false);
