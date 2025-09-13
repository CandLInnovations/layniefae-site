import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No session token provided'
      }, { status: 401 });
    }

    const sessionToken = authHeader.substring(7);

    // Verify session and get customer data
    const { data: sessionData, error: sessionError } = await supabase
      .from('customer_sessions')
      .select(`
        id,
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

    if (sessionError || !sessionData || !sessionData.customer_profiles) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired session'
      }, { status: 401 });
    }

    const customerProfile = Array.isArray(sessionData.customer_profiles) 
      ? sessionData.customer_profiles[0] 
      : sessionData.customer_profiles;

    // Check if customer is still active
    if (!customerProfile || !customerProfile.is_active) {
      return NextResponse.json({
        success: false,
        error: 'Account has been deactivated'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      customer: customerProfile,
      expires_at: sessionData.expires_at
    }, { status: 200 });

  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}