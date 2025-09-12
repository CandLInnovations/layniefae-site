import { Element } from './product';

export interface CustomerProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  ritual_preferences: RitualPreferences;
  astrological_profile: AstrologicalProfile;
  created_at: string;
  updated_at: string;
}

export interface RitualPreferences {
  preferred_elements?: Element[];
  favorite_intentions?: string[];
  preferred_moon_phases?: string[];
  favorite_sabbats?: string[];
  chakra_focus?: string[];
  planetary_affinities?: string[];
  ritual_experience_level?: 'beginner' | 'intermediate' | 'advanced';
  preferred_price_range?: {
    min: number;
    max: number;
  };
  notification_preferences?: {
    new_products: boolean;
    sabbat_reminders: boolean;
    moon_phase_alerts: boolean;
    personalized_recommendations: boolean;
  };
}

export interface AstrologicalProfile {
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  dominant_element?: Element;
  ruling_planet?: string;
  birth_chart_houses?: Record<string, any>;
  current_transits?: Record<string, any>;
  personalized_recommendations?: string[];
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  type: 'shipping' | 'billing';
  first_name?: string;
  last_name?: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerSession {
  id: string;
  customer_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string;
  added_at: string;
  product?: any; // Will be populated with product details
}

export interface CustomerReview {
  id: string;
  customer_id: string;
  product_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  review_text?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  customer?: Partial<CustomerProfile>;
  product?: any;
}

export interface CustomerRegistration {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  phone?: string;
}

export interface CustomerLogin {
  email: string;
  password: string;
}

export interface CustomerAuthResponse {
  success: boolean;
  customer?: CustomerProfile;
  session_token?: string;
  expires_at?: string;
  error?: string;
}

export interface PersonalizedRecommendation {
  product_id: string;
  reason: string;
  match_score: number;
  match_factors: string[];
  product?: any;
}

export interface MoonPhaseInfo {
  phase: string;
  date: string;
  illumination: number;
  next_new_moon: string;
  next_full_moon: string;
}

export interface SabbatInfo {
  name: string;
  date: string;
  description: string;
  traditional_activities: string[];
  recommended_products: string[];
}

export interface AstrologyReading {
  sun_sign: string;
  moon_sign?: string;
  rising_sign?: string;
  current_season_insights: string;
  recommended_elements: Element[];
  recommended_intentions: string[];
  lucky_days: string[];
  planetary_influences: {
    planet: string;
    influence: string;
    recommended_actions: string[];
  }[];
}

// Zodiac sign mappings
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

// Moon phases
export const MOON_PHASES = [
  'new-moon', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
  'full-moon', 'waning-gibbous', 'last-quarter', 'waning-crescent'
] as const;

export type MoonPhase = typeof MOON_PHASES[number];

// Experience levels
export const EXPERIENCE_LEVELS = [
  'beginner', 'intermediate', 'advanced'
] as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];