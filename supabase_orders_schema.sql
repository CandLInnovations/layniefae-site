-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    square_payment_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    total_amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    payment_method VARCHAR(50) DEFAULT 'SQUARE',
    square_receipt_url TEXT,
    fulfillment_status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    variation_name VARCHAR(255),
    customizations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_customer_email_idx ON orders(customer_email);
CREATE INDEX orders_created_at_idx ON orders(created_at);
CREATE INDEX order_items_order_id_idx ON order_items(order_id);
CREATE INDEX order_items_product_id_idx ON order_items(product_id);

-- RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Admin can see all orders
CREATE POLICY "Admin can view all orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin can view all order items" ON order_items FOR ALL USING (true);

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();