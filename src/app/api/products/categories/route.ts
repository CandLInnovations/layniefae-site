import { NextResponse } from 'next/server';
import { ProductDatabase } from '@/lib/product-database';
import { ProductCategory } from '@/types/product';

export async function GET() {
  try {
    const categories = Object.values(ProductCategory).map(category => {
      const products = ProductDatabase.getProductsByCategory(category);
      return {
        id: category,
        name: formatCategoryName(category),
        productCount: products.length,
        products: products.slice(0, 3) // Return first 3 products as preview
      };
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}

function formatCategoryName(category: ProductCategory): string {
  const names: Record<ProductCategory, string> = {
    [ProductCategory.SACRED_FLOWERS]: 'Sacred Flowers',
    [ProductCategory.CEREMONY_ARRANGEMENTS]: 'Ceremony Arrangements',
    [ProductCategory.ALTAR_PIECES]: 'Altar Pieces',
    [ProductCategory.RITUAL_HERBS]: 'Ritual Herbs',
    [ProductCategory.SEASONAL_WREATHS]: 'Seasonal Wreaths',
    [ProductCategory.WEDDING_FLOWERS]: 'Wedding Flowers',
    [ProductCategory.MEMORIAL_TRIBUTES]: 'Memorial Tributes',
    [ProductCategory.SUBSCRIPTION_BOXES]: 'Subscription Boxes',
    [ProductCategory.DIGITAL_GUIDES]: 'Digital Guides',
    [ProductCategory.WORKSHOPS]: 'Workshops'
  };
  return names[category];
}