import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CustomerAuth } from '@/lib/customer-auth';

// Helper function to verify customer session
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
        birth_date,
        birth_time,
        birth_location,
        phone,
        is_active,
        email_verified,
        ritual_preferences,
        astrological_profile,
        created_at,
        updated_at
      )
    `)
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !sessionData || !sessionData.customer_profiles) {
    return null;
  }

  if (!sessionData.customer_profiles.is_active) {
    return null;
  }

  return sessionData.customer_profiles;
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

    return NextResponse.json({
      success: true,
      customer
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const customer = await verifyCustomerSession(request);
    
    if (!customer) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const updates = await request.json();
    
    // Validate and sanitize updates
    const allowedFields = [
      'first_name', 'last_name', 'birth_date', 'birth_time', 'birth_location', 
      'phone', 'ritual_preferences', 'astrological_profile'
    ];
    
    const sanitizedUpdates: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'first_name' || key === 'last_name') {
          sanitizedUpdates[key] = value ? CustomerAuth.sanitizeName(value as string) : null;
        } else if (key === 'phone') {
          if (value && !CustomerAuth.validatePhoneNumber(value as string)) {
            return NextResponse.json({
              success: false,
              error: 'Invalid phone number format'
            }, { status: 400 });
          }
          sanitizedUpdates[key] = value ? CustomerAuth.formatPhoneNumber(value as string) : null;
        } else if (key === 'birth_date') {
          if (value && new Date(value as string) > new Date()) {
            return NextResponse.json({
              success: false,
              error: 'Birth date cannot be in the future'
            }, { status: 400 });
          }
          sanitizedUpdates[key] = value;
        } else {
          sanitizedUpdates[key] = value;
        }
      }
    }

    // Add updated_at timestamp
    sanitizedUpdates.updated_at = new Date().toISOString();

    // Update customer profile
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customer_profiles')
      .update(sanitizedUpdates)
      .eq('id', customer.id)
      .select('id, email, first_name, last_name, birth_date, birth_time, birth_location, phone, is_active, email_verified, ritual_preferences, astrological_profile, created_at, updated_at')
      .single();

    if (updateError || !updatedCustomer) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update profile'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      customer: updatedCustomer
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}