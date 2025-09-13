-- Check RLS policies that might be blocking order access

-- 1. Check if RLS is enabled on orders table
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'orders';

-- 2. Show all RLS policies on orders table
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- 3. Check what the Supabase service role can access
-- (This might need to be run with different permissions)