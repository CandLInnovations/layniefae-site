-- Fix orders table access for customer API
-- This allows the backend to read orders properly

-- Option 1: Temporarily disable RLS to test (then we'll add proper policies)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Option 2: Add proper RLS policy for service role (uncomment if needed)
-- CREATE POLICY "Allow service role full access to orders" 
-- ON orders FOR ALL 
-- USING (true) 
-- WITH CHECK (true);

-- Verify the change
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'orders';