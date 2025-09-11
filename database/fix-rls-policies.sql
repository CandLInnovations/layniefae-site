-- Fix Row Level Security policies for admin access
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Admin categories management" ON categories;
DROP POLICY IF EXISTS "Admin products management" ON products;

-- Create new policies that work with our JWT structure
-- Our JWT just needs to be valid (any valid JWT is considered admin for now)

-- Categories policies
CREATE POLICY "Admin categories management" ON categories FOR ALL USING (
  auth.jwt() IS NOT NULL
);

-- Products policies  
CREATE POLICY "Admin products management" ON products FOR ALL USING (
  auth.jwt() IS NOT NULL
);

-- Alternative: If you want to be more specific, you can check for a specific claim
-- CREATE POLICY "Admin categories management" ON categories FOR ALL USING (
--   (auth.jwt() ->> 'role') = 'admin' OR 
--   (auth.jwt() ->> 'username') = 'admin'
-- );