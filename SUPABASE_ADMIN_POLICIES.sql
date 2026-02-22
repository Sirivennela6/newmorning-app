-- ============================================================
-- Run these in Supabase SQL Editor to enable admin write access
-- These add INSERT/UPDATE/DELETE policies for admin_roles users
-- ============================================================

-- Admin write for categories (users in admin_roles table)
CREATE POLICY "Admin can insert categories" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can update categories" ON categories
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can delete categories" ON categories
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

-- Admin write for courses
CREATE POLICY "Admin can insert courses" ON courses
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can update courses" ON courses
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin can delete courses" ON courses
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

-- Also allow admin to read admin_roles (needed to check isAdmin)
-- Your existing policy "Admins can view their own admin role" should cover this.
-- If not, add:
-- CREATE POLICY "Users can check admin_roles" ON admin_roles
--   FOR SELECT TO authenticated
--   USING (user_id = auth.uid());

-- ============================================================
-- To make a user an admin, run this (replace with real user ID):
-- INSERT INTO admin_roles (user_id) VALUES ('paste-user-uuid-here');
-- 
-- Find user IDs in: Supabase Dashboard → Authentication → Users
-- ============================================================
