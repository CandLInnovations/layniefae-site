export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number; // in cents (Square format)
  category: ProductCategory;
  subcategory?: string;
  images: ProductImage[];
  variations?: ProductVariation[];
  tags: string[];
  isActive: boolean;
  isCustomizable: boolean;
  customizationOptions?: CustomizationOption[];
  stockQuantity?: number; // undefined = unlimited
  weight?: number; // in grams for shipping
  dimensions?: ProductDimensions;
  seasonalAvailability?: SeasonalAvailability;
  ritualProperties?: RitualProperties;
  createdAt: string;
  updatedAt: string;
  squareItemId?: string; // Square catalog item ID
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number; // in cents
  sku?: string;
  stockQuantity?: number;
  attributes: { [key: string]: string }; // e.g., { color: "purple", size: "large" }
  squareVariationId?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'text' | 'select' | 'multi-select' | 'color' | 'date';
  required: boolean;
  options?: string[]; // for select types
  additionalPrice?: number; // in cents
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm';
}

export interface SeasonalAvailability {
  availableMonths: number[]; // 1-12
  specialOccasions?: string[]; // e.g., ["Samhain", "Beltane", "Wedding Season"]
}

export interface RitualProperties {
  elements: Element[];
  intentions: string[];
  sabbats: string[];
  moonPhases?: string[];
  planetaryAssociations?: string[];
}

export enum ProductCategory {
  SACRED_FLOWERS = 'sacred_flowers',
  CEREMONY_ARRANGEMENTS = 'ceremony_arrangements',
  ALTAR_PIECES = 'altar_pieces',
  RITUAL_HERBS = 'ritual_herbs',
  SEASONAL_WREATHS = 'seasonal_wreaths',
  WEDDING_FLOWERS = 'wedding_flowers',
  MEMORIAL_TRIBUTES = 'memorial_tributes',
  SUBSCRIPTION_BOXES = 'subscription_boxes',
  DIGITAL_GUIDES = 'digital_guides',
  WORKSHOPS = 'workshops'
}

export enum Element {
  EARTH = 'earth',
  AIR = 'air',
  FIRE = 'fire',
  WATER = 'water',
  SPIRIT = 'spirit'
}

export interface ProductFilter {
  category?: ProductCategory;
  priceRange?: {
    min: number;
    max: number;
  };
  elements?: Element[];
  intentions?: string[];
  isCustomizable?: boolean;
  inStock?: boolean;
  tags?: string[];
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  filters: ProductFilter;
}