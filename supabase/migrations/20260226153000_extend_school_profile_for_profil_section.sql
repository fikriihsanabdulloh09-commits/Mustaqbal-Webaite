-- =============================================
-- Extend school_profile for Profil Sekolah section
-- Created: 2026-02-26
-- =============================================

ALTER TABLE school_profile
  ADD COLUMN IF NOT EXISTS profile_highlight_quote TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS quote_text TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS youtube_video_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS video_file_url TEXT;

-- Backfill data from legacy columns
UPDATE school_profile
SET
  quote_text = CASE
    WHEN quote_text = '' THEN COALESCE(tag_line, '')
    ELSE quote_text
  END,
  youtube_video_url = CASE
    WHEN youtube_video_url = '' AND youtube_video_id <> '' THEN 'https://www.youtube.com/watch?v=' || youtube_video_id
    ELSE youtube_video_url
  END,
  profile_highlight_quote = CASE
    WHEN profile_highlight_quote = '' THEN 'SMK Mustaqbal membina karakter, kompetensi, dan kesiapan kerja untuk masa depan siswa.'
    ELSE profile_highlight_quote
  END;

COMMENT ON COLUMN school_profile.profile_highlight_quote IS 'Quote/highlight pada kolom profil';
COMMENT ON COLUMN school_profile.quote_text IS 'Quote italic pada bagian Tag Line';
COMMENT ON COLUMN school_profile.youtube_video_url IS 'URL YouTube penuh untuk video profil';
COMMENT ON COLUMN school_profile.video_file_url IS 'URL fallback video upload dari storage';
