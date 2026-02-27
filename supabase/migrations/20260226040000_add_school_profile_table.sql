-- =============================================
-- School Profile Table Migration
-- Created: 2026-02-26
-- Purpose: Store school profile information, tagline, and video
-- =============================================

-- Create school_profile table
CREATE TABLE IF NOT EXISTS school_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profil_text TEXT NOT NULL DEFAULT '',
    tag_line VARCHAR(500) NOT NULL DEFAULT '',
    tag_line_description TEXT NOT NULL DEFAULT '',
    youtube_video_id VARCHAR(100) NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE school_profile ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to school_profile"
    ON school_profile FOR SELECT
    USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update school_profile"
    ON school_profile FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert default record (will be the only record)
INSERT INTO school_profile (profil_text, tag_line, tag_line_description, youtube_video_id)
VALUES (
    'SMK Mustaqbal Flexy College adalah institusi pendidikan vokasi yang bertekad menciptakan generasi muda yang tidak hanya kompeten secara teknis, tetapi juga memiliki karakter Islami yang kuat.\n\nDidirikan dengan visi untuk menjadi lembaga pendidikan unggul yang menghasilkan lulusannya siap kerja dan创业 (berwirausaha), kami menggabungkan kurikulum akademik dengan keterampilan praktis yang relevan dengan kebutuhan industri masa depan.',
    'Reach Your Success',
    'Setiap siswa memiliki potensi luar biasa. Dengan dukungan pengajar profesional, fasilitas modern, dan lingkungan belajar yang kondusif, kami berkomitmen untuk membimbing setiap siswa mencapai kesuksesan dalam karir dan hidupnya.',
    'dQw4w9WgXcQ'
) ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_school_profile_active ON school_profile(is_active) WHERE is_active = true;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_school_profile_updated_at
    BEFORE UPDATE ON school_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE school_profile IS 'Tabel berisi profil sekolah, tagline, dan video profile untuk halaman tentang';
COMMENT ON COLUMN school_profile.profil_text IS 'Teks paragraf tentang profil sekolah';
COMMENT ON COLUMN school_profile.tag_line IS 'Teks quote/tagline sekolah';
COMMENT ON COLUMN school_profile.tag_line_description IS 'Deskripsi singkat tagline';
COMMENT ON COLUMN school_profile.youtube_video_id IS 'ID video YouTube (bukan full URL)';
