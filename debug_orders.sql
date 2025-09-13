-- Debug script to see what orders exist and their customer_id values

-- 1. Show recent orders with their customer data
SELECT 
    'RECENT ORDERS' as info,
    id,
    customer_id,
    customer_email,
    total_amount,
    status,
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Show Chad's customer profile ID
SELECT 
    'CHAD PROFILE' as info,
    id as customer_id,
    email,
    first_name,
    last_name
FROM customer_profiles 
WHERE email = 'chadbria@proton.me';

-- 3. Check if any orders have Chad's customer_id
SELECT 
    'ORDERS FOR CHAD ID' as info,
    COUNT(*) as order_count
FROM orders 
WHERE customer_id = 'eccca162-717b-4f20-b245-4ca8f2ec5791';

-- 4. Check orders with Chad's email
SELECT 
    'ORDERS WITH CHAD EMAIL' as info,
    id,
    customer_id,
    customer_email,
    total_amount,
    created_at
FROM orders 
WHERE customer_email = 'chadbria@proton.me'
ORDER BY created_at DESC;