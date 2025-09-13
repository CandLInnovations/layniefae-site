-- Fix the UUID/text type casting error in RLS policies

-- Step 1: Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 2: Clean slate - drop any existing policies
DROP POLICY IF EXISTS "Backend service role full access" ON orders;
DROP POLICY IF EXISTS "Authenticated users read own orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
DROP POLICY IF EXISTS "Customers can read their own orders" ON orders;

-- Step 3: Create the correct service role policy
CREATE POLICY "Backend service role full access"
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Fix the authenticated user policy with proper type casting
CREATE POLICY "Authenticated users read own orders"
ON orders FOR SELECT
TO authenticated
USING (
  customer_id::text = auth.uid()::text
);

-- Step 5: Apply security to order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing order_items policies
DROP POLICY IF EXISTS "Backend service role full access to order_items" ON order_items;

-- Fix the order_items policy (was incorrectly targeting orders table)
CREATE POLICY "Backend service role full access to order_items"
ON order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 6: Verification
SELECT 'RLS STATUS:' as info;
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename;

SELECT 'POLICIES CREATED:' as info;
SELECT 
    tablename,
    policyname,
    roles,
    cmd as command
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;