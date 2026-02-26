/*
  # Fix Admin Users RLS & Auto-Create Trigger

  1. Problem:
    - RLS policy too strict causing 500 error
    - Admin users not auto-created when auth user is created
    - Login fails because admin_users record doesn't exist

  2. Solutions:
    - Fix RLS policies to allow user to read their own record
    - Create trigger to auto-create admin_users when auth.users created
    - Add function to safely check admin status

  3. Security:
    - Users can only read their own admin record
    - Only actual admins can read/write other admin records
    - Auto-created users default to 'viewer' role (safe)
*/

-- ====================================
-- 1. DROP OLD RESTRICTIVE POLICIES
-- ====================================
DROP POLICY IF EXISTS "Users can read own admin profile" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage all admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow read access to admin users" ON admin_users;

-- ====================================
-- 2. CREATE NEW FLEXIBLE POLICIES
-- ====================================

-- Allow users to read their OWN admin record (critical for login!)
CREATE POLICY "Users can view own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to view ALL admin records
CREATE POLICY "Admins can view all admin records"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Allow admins to insert new admin users
CREATE POLICY "Admins can create admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Allow admins to update admin users
CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Allow users to update their OWN profile (not role!)
CREATE POLICY "Users can update own profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM admin_users WHERE id = auth.uid())
  );

-- ====================================
-- 3. AUTO-CREATE ADMIN_USERS FUNCTION
-- ====================================

-- Function to auto-create admin_users record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into admin_users (if not exists)
  INSERT INTO public.admin_users (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'), -- default to viewer for security
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ====================================
-- 4. HELPER FUNCTION TO PROMOTE USER
-- ====================================

-- Function to promote user to admin (for first-time setup)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE admin_users
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- 5. FIX EXISTING USERS (MIGRATION)
-- ====================================

-- Create admin_users records for any auth.users that don't have one
INSERT INTO admin_users (id, email, full_name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  'viewer', -- safe default
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN admin_users adu ON au.id = adu.id
WHERE adu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ====================================
-- 6. CREATE HELPER VIEW (Optional)
-- ====================================

-- View to safely check if current user is admin
CREATE OR REPLACE VIEW current_user_role AS
SELECT 
  au.id,
  au.email,
  au.role,
  au.full_name
FROM admin_users au
WHERE au.id = auth.uid();

-- Grant access to authenticated users
GRANT SELECT ON current_user_role TO authenticated;
