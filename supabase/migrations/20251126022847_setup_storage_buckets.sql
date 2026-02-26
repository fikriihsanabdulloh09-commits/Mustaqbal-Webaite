/*
  # Setup Supabase Storage Buckets

  1. Storage Buckets
    - gallery-images: For photo gallery
    - gallery-videos: For video gallery
    - documents: For downloadable documents
    - news-covers: For news article cover images
    - program-icons: For program icons and banners
    - teacher-photos: For teacher profile photos
    - achievement-images: For achievement certificates/photos
    - event-banners: For event promotional banners
    - hero-slides: For hero slider background images

  2. Storage Policies
    - Public read access for all buckets
    - Authenticated write access for admin users
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('gallery-images', 'gallery-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('gallery-videos', 'gallery-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('documents', 'documents', true, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('news-covers', 'news-covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('program-icons', 'program-icons', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('teacher-photos', 'teacher-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('achievement-images', 'achievement-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('event-banners', 'event-banners', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('hero-slides', 'hero-slides', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access for gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for gallery videos" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for documents" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for news covers" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for program icons" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for teacher photos" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for achievement images" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for event banners" ON storage.objects;
  DROP POLICY IF EXISTS "Public read access for hero slides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload to gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload to gallery videos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload news covers" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload program icons" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload teacher photos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload achievement images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload event banners" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload hero slides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update gallery videos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update news covers" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update program icons" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update teacher photos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update achievement images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update event banners" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update hero slides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete from gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete from gallery videos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete news covers" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete program icons" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete teacher photos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete achievement images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete event banners" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete hero slides" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Public read policies
CREATE POLICY "Public read access for gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Public read access for gallery videos" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-videos');
CREATE POLICY "Public read access for documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public read access for news covers" ON storage.objects FOR SELECT USING (bucket_id = 'news-covers');
CREATE POLICY "Public read access for program icons" ON storage.objects FOR SELECT USING (bucket_id = 'program-icons');
CREATE POLICY "Public read access for teacher photos" ON storage.objects FOR SELECT USING (bucket_id = 'teacher-photos');
CREATE POLICY "Public read access for achievement images" ON storage.objects FOR SELECT USING (bucket_id = 'achievement-images');
CREATE POLICY "Public read access for event banners" ON storage.objects FOR SELECT USING (bucket_id = 'event-banners');
CREATE POLICY "Public read access for hero slides" ON storage.objects FOR SELECT USING (bucket_id = 'hero-slides');

-- Upload policies
CREATE POLICY "Authenticated users can upload to gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload to gallery videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload news covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload program icons" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'program-icons' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload teacher photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'teacher-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload achievement images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'achievement-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload event banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-banners' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload hero slides" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

-- Update policies
CREATE POLICY "Authenticated users can update gallery images" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update gallery videos" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update documents" ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update news covers" ON storage.objects FOR UPDATE USING (bucket_id = 'news-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update program icons" ON storage.objects FOR UPDATE USING (bucket_id = 'program-icons' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update teacher photos" ON storage.objects FOR UPDATE USING (bucket_id = 'teacher-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update achievement images" ON storage.objects FOR UPDATE USING (bucket_id = 'achievement-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update event banners" ON storage.objects FOR UPDATE USING (bucket_id = 'event-banners' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update hero slides" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

-- Delete policies
CREATE POLICY "Authenticated users can delete from gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete from gallery videos" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete news covers" ON storage.objects FOR DELETE USING (bucket_id = 'news-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete program icons" ON storage.objects FOR DELETE USING (bucket_id = 'program-icons' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete teacher photos" ON storage.objects FOR DELETE USING (bucket_id = 'teacher-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete achievement images" ON storage.objects FOR DELETE USING (bucket_id = 'achievement-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete event banners" ON storage.objects FOR DELETE USING (bucket_id = 'event-banners' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete hero slides" ON storage.objects FOR DELETE USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');