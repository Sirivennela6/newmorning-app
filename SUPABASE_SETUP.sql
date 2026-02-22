-- =============================================
-- New Morning Foundation - Supabase Setup SQL
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#FF6B35',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  duration TEXT,
  eligibility TEXT,
  fee NUMERIC,
  image_url TEXT,
  provider TEXT,
  location TEXT,
  entrance_exam TEXT,
  course_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Saved courses table (for logged-in users)
CREATE TABLE IF NOT EXISTS saved_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_courses ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can read
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT TO public USING (true);

-- Categories: Only admin can modify (admin email: newmorning0503@gmail.com)
CREATE POLICY "categories_admin_write" ON categories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'newmorning0503@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'newmorning0503@gmail.com');

-- Courses: Anyone can read
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT TO public USING (true);

-- Courses: Only admin can modify
CREATE POLICY "courses_admin_write" ON courses
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'newmorning0503@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'newmorning0503@gmail.com');

-- Saved courses: Users can manage their own
CREATE POLICY "saved_courses_user_read" ON saved_courses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "saved_courses_user_insert" ON saved_courses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_courses_user_delete" ON saved_courses
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- Sample Data (Optional - remove if you have your own)
-- =============================================

INSERT INTO categories (name, description, icon, color) VALUES
  ('Technology', 'Software, IT, and digital skills', 'laptop-outline', '#3B82F6'),
  ('Healthcare', 'Medical and health related courses', 'medical-outline', '#EF4444'),
  ('Agriculture', 'Farming and agricultural skills', 'leaf-outline', '#22C55E'),
  ('Vocational', 'Practical trade skills', 'construct-outline', '#F59E0B'),
  ('Business', 'Entrepreneurship and business skills', 'briefcase-outline', '#8B5CF6'),
  ('Arts & Crafts', 'Creative and artistic skills', 'color-palette-outline', '#EC4899')
ON CONFLICT DO NOTHING;
