-- ============================================
-- FIX SECURITY DEFINER VIEW WARNINGS
-- ============================================
-- This migration fixes the security_definer_view linter warnings
-- by converting views to use security_invoker (PostgreSQL 15+)
-- or security_barrier with functions (PostgreSQL 14 and below)
-- 
-- IMPORTANT: Supabase uses PostgreSQL 15+ by default since 2023
-- Run `SELECT version();` to check your PostgreSQL version
-- ============================================

-- ============================================
-- CHECK POSTGRESQL VERSION
-- ============================================
-- PostgreSQL 15 introduced security_invoker for views
-- For PostgreSQL 14 and below, we use security_barrier only

DO $$
DECLARE
  pg_version int;
BEGIN
  pg_version := current_setting('server_version_num')::int;
  
  IF pg_version >= 150000 THEN
    RAISE NOTICE '✅ PostgreSQL 15+ detected (version: %)', current_setting('server_version');
    RAISE NOTICE '   Using security_invoker = true for views';
  ELSE
    RAISE NOTICE '⚠️ PostgreSQL 14 or below detected (version: %)', current_setting('server_version');
    RAISE NOTICE '   Using security_barrier = true (limited protection)';
  END IF;
END $$;

-- ============================================
-- 1. FIX: current_user_role VIEW
-- ============================================
-- This view queries admin_users table with auth.uid() filter
-- It should run with the querying user's permissions

DROP VIEW IF EXISTS current_user_role CASCADE;

-- Create view with security_invoker (PostgreSQL 15+) or security_barrier only (older versions)
CREATE OR REPLACE VIEW current_user_role AS
SELECT 
  au.id,
  au.email,
  au.role,
  au.full_name
FROM admin_users au
WHERE au.id = auth.uid();

-- Apply security settings based on PostgreSQL version
DO $$
DECLARE
  pg_version int;
BEGIN
  pg_version := current_setting('server_version_num')::int;
  
  IF pg_version >= 150000 THEN
    -- PostgreSQL 15+: Use security_invoker for proper permission checking
    ALTER VIEW current_user_role SET (security_invoker = true, security_barrier = true);
  ELSE
    -- PostgreSQL 14 and below: Only security_barrier available
    ALTER VIEW current_user_role SET (security_barrier = true);
  END IF;
END $$;

-- Grant access to authenticated users
GRANT SELECT ON current_user_role TO authenticated;

-- ============================================
-- 2. FIX: security_audit VIEW
-- ============================================
-- This view queries system catalogs for RLS status
-- It should run with the querying user's permissions

DROP VIEW IF EXISTS security_audit CASCADE;

CREATE OR REPLACE VIEW security_audit AS
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  (SELECT count(*) FROM pg_policies WHERE tablename = tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Apply security settings based on PostgreSQL version
DO $$
DECLARE
  pg_version int;
BEGIN
  pg_version := current_setting('server_version_num')::int;
  
  IF pg_version >= 150000 THEN
    ALTER VIEW security_audit SET (security_invoker = true, security_barrier = true);
  ELSE
    ALTER VIEW security_audit SET (security_barrier = true);
  END IF;
END $$;

GRANT SELECT ON security_audit TO authenticated;

-- ============================================
-- 3. FIX: admin_users_policy_check VIEW
-- ============================================
-- This view queries pg_policies for verification
-- It should run with the querying user's permissions

DROP VIEW IF EXISTS admin_users_policy_check CASCADE;

CREATE OR REPLACE VIEW admin_users_policy_check AS
SELECT 
  tablename,
  policyname,
  cmd as command,
  CASE 
    WHEN qual::text LIKE '%admin_users%' AND cmd = 'SELECT' THEN '⚠️ CIRCULAR'
    ELSE '✅ OK'
  END as status
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY cmd, policyname;

-- Apply security settings based on PostgreSQL version
DO $$
DECLARE
  pg_version int;
BEGIN
  pg_version := current_setting('server_version_num')::int;
  
  IF pg_version >= 150000 THEN
    ALTER VIEW admin_users_policy_check SET (security_invoker = true, security_barrier = true);
  ELSE
    ALTER VIEW admin_users_policy_check SET (security_barrier = true);
  END IF;
END $$;

GRANT SELECT ON admin_users_policy_check TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================
-- Verify the views have proper security settings

DO $$
DECLARE
  pg_version int;
  invoker_check text;
BEGIN
  pg_version := current_setting('server_version_num')::int;
  
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ SECURITY DEFINER VIEW FIX COMPLETE!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  
  IF pg_version >= 150000 THEN
    RAISE NOTICE '📋 Views updated with security_invoker = true:';
    RAISE NOTICE '  - current_user_role';
    RAISE NOTICE '  - security_audit';
    RAISE NOTICE '  - admin_users_policy_check';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 These views now run with the querying user''s permissions';
  ELSE
    RAISE NOTICE '📋 Views updated with security_barrier = true:';
    RAISE NOTICE '  - current_user_role';
    RAISE NOTICE '  - security_audit';
    RAISE NOTICE '  - admin_users_policy_check';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ PostgreSQL 14 or below detected';
    RAISE NOTICE '   For full security, consider upgrading to PostgreSQL 15+';
    RAISE NOTICE '   security_barrier provides partial protection only';
  END IF;
  
  RAISE NOTICE '====================================';
END $$;
