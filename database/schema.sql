-- Laynie Fae Sacred Business Database Schema
-- Create these tables in your Supabase dashboard

-- Categories table for product organization
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, is_default) VALUES
('Sacred Flowers', 'sacred_flowers', true),
('Ceremony Arrangements', 'ceremony_arrangements', true),
('Altar Pieces', 'altar_pieces', true),
('Ritual Herbs', 'ritual_herbs', true),
('Seasonal Wreaths', 'seasonal_wreaths', true),
('Wedding Flowers', 'wedding_flowers', true),
('Memorial Tributes', 'memorial_tributes', true),
('Subscription Boxes', 'subscription_boxes', true),
('Digital Guides', 'digital_guides', true),
('Workshops', 'workshops', true);

-- Products table (enhanced from existing in-memory version)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price INTEGER NOT NULL, -- in cents
  category_id UUID REFERENCES categories(id),
  subcategory VARCHAR(255),
  images JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_customizable BOOLEAN DEFAULT false,
  stock_quantity INTEGER,
  ritual_properties JSONB DEFAULT '{}',
  seasonal_availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table for user management
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  birth_date DATE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table for purchase tracking
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount INTEGER NOT NULL, -- in cents
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  ritual_delivery_date DATE, -- for moon phases, sabbats
  payment_intent_id VARCHAR(255), -- Stripe/Square payment ID
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table for customer favorites
CREATE TABLE wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- Product reviews table
CREATE TABLE product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  customer_id UUID REFERENCES customers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  interests TEXT[] DEFAULT '{}', -- ritual types, elements, etc.
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Gift cards table
CREATE TABLE gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- in cents
  balance INTEGER NOT NULL, -- remaining balance in cents
  design VARCHAR(100),
  purchaser_name VARCHAR(255),
  purchaser_email VARCHAR(255),
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_gift_cards_code ON gift_cards(code);

-- Row Level Security (RLS) for data protection
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public access to categories and active products
CREATE POLICY "Public categories access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products access" ON products FOR SELECT USING (is_active = true);

-- Admin access for categories and products (you'll need to set up admin role)
CREATE POLICY "Admin categories management" ON categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin products management" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Customer access to their own data
CREATE POLICY "Customers access own data" ON customers FOR ALL USING (auth.uid() = id);
CREATE POLICY "Customers access own orders" ON orders FOR ALL USING (auth.uid() = customer_id);

-- Update triggers to automatically set updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();