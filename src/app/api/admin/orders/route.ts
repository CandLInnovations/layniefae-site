import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verify } from 'jsonwebtoken';

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

export async function GET(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            images
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`customer_email.ilike.%${search}%,customer_name.ilike.%${search}%,id.ilike.%${search}%`);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Get summary statistics
    const { data: summaryData, error: summaryError } = await supabaseAdmin
      .from('orders')
      .select('status, total_amount')
      .not('status', 'eq', 'CANCELLED');

    let summary = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };

    if (!summaryError && summaryData) {
      summary = {
        totalOrders: summaryData.length,
        pendingOrders: summaryData.filter(o => ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(o.status)).length,
        completedOrders: summaryData.filter(o => ['DELIVERED'].includes(o.status)).length,
        totalRevenue: summaryData.reduce((sum, o) => sum + (o.total_amount || 0), 0),
        averageOrderValue: summaryData.length > 0 ? summaryData.reduce((sum, o) => sum + (o.total_amount || 0), 0) / summaryData.length : 0
      };
    }

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      summary
    });

  } catch (error) {
    console.error('Error in GET /api/admin/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status, fulfillmentStatus, notes } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (status) updates.status = status;
    if (fulfillmentStatus) updates.fulfillment_status = fulfillmentStatus;
    if (notes !== undefined) updates.notes = notes;

    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            images
          )
        )
      `)
      .single();

    if (error || !updatedOrder) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}