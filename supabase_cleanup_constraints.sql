-- Comprehensive fix to clean up all order constraints
-- This will remove ALL customer_id constraints and recreate the correct one

-- 1. Make shipping_address optional
ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;

-- 2. Drop ALL customer_id foreign key constraints on orders table
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find and drop all foreign key constraints on customer_id column
    FOR constraint_name IN 
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'orders' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND ccu.column_name = 'customer_id'
    LOOP
        EXECUTE 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END
$$;

-- 3. Add the single correct foreign key constraint
ALTER TABLE orders ADD CONSTRAINT orders_customer_profiles_fkey 
FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE SET NULL;

-- 4. Verify the constraint was created correctly
SELECT 
    tc.constraint_name,
    tc.table_name,
    ccu.column_name,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'orders' 
AND tc.constraint_type = 'FOREIGN KEY'
AND ccu.column_name = 'customer_id';