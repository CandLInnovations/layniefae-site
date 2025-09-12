-- Quick fix for foreign key constraint issue
-- This focuses only on fixing the orders table constraint

-- Fix the foreign key constraint issue
DO $$
BEGIN
    -- Drop existing foreign key constraint if it exists (pointing to wrong table)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'orders_customer_id_fkey' AND table_name = 'orders') THEN
        ALTER TABLE orders DROP CONSTRAINT orders_customer_id_fkey;
    END IF;
    
    -- Add correct foreign key constraint to customer_profiles (allow NULL for guest orders)
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'orders_customer_profiles_fkey' AND table_name = 'orders') THEN
        ALTER TABLE orders ADD CONSTRAINT orders_customer_profiles_fkey 
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(id);
    END IF;
    
    -- Also fix the shipping_address NULL constraint issue
    ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;
END
$$;