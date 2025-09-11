import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Public client for reading data
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : supabase; // Fallback to regular client if service role key is not available

// Database types
export interface Category {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  birth_date?: string;
  preferences?: {
    favorite_elements?: string[];
    ritual_interests?: string[];
    communication_preferences?: {
      email_marketing: boolean;
      new_product_alerts: boolean;
      ritual_reminders: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    customizations?: any;
  }[];
  ritual_delivery_date?: string; // For special moon phases, sabbats
  created_at: string;
  updated_at: string;
}

export interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  price: number;
  category_id: string;
  subcategory?: string;
  images: {
    url: string;
    alt_text: string;
    is_primary: boolean;
    sort_order: number;
  }[];
  tags: string[];
  is_active: boolean;
  is_customizable: boolean;
  stock_quantity?: number;
  ritual_properties?: {
    elements: string[];
    intentions: string[];
    sabbats: string[];
    moon_phases?: string[];
    planetary_associations?: string[];
  };
  seasonal_availability?: {
    available_months: number[];
    special_occasions?: string[];
  };
  created_at: string;
  updated_at: string;
}