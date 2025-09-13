-- Quick fix: Allow authenticated users to read their own orders
-- The issue is the customer API needs proper access

-- Add a policy that allows authenticated users (customers) to see their own orders
CREATE POLICY "Authenticated customers can read their own orders"
ON orders FOR SELECT
TO authenticated
USING (
  -- Allow if the order belongs to the current authenticated customer
  customer_id = (
    SELECT id FROM customer_profiles 
    WHERE customer_profiles.id = auth.uid()
  )
  OR
  -- Fallback: allow service role full access
  auth.role() = 'service_role'
);

-- Also ensure service role has full access for backend operations
CREATE POLICY "Service role bypass for backend operations" 
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT 
    policyname,
    roles,
    cmd as command,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;