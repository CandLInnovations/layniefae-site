import { NextResponse } from 'next/server';
import { ProductDatabase } from '@/lib/product-database';

export async function GET() {
  try {
    const filters = ProductDatabase.getAvailableFilters();
    
    return NextResponse.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' }, 
      { status: 500 }
    );
  }
}