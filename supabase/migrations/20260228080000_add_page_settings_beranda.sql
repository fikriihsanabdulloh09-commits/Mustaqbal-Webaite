-- Migration: Add page_settings table for beranda CMS
-- Date: 2026-02-28
-- Purpose: Store page-specific settings for beranda (homepage) in JSONB format

-- Create page_settings table
CREATE TABLE IF NOT EXISTS page_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name VARCHAR(100) NOT NULL UNIQUE,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_settings_page_name ON page_settings(page_name);

-- Enable RLS
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to select
CREATE POLICY "Allow authenticated users to select page_settings"
    ON page_settings FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert page_settings"
    ON page_settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update page_settings"
    ON page_settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policy: Allow service role to do everything
CREATE POLICY "Allow service role full access to page_settings"
    ON page_settings FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Insert default beranda settings if not exists
INSERT INTO page_settings (page_name, content) VALUES (
    'beranda',
    '{
        "hero": {
            "welcome_text": "Penerimaan Siswa Baru Telah Dibuka",
            "title": "Langkah Awal Menuju Masa Depan Hebat",
            "subtitle": "Bangun karir impianmu bersama SMK Mustaqbal. Kurikulum berbasis industri, fasilitas modern, dan jaminan penyaluran kerja ke perusahaan ternama.",
            "cta_primary_text": "Daftar Sekarang",
            "cta_secondary_text": "Unduh Kurikulum",
            "ebrosur": {
                "card_title": "Download E-Brosur",
                "card_description": "Isi data diri Anda untuk mendapatkan informasi lengkap mengenai biaya dan kurikulum.",
                "button_text": "Kirim & Download PDF"
            }
        },
        "features": {
            "section_title": "Keunggulan Akademik & Fasilitas Terbaik",
            "section_subtitle": "Kami tidak hanya mencetak lulusan yang pintar secara teori, tetapi juga terampil, berkarakter, dan siap bersaing di era global.",
            "items": [
                {
                    "icon": "Layers",
                    "title": "Pembelajaran 70% Praktik",
                    "description": "Metode pembelajaran hands-on di laboratorium modern memastikan siswa memiliki skill teknis yang kuat sesuai standar industri."
                },
                {
                    "icon": "Award",
                    "title": "Guru Praktisi & Ahli",
                    "description": "Dididik langsung oleh tenaga pengajar bersertifikat dan praktisi industri yang berpengalaman di bidangnya masing-masing."
                },
                {
                    "icon": "Briefcase",
                    "title": "Penyaluran Kerja",
                    "description": "Kerjasama dengan 50+ perusahaan multinasional untuk program magang dan rekrutmen langsung setelah lulus."
                }
            ]
        },
        "programs": {
            "section_title": "Siapkan Diri Menjadi Ahli",
            "section_subtitle": "Pilih program keahlian yang sesuai dengan minat dan bakatmu untuk masa depan yang cerah."
        },
        "partners": {
            "section_title": "Dipercaya oleh Perusahaan Terkemuka",
            "section_subtitle": "Lebih dari 50+ perusahaan bermitra dengan kami untuk program magang, rekrutmen, dan pengembangan kurikulum",
            "statistics": [
                {"value": "50+", "label": "Mitra Industri"},
                {"value": "90%", "label": "Siswa Tersampaikan"},
                {"value": "1000+", "label": "Alumni Bekerja"}
            ]
        },
        "testimonials": {
            "section_title": "Apa Kata Alumni Kami?",
            "section_subtitle": "Kisah sukses dari lulusan terbaik kami"
        },
        "news": {
            "section_title": "Seputar SMK Mustaqbal",
            "section_subtitle": "Berita terkini tentang kegiatan dan prestasi sekolah"
        },
        "whatsapp_widget": {
            "enabled": true,
            "title": "Konsultasi Gratis",
            "description": "Halo, saya ingin konsultasi gratis tentang SMK Mustaqbal",
            "default_message": "Halo, saya ingin konsultasi gratis tentang SMK Mustaqbal",
            "phone_number": "6281234567890"
        }
    }'::jsonb
) ON CONFLICT (page_name) DO NOTHING;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_page_settings_updated_at ON page_settings;
CREATE TRIGGER update_page_settings_updated_at
    BEFORE UPDATE ON page_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE page_settings IS 'Stores page-specific settings in JSONB format. Used for CMS-like page editing.';
COMMENT ON COLUMN page_settings.page_name IS 'Unique identifier for the page (e.g., beranda, tentang, kontak)';
COMMENT ON COLUMN page_settings.content IS 'JSON object containing all settings for the page';
