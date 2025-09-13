-- Secure RLS policies for orders table
-- This provides proper security while maintaining functionality

-- Step 1: Re-enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies to start clean
DROP POLICY IF EXISTS "Service role can access all orders" ON orders;
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Service role can insert orders" ON orders;
DROP POLICY IF EXISTS "Service role can update orders" ON orders;

-- Step 3: Allow service role (backend) full access for order processing
-- This allows the payment processing API to create orders
CREATE POLICY "Service role full access to orders"
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Allow authenticated users to read only their own orders
-- This secures the customer orders API
CREATE POLICY "Customers can read their own orders"
ON orders FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customer_profiles 
    WHERE customer_profiles.id = orders.customer_id
  )
);

-- Step 5: Public users (anonymous) cannot access orders at all
-- (This is implicit with RLS enabled, but good to be explicit)

-- Step 6: Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd as command,
    permissive,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

-- Step 7: Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'orders';