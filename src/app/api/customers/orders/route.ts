import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to verify customer session (same as in profile route)
async function verifyCustomerSession(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const sessionToken = authHeader.substring(7);

  const { data: sessionData, error } = await supabase
    .from('customer_sessions')
    .select(`
      customer_id,
      expires_at,
      customer_profiles (
        id,
        email,
        first_name,
        last_name,
        is_active
      )
    `)
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !sessionData) {
    return null;
  }

  // Handle both array and object responses from Supabase
  let customerProfile;
  if (Array.isArray(sessionData.customer_profiles)) {
    if (sessionData.customer_profiles.length === 0) {
      return null;
    }
    customerProfile = sessionData.customer_profiles[0];
  } else {
    customerProfile = sessionData.customer_profiles;
  }
  
  if (!customerProfile) {
    return null;
  }
  
  // Check is_active if it exists, otherwise assume active
  if (customerProfile.is_active === false) {
    return null;
  }

  return customerProfile;
}

export async function GET(request: NextRequest) {
  try {
    const customer = await verifyCustomerSession(request);
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Fetch orders for this customer by customer_id ONLY (proper architecture)
    // Use supabaseAdmin (service role) to bypass RLS while still validating customer session
    const { data: orders, error, count } = await supabaseAdmin
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
      `, { count: 'exact' })
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching customer orders:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch orders'
      }, { status: 500 });
    }

    // Calculate order statistics
    const { data: allOrders } = await supabaseAdmin
      .from('orders')
      .select('status, total_amount')
      .eq('customer_id', customer.id)
      .not('status', 'eq', 'CANCELLED');

    const stats = {
      totalOrders: allOrders?.length || 0,
      pendingOrders: allOrders?.filter(o => ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(o.status)).length || 0,
      completedOrders: allOrders?.filter(o => ['DELIVERED'].includes(o.status)).length || 0,
      totalSpent: allOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
    };

    return NextResponse.json({
      success: true,
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Customer orders fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}