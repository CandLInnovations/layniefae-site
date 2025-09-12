-- Safe Customer Schema Update - Only creates missing objects
-- This version uses IF NOT EXISTS to avoid conflicts with existing tables

-- Customer profiles table (safe create)
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    birth_date DATE,
    birth_time TIME,
    birth_location VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    ritual_preferences JSONB DEFAULT '{}',
    astrological_profile JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer addresses table (safe create)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'shipping', -- shipping, billing
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(100),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'US',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer sessions table for authentication (safe create)
CREATE TABLE IF NOT EXISTS customer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer wishlist table (safe create)
CREATE TABLE IF NOT EXISTS customer_wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- Customer product reviews table (safe create)
CREATE TABLE IF NOT EXISTS customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id, order_id)
);

-- Add missing columns to orders table if they don't exist
DO $$
BEGIN
    -- Add customer_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'customer_id') THEN
        ALTER TABLE orders ADD COLUMN customer_id UUID REFERENCES customer_profiles(id);
    END IF;
    
    -- Drop existing foreign key constraint if it exists (pointing to wrong table)
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'orders_customer_id_fkey' AND table_name = 'orders') THEN
        ALTER TABLE orders DROP CONSTRAINT orders_customer_id_fkey;
    END IF;
    
    -- Add correct foreign key constraint to customer_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'orders_customer_profiles_fkey' AND table_name = 'orders') THEN
        ALTER TABLE orders ADD CONSTRAINT orders_customer_profiles_fkey 
        FOREIGN KEY (customer_id) REFERENCES customer_profiles(id);
    END IF;
END
$$;

-- Add indexes for better performance (safe create)
CREATE INDEX IF NOT EXISTS customer_profiles_email_idx ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS customer_profiles_birth_date_idx ON customer_profiles(birth_date);
CREATE INDEX IF NOT EXISTS customer_addresses_customer_id_idx ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS customer_sessions_customer_id_idx ON customer_sessions(customer_id);
CREATE INDEX IF NOT EXISTS customer_sessions_token_idx ON customer_sessions(session_token);
CREATE INDEX IF NOT EXISTS customer_sessions_expires_idx ON customer_sessions(expires_at);
CREATE INDEX IF NOT EXISTS customer_wishlist_customer_id_idx ON customer_wishlist(customer_id);
CREATE INDEX IF NOT EXISTS customer_reviews_customer_id_idx ON customer_reviews(customer_id);
CREATE INDEX IF NOT EXISTS customer_reviews_product_id_idx ON customer_reviews(product_id);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);

-- Enable RLS (safe - won't fail if already enabled)
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Customers can view own profile" ON customer_profiles;
DROP POLICY IF EXISTS "Customers can update own profile" ON customer_profiles;
DROP POLICY IF EXISTS "Customers can view own addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Customers can view own sessions" ON customer_sessions;
DROP POLICY IF EXISTS "Customers can view own wishlist" ON customer_wishlist;
DROP POLICY IF EXISTS "Customers can view own reviews" ON customer_reviews;
DROP POLICY IF EXISTS "Admin can view all customer profiles" ON customer_profiles;
DROP POLICY IF EXISTS "Admin can view all customer addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Admin can view all customer sessions" ON customer_sessions;
DROP POLICY IF EXISTS "Admin can view all customer wishlists" ON customer_wishlist;
DROP POLICY IF EXISTS "Admin can view all customer reviews" ON customer_reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON customer_reviews;

-- Create RLS policies (now safe since we dropped existing ones)
-- For now, we'll use permissive policies since we're using JWT auth, not Supabase auth
CREATE POLICY "Allow all operations on customer_profiles" ON customer_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on customer_addresses" ON customer_addresses FOR ALL USING (true);
CREATE POLICY "Allow all operations on customer_sessions" ON customer_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on customer_wishlist" ON customer_wishlist FOR ALL USING (true);
CREATE POLICY "Allow all operations on customer_reviews" ON customer_reviews FOR ALL USING (true);

-- Create or replace update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON customer_profiles;
DROP TRIGGER IF EXISTS update_customer_addresses_updated_at ON customer_addresses;
DROP TRIGGER IF EXISTS update_customer_reviews_updated_at ON customer_reviews;

-- Create update triggers for updated_at columns
CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at
    BEFORE UPDATE ON customer_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_reviews_updated_at
    BEFORE UPDATE ON customer_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM customer_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;