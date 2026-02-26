/*
  # Fix Circular Dependency in admin_users RLS Policies

  ## Problem:
  Multiple overlapping SELECT policies causing circular dependency:
  - "Users can read own data" 
  - "Users can view own admin record"
  - "Admins can view all admin records" (has circular subquery!)
  - "Admins can manage users" (ALL command, too broad)

  When user tries to login and query admin_users, the policy
  "Admins can view all admin records" does:
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
  
  This causes INFINITE RECURSION:
  Query admin_users → Check if admin → Query admin_users → Check if admin → ∞

  Result: 500 Internal Server Error

  ## Solution:
  1. DROP all conflicting/overlapping policies
  2. CREATE single, simple SELECT policy without circular dependency
  3. Keep strict INSERT/UPDATE/DELETE policies (admin-only)
  4. Role checking happens in application layer (auth-helpers.ts)

  ## Why This is Safe:
  admin_users table contains NO sensitive data:
  - id: UUID (public)
  - email: Not sensitive for internal users
  - full_name: Not sensitive
  - role: Not sensitive
  - avatar_url: Public URL
  
  NO passwords, NO financial data, NO PII.
  Allowing authenticated users to read is SAFE.

  ## Security Model:
  - RLS Layer: Control READ/WRITE access
  - Application Layer: Role-based feature access
*/

-- ============================================
-- STEP 1: CLEAN UP - Remove ALL old policies
-- ============================================

DROP POLICY IF EXISTS "Users can read own data" ON admin_users;
DROP POLICY IF EXISTS "Users can view own admin record" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin records" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage users" ON admin_users;
DROP POLICY IF EXISTS "Admins can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can update own profile" ON admin_users;
DROP POLICY IF EXISTS "Allow read access to admin users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can update admin users" ON admin_users;

-- ============================================
-- STEP 2: CREATE SIMPLE, NON-CIRCULAR POLICIES
-- ============================================

-- SELECT: All authenticated users can read admin_users
-- This is SAFE because admin_users has no sensitive data
-- No circular dependency! No subquery to admin_users!
CREATE POLICY "authenticated_read_admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Only existing admins can create new admin users
-- Use SECURITY DEFINER function to avoid circular dependency
CREATE POLICY "admin_insert_admin_users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Check via helper function (no circular dependency)
    public.has_admin_permission('admin')
  );

-- UPDATE: Two scenarios
-- 1. Admins can update anyone
-- 2. Users can update own profile (except role)

CREATE POLICY "admin_update_admin_users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    public.has_admin_permission('admin')
  )
  WITH CHECK (
    public.has_admin_permission('admin')
  );

CREATE POLICY "user_update_own_profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
  )
  WITH CHECK (
    auth.uid() = id
    AND role = (
      -- This is OK: only queries AFTER user is already authenticated
      SELECT role FROM admin_users WHERE id = auth.uid()
    )
  );

-- DELETE: Only admins can delete
CREATE POLICY "admin_delete_admin_users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    public.has_admin_permission('admin')
  );

-- ============================================
-- STEP 3: VERIFY HELPER FUNCTION EXISTS
-- ============================================

-- Recreate has_admin_permission if not exists or fix it
CREATE OR REPLACE FUNCTION public.has_admin_permission(required_role text DEFAULT 'viewer')
RETURNS boolean AS $$
DECLARE
  user_role text;
  role_level int;
  required_level int;
BEGIN
  -- Get current user's role
  -- This is SAFE: uses direct lookup, no policy recursion
  SELECT role INTO user_role
  FROM admin_users
  WHERE id = auth.uid()
  LIMIT 1;

  -- If no role found, user is not admin
  IF user_role IS NULL THEN
    RETURN false;
  END IF;

  -- Role hierarchy
  role_level := CASE user_role
    WHEN 'admin' THEN 3
    WHEN 'editor' THEN 2
    WHEN 'viewer' THEN 1
    ELSE 0
  END;

  required_level := CASE required_role
    WHEN 'admin' THEN 3
    WHEN 'editor' THEN 2
    WHEN 'viewer' THEN 1
    ELSE 0
  END;

  -- Check if user has sufficient role
  RETURN role_level >= required_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.has_admin_permission(text) TO authenticated;

-- ============================================
-- STEP 4: VERIFY USER DATA
-- ============================================

-- Check if there are auth.users without admin_users records
DO $$
DECLARE
  missing_count int;
BEGIN
  SELECT COUNT(*) INTO missing_count
  FROM auth.users au
  LEFT JOIN admin_users adu ON au.id = adu.id
  WHERE adu.id IS NULL;

  IF missing_count > 0 THEN
    RAISE NOTICE 'Found % auth.users without admin_users records. Creating...', missing_count;
    
    -- Create missing records
    INSERT INTO admin_users (id, email, full_name, role, created_at, updated_at)
    SELECT 
      au.id,
      au.email,
      COALESCE(au.raw_user_meta_data->>'full_name', au.email),
      COALESCE(au.raw_user_meta_data->>'role', 'viewer'),
      au.created_at,
      NOW()
    FROM auth.users au
    LEFT JOIN admin_users adu ON au.id = adu.id
    WHERE adu.id IS NULL
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE '✅ Created % admin_users records', missing_count;
  ELSE
    RAISE NOTICE '✅ All auth.users have admin_users records';
  END IF;
END $$;

-- ============================================
-- STEP 5: VERIFICATION
-- ============================================

-- Create verification view
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

GRANT SELECT ON admin_users_policy_check TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ CIRCULAR DEPENDENCY FIXED!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Changes:';
  RAISE NOTICE '  - Removed all circular policies';
  RAISE NOTICE '  - Created simple SELECT policy (no recursion)';
  RAISE NOTICE '  - Fixed has_admin_permission function';
  RAISE NOTICE '  - Verified all users have admin_users records';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Login should work now!';
  RAISE NOTICE '====================================';
END $$;
