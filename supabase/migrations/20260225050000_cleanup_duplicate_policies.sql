/*
  # Cleanup Duplicate & Conflicting RLS Policies
  
  ## Problem:
  Multiple migrations created overlapping policies:
  - Migration 1 (20251120063532): Permissive "FOR ALL TO authenticated" on programs,
    news_articles, gallery_items, testimonials (no admin check)
  - Migration 3 (20251120103148): Added admin-checked policies on settings but
    "Admins can update settings" was not dropped before migration 6 recreated it
  - Migration 6 (20251122161545): Created stricter per-operation policies on
    news_articles and settings WITHOUT dropping ALL old permissive policies
  - Migration 9 (20251123224550): Added overly permissive "FOR ALL TO authenticated
    USING(true)" on animations, section_animations, site_branding
  
  Result: Old permissive policies override new strict ones, allowing any
  authenticated user to write to tables that should be admin-only.

  ## Solution:
  1. Drop all old/duplicate/conflicting policies
  2. Re-create clean policies with proper admin checks
  3. Use has_admin_permission() function to avoid circular dependency

  ## Dependencies:
  - Requires: has_admin_permission() function (created in migration 20251123075635)
*/

-- ============================================
-- PREREQUISITE CHECK: Verify has_admin_permission function exists
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'has_admin_permission' AND n.nspname = 'public'
  ) THEN
    RAISE EXCEPTION 'DEPENDENCY ERROR: has_admin_permission() function not found. 
    This migration requires migration 20251123075635_fix_circular_dependency_rls.sql to be run first.
    Run: SELECT public.has_admin_permission(''viewer''); to verify the function exists.';
  END IF;
  
  RAISE NOTICE '✅ Prerequisite check passed: has_admin_permission() function exists';
END $$;

-- ============================================
-- 1. PROGRAMS: Drop old permissive policies
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active programs" ON programs;
DROP POLICY IF EXISTS "Authenticated users can manage programs" ON programs;

-- Public can read active programs
CREATE POLICY "public_read_programs"
  ON programs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can read ALL programs (including inactive) for CMS
CREATE POLICY "admin_read_all_programs"
  ON programs
  FOR SELECT
  TO authenticated
  USING (public.has_admin_permission('editor'));

-- Admins can insert programs
CREATE POLICY "admin_insert_programs"
  ON programs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can update programs
CREATE POLICY "admin_update_programs"
  ON programs
  FOR UPDATE
  TO authenticated
  USING (public.has_admin_permission('editor'))
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can delete programs
CREATE POLICY "admin_delete_programs"
  ON programs
  FOR DELETE
  TO authenticated
  USING (public.has_admin_permission('admin'));

-- ============================================
-- 2. NEWS_ARTICLES: Drop old permissive policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can view published articles" ON news_articles;
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON news_articles;

-- Note: Migration 6 already created proper per-operation policies:
-- "Public can read published articles", "Admins can view all articles",
-- "Admins can insert articles", "Admins can update articles", "Admins can delete articles"
-- We just need to drop the old conflicting ones above.

-- ============================================
-- 3. GALLERY_ITEMS: Drop old permissive policies
-- ============================================
DROP POLICY IF EXISTS "Anyone can view gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON gallery_items;

-- Public can read all gallery items
CREATE POLICY "public_read_gallery"
  ON gallery_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can insert gallery items
CREATE POLICY "admin_insert_gallery"
  ON gallery_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can update gallery items
CREATE POLICY "admin_update_gallery"
  ON gallery_items
  FOR UPDATE
  TO authenticated
  USING (public.has_admin_permission('editor'))
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can delete gallery items
CREATE POLICY "admin_delete_gallery"
  ON gallery_items
  FOR DELETE
  TO authenticated
  USING (public.has_admin_permission('admin'));

-- ============================================
-- 4. TESTIMONIALS: Drop old permissive policies
-- ============================================
DROP POLICY IF EXISTS "Anyone can view featured testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;

-- Public can read featured testimonials
CREATE POLICY "public_read_testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_featured = true);

-- Admins can read ALL testimonials for CMS
CREATE POLICY "admin_read_all_testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (public.has_admin_permission('editor'));

-- Admins can insert testimonials
CREATE POLICY "admin_insert_testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can update testimonials
CREATE POLICY "admin_update_testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (public.has_admin_permission('editor'))
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can delete testimonials
CREATE POLICY "admin_delete_testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (public.has_admin_permission('admin'));

-- ============================================
-- 5. SETTINGS: Drop old conflicting policy and add INSERT policy
-- ============================================
DROP POLICY IF EXISTS "Admins can update settings" ON settings;

-- Note: Migration 6 already created "Only admins can update settings"
-- and "Public can read settings". We just drop the old conflicting one.
-- However, we need to add INSERT policy for upsert operations.

-- Admins can insert settings
CREATE POLICY "admin_insert_settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- ============================================
-- 6. ANIMATIONS: Drop overly permissive policy
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage animations" ON animations;

-- Admins can insert animations
CREATE POLICY "admin_insert_animations"
  ON animations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can update animations
CREATE POLICY "admin_update_animations"
  ON animations
  FOR UPDATE
  TO authenticated
  USING (public.has_admin_permission('editor'))
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can delete animations
CREATE POLICY "admin_delete_animations"
  ON animations
  FOR DELETE
  TO authenticated
  USING (public.has_admin_permission('admin'));

-- ============================================
-- 7. SECTION_ANIMATIONS: Drop overly permissive policy
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage section animations" ON section_animations;

-- Admins can insert section animations
CREATE POLICY "admin_insert_section_animations"
  ON section_animations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can update section animations
CREATE POLICY "admin_update_section_animations"
  ON section_animations
  FOR UPDATE
  TO authenticated
  USING (public.has_admin_permission('editor'))
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can delete section animations
CREATE POLICY "admin_delete_section_animations"
  ON section_animations
  FOR DELETE
  TO authenticated
  USING (public.has_admin_permission('admin'));

-- ============================================
-- 8. SITE_BRANDING: Drop overly permissive policy
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can manage branding" ON site_branding;

-- Admins can insert branding
CREATE POLICY "admin_insert_branding"
  ON site_branding
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can update branding
CREATE POLICY "admin_update_branding"
  ON site_branding
  FOR UPDATE
  TO authenticated
  USING (public.has_admin_permission('editor'))
  WITH CHECK (public.has_admin_permission('editor'));

-- Admins can delete branding
CREATE POLICY "admin_delete_branding"
  ON site_branding
  FOR DELETE
  TO authenticated
  USING (public.has_admin_permission('admin'));

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ POLICY CLEANUP COMPLETE!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🧹 Cleaned tables:';
  RAISE NOTICE '  - programs: removed permissive FOR ALL';
  RAISE NOTICE '  - news_articles: removed permissive FOR ALL';
  RAISE NOTICE '  - gallery_items: removed permissive FOR ALL';
  RAISE NOTICE '  - testimonials: removed permissive FOR ALL';
  RAISE NOTICE '  - settings: removed duplicate update policy';
  RAISE NOTICE '  - animations: removed permissive FOR ALL';
  RAISE NOTICE '  - section_animations: removed permissive FOR ALL';
  RAISE NOTICE '  - site_branding: removed permissive FOR ALL';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 All write policies now use has_admin_permission()';
  RAISE NOTICE '==========================================';
END $$;
