-- Temporarily disable RLS again while we debug the authentication issue
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Check the current state
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'orders';