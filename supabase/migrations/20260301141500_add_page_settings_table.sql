-- Tabel utama untuk pengaturan halaman dengan pendekatan JSONB
CREATE TABLE IF NOT EXISTS page_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT UNIQUE NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_page_settings_updated_at ON page_settings;
CREATE TRIGGER update_page_settings_updated_at
    BEFORE UPDATE ON page_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access for all users (public)
CREATE POLICY "Allow public read access" ON page_settings
    FOR SELECT USING (true);

-- Allow write access only for authenticated users (admin)
CREATE POLICY "Allow authenticated users to modify" ON page_settings
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default data untuk halaman beranda
INSERT INTO page_settings (page_name, content)
VALUES (
    'beranda',
    '{
        "mitra": [
            {
                "id": "1",
                "nama": "Google Indonesia",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            },
            {
                "id": "2",
                "nama": "Microsoft",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            },
            {
                "id": "3",
                "nama": "Amazon Web Services",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
            },
            {
                "id": "4",
                "nama": "Tokopedia",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Tokopedia.svg"
            },
            {
                "id": "5",
                "nama": "Gojek",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/1/19/Gojek_logo_2019.svg"
            }
        ],
        "hero": {
            "title": "Langkah Awal Menuju Masa Depan Hebat",
            "subtitle": "Bangun karir impianmu bersama SMK Mustaqbal"
        }
    }'::jsonb
)
ON CONFLICT (page_name) DO NOTHING;
