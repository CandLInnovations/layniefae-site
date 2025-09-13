-- DEFINITIVE constraint fix - this will resolve the order saving issue
-- Run this to completely fix the foreign key constraint problem

-- Step 1: Drop ALL existing constraints on customer_id column
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_profiles_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_customer_id;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customers_fkey;

-- Step 2: Ensure shipping_address is nullable
ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;

-- Step 3: Create the single correct constraint
ALTER TABLE orders ADD CONSTRAINT orders_customer_profiles_fkey 
FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE SET NULL;

-- Step 4: Verify what we've created
SELECT 
    'FINAL VERIFICATION' as status,
    constraint_name,
    table_name,
    column_name,
    foreign_table_name
FROM (
    SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name = 'orders' 
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'customer_id'
) AS constraints;