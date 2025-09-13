-- Diagnostic script to check current database state
-- Run this to see what constraints currently exist

-- Check if customer_profiles table exists and has data
SELECT 'customer_profiles table' as check_type, 
       COUNT(*) as count 
FROM customer_profiles;

-- Check all foreign key constraints on orders table
SELECT 
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

-- Check orders table structure for customer_id column
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('customer_id', 'shipping_address');

-- Check if shipping_address is still NOT NULL
SELECT column_name, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'shipping_address';