import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - List all products (admin view)
export async function GET(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      total: products?.length || 0
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, or price' },
        { status: 400 }
      );
    }

    // Add default image if none provided
    const images = productData.images && productData.images.length > 0 
      ? productData.images 
      : [{ url: '/images/products/default-product.jpg', alt: productData.name }];

    // Find category by slug
    const { data: category, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', productData.category)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Invalid category selected' },
        { status: 400 }
      );
    }

    const newProduct = {
      name: productData.name,
      description: productData.description,
      price: productData.price, // Already in cents from frontend
      category_id: category.id, // Use category ID for foreign key
      subcategory: productData.subcategory || '',
      images,
      tags: [], // Default empty tags array
      is_active: true,
      stock_quantity: productData.stockQuantity || null,
      is_customizable: productData.isCustomizable || false,
      ritual_properties: productData.ritualProperties || {
        elements: [],
        intentions: [],
        sabbats: [],
        moonPhases: [],
        planetaryAssociations: []
      }
    };

    // Add to database
    const { data: createdProduct, error } = await supabaseAdmin
      .from('products')
      .insert([newProduct])
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    console.log('New product created:', {
      id: createdProduct.id,
      name: createdProduct.name,
      price: createdProduct.price,
      category: createdProduct.category
    });

    return NextResponse.json({
      success: true,
      product: createdProduct,
      message: 'Sacred product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement product update in database
    // For now, return success message
    
    return NextResponse.json({
      success: true,
      message: 'Product update functionality coming soon'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement product deletion in database
    // For now, return success message
    
    return NextResponse.json({
      success: true,
      message: 'Product deletion functionality coming soon'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}