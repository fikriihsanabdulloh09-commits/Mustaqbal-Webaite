-- =============================================
-- Seed CMS content for school_profile section
-- Created: 2026-02-26
-- =============================================

DO $$
DECLARE
  school_tagline TEXT;
BEGIN
  SELECT value->>'tagline'
  INTO school_tagline
  FROM settings
  WHERE key = 'school_info'
  LIMIT 1;

  -- Backfill missing fields in existing records.
  UPDATE school_profile
  SET
    profile_highlight_quote = CASE
      WHEN COALESCE(profile_highlight_quote, '') = ''
      THEN 'SMK Mustaqbal membina karakter, menguatkan skill, dan mengantar siswa menuju masa depan profesional.'
      ELSE profile_highlight_quote
    END,
    quote_text = CASE
      WHEN COALESCE(quote_text, '') = ''
      THEN COALESCE(NULLIF(school_tagline, ''), NULLIF(tag_line, ''), 'Reach Your Success...')
      ELSE quote_text
    END,
    youtube_video_url = CASE
      WHEN COALESCE(youtube_video_url, '') = '' AND COALESCE(youtube_video_id, '') <> ''
      THEN 'https://www.youtube.com/watch?v=' || youtube_video_id
      WHEN COALESCE(youtube_video_url, '') = ''
      THEN 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      ELSE youtube_video_url
    END;

  -- Insert dummy CMS record if no active row exists.
  IF NOT EXISTS (SELECT 1 FROM school_profile WHERE is_active = true) THEN
    INSERT INTO school_profile (
      profil_text,
      profile_highlight_quote,
      tag_line,
      quote_text,
      tag_line_description,
      youtube_video_id,
      youtube_video_url,
      video_file_url,
      is_active
    ) VALUES (
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. SMK Mustaqbal tumbuh sebagai sekolah vokasi yang memadukan karakter, kompetensi, dan kesiapan kerja agar lulusan mampu bersaing di dunia industri modern.' || E'\n\n' ||
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sejak awal berdiri, sekolah fokus pada pembelajaran berbasis praktik, kemitraan industri, dan budaya belajar yang disiplin namun tetap humanis.' || E'\n\n' ||
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Komitmen ini menjadikan SMK Mustaqbal sebagai ruang tumbuh bagi siswa untuk meraih masa depan yang lebih terarah.',
      'SMK Mustaqbal membina karakter, menguatkan skill, dan mengantar siswa menuju masa depan profesional.',
      'Tag Line',
      COALESCE(NULLIF(school_tagline, ''), 'Reach Your Success...'),
      'Setiap siswa punya potensi besar. Kami hadir untuk membimbingnya menjadi kompetensi nyata yang siap diterapkan di dunia kerja.',
      'dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      NULL,
      true
    );
  END IF;
END $$;
