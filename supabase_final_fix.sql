-- Final fix to resolve order saving issues
-- Run this to fix the constraints preventing orders from saving

-- 1. Make shipping_address optional (it's required but we don't collect it in checkout)
ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;

-- 2. Fix the foreign key constraint pointing to wrong table
-- Drop the incorrect constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

-- Add the correct constraint pointing to customer_profiles
ALTER TABLE orders ADD CONSTRAINT orders_customer_profiles_fkey 
FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE SET NULL;