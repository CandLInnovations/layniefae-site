import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ProductFilter, ProductCategory, Element } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') as ProductCategory;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const elements = searchParams.get('elements')?.split(',') as Element[];
    const intentions = searchParams.get('intentions')?.split(',');
    const tags = searchParams.get('tags')?.split(',');
    const isCustomizable = searchParams.get('customizable') === 'true' ? true : 
                          searchParams.get('customizable') === 'false' ? false : undefined;
    const inStock = searchParams.get('inStock') === 'true';

    // Build filter object
    const filter: ProductFilter = {};
    
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 999999
      };
    }
    if (elements && elements.length > 0) filter.elements = elements;
    if (intentions && intentions.length > 0) filter.intentions = intentions;
    if (tags && tags.length > 0) filter.tags = tags;
    if (isCustomizable !== undefined) filter.isCustomizable = isCustomizable;
    if (inStock) filter.inStock = inStock;

    // Build Supabase query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (filter.category) {
      query = query.eq('categories.slug', filter.category);
    }
    
    if (filter.priceRange) {
      query = query
        .gte('price', filter.priceRange.min)
        .lte('price', filter.priceRange.max);
    }

    if (filter.isCustomizable !== undefined) {
      query = query.eq('is_customizable', filter.isCustomizable);
    }

    if (filter.inStock) {
      query = query.or('stock_quantity.is.null,stock_quantity.gt.0');
    }

    // Apply text-based filters using PostgreSQL operators
    if (filter.elements && filter.elements.length > 0) {
      const elementsFilter = filter.elements.map(el => `"${el}"`).join(',');
      query = query.overlaps('ritual_properties->elements', `[${elementsFilter}]`);
    }

    if (filter.intentions && filter.intentions.length > 0) {
      const intentionsFilter = filter.intentions.map(intent => `"${intent}"`).join(',');
      query = query.overlaps('ritual_properties->intentions', `[${intentionsFilter}]`);
    }

    if (filter.tags && filter.tags.length > 0) {
      query = query.overlaps('tags', filter.tags);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: products, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform data to match expected format
    const result = {
      products: products || [],
      total: count || 0,
      page,
      limit,
      filters: filter
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}

