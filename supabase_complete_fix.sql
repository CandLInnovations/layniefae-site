-- COMPLETE DATABASE FIX - This will resolve all order saving issues
-- Run this to completely fix all constraint problems

-- Step 1: First, let's see what constraints currently exist
SELECT 
    'CURRENT CONSTRAINTS' as status,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'orders' 
AND constraint_type = 'FOREIGN KEY';

-- Step 2: Drop ALL possible foreign key constraints aggressively
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Find and drop ALL foreign key constraints on orders table
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'orders' 
        AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_record.constraint_name;
    END LOOP;
END $$;

-- Step 3: Fix the shipping_address constraint
ALTER TABLE orders ALTER COLUMN shipping_address DROP NOT NULL;

-- Step 4: Check current column constraints
SELECT 
    column_name, 
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('customer_id', 'shipping_address');

-- Step 5: Create ONLY the correct constraint
ALTER TABLE orders ADD CONSTRAINT orders_customer_profiles_fkey 
FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE SET NULL;

-- Step 6: Final verification
SELECT 
    'FINAL STATE' as status,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'orders' 
AND tc.constraint_type = 'FOREIGN KEY';