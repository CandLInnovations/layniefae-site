-- Production-ready RLS policies for orders table
-- This provides enterprise-grade security for launch

-- Step 1: Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 2: Clean slate - drop any existing policies
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
DROP POLICY IF EXISTS "Customers can read their own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated customers can read their own orders" ON orders;
DROP POLICY IF EXISTS "Service role bypass for backend operations" ON orders;

-- Step 3: Create comprehensive security policies

-- Policy 1: Service role (backend APIs) gets full access
-- This allows payment processing, order management, and customer APIs to work
CREATE POLICY "Backend service role full access"
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Authenticated users can only read their own orders
-- This would be for future Supabase Auth integration, currently not used
CREATE POLICY "Authenticated users read own orders"
ON orders FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid()::text
);

-- Policy 3: Anonymous users have no access (default with RLS enabled)
-- No policy needed - RLS blocks by default

-- Policy 4: Public users have no access (default with RLS enabled)
-- No policy needed - RLS blocks by default

-- Step 4: Apply similar security to order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing order_items policies
DROP POLICY IF EXISTS "Service role full access to order_items" ON order_items;

-- Service role gets full access to order_items
CREATE POLICY "Backend service role full access to order_items"
ON order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 5: Verification queries
SELECT 'ORDERS TABLE VERIFICATION:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename;

SELECT 'ORDERS POLICIES:' as info;
SELECT 
    policyname,
    roles,
    cmd as command,
    permissive,
    qual as using_condition
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

SELECT 'ORDER_ITEMS POLICIES:' as info;
SELECT 
    policyname,
    roles,
    cmd as command,
    permissive,
    qual as using_condition
FROM pg_policies 
WHERE tablename = 'order_items'
ORDER BY policyname;