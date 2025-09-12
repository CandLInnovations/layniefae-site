-- Customer profiles table
CREATE TABLE customer_profiles (
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

-- Customer addresses table
CREATE TABLE customer_addresses (
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

-- Customer sessions table for authentication
CREATE TABLE customer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer wishlist table
CREATE TABLE customer_wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- Customer product reviews table
CREATE TABLE customer_reviews (
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

-- Note: orders table already has customer_id column, no need to add it again

-- Add indexes for better performance
CREATE INDEX customer_profiles_email_idx ON customer_profiles(email);
CREATE INDEX customer_profiles_birth_date_idx ON customer_profiles(birth_date);
CREATE INDEX customer_addresses_customer_id_idx ON customer_addresses(customer_id);
CREATE INDEX customer_sessions_customer_id_idx ON customer_sessions(customer_id);
CREATE INDEX customer_sessions_token_idx ON customer_sessions(session_token);
CREATE INDEX customer_sessions_expires_idx ON customer_sessions(expires_at);
CREATE INDEX customer_wishlist_customer_id_idx ON customer_wishlist(customer_id);
CREATE INDEX customer_reviews_customer_id_idx ON customer_reviews(customer_id);
CREATE INDEX customer_reviews_product_id_idx ON customer_reviews(product_id);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);

-- RLS policies for customer data
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

-- Customers can only see/edit their own data
CREATE POLICY "Customers can view own profile" ON customer_profiles 
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own profile" ON customer_profiles 
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can view own addresses" ON customer_addresses 
    FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "Customers can view own sessions" ON customer_sessions 
    FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "Customers can view own wishlist" ON customer_wishlist 
    FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "Customers can view own reviews" ON customer_reviews 
    FOR ALL USING (customer_id = auth.uid());

-- Admin can see all customer data
CREATE POLICY "Admin can view all customer profiles" ON customer_profiles FOR ALL USING (true);
CREATE POLICY "Admin can view all customer addresses" ON customer_addresses FOR ALL USING (true);
CREATE POLICY "Admin can view all customer sessions" ON customer_sessions FOR ALL USING (true);
CREATE POLICY "Admin can view all customer wishlists" ON customer_wishlist FOR ALL USING (true);
CREATE POLICY "Admin can view all customer reviews" ON customer_reviews FOR ALL USING (true);

-- Public can view approved reviews
CREATE POLICY "Public can view approved reviews" ON customer_reviews 
    FOR SELECT USING (is_approved = true);

-- Update triggers for updated_at columns
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

-- Sample ritual preferences structure (JSONB)
-- {
--   "preferred_elements": ["EARTH", "WATER"],
--   "favorite_intentions": ["Love & Relationships", "Healing", "Protection"],
--   "preferred_moon_phases": ["full-moon", "new-moon"],
--   "favorite_sabbats": ["Beltane", "Samhain"],
--   "chakra_focus": ["Heart", "Third Eye"],
--   "planetary_affinities": ["Venus", "Moon"],
--   "ritual_experience_level": "intermediate",
--   "preferred_price_range": {"min": 1500, "max": 5000},
--   "notification_preferences": {
--     "new_products": true,
--     "sabbat_reminders": true,
--     "moon_phase_alerts": true,
--     "personalized_recommendations": true
--   }
-- }

-- Sample astrological profile structure (JSONB)  
-- {
--   "sun_sign": "Scorpio",
--   "moon_sign": "Pisces", 
--   "rising_sign": "Cancer",
--   "dominant_element": "WATER",
--   "ruling_planet": "Mars",
--   "birth_chart_houses": {...},
--   "current_transits": {...},
--   "personalized_recommendations": [...]
-- }