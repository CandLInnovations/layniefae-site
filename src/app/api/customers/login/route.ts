import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CustomerAuth } from '@/lib/customer-auth';
import { CustomerLogin, CustomerAuthResponse } from '@/types/customer';

export async function POST(request: NextRequest) {
  try {
    const body: CustomerLogin = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      } as CustomerAuthResponse, { status: 400 });
    }

    // Sanitize email
    const sanitizedEmail = CustomerAuth.sanitizeEmail(email);

    // Find customer
    const { data: customer, error: findError } = await supabase
      .from('customer_profiles')
      .select('id, email, first_name, last_name, password_hash, birth_date, birth_time, birth_location, phone, is_active, email_verified, ritual_preferences, astrological_profile, created_at, updated_at')
      .eq('email', sanitizedEmail)
      .single();

    if (findError || !customer) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      } as CustomerAuthResponse, { status: 401 });
    }

    // Check if account is active
    if (!customer.is_active) {
      return NextResponse.json({
        success: false,
        error: 'Account has been deactivated. Please contact support.'
      } as CustomerAuthResponse, { status: 403 });
    }

    // Verify password
    const isValidPassword = await CustomerAuth.verifyPassword(password, customer.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      } as CustomerAuthResponse, { status: 401 });
    }

    // Clean up expired sessions for this customer
    await supabase
      .from('customer_sessions')
      .delete()
      .eq('customer_id', customer.id)
      .lt('expires_at', new Date().toISOString());

    // Create new session
    const sessionToken = CustomerAuth.generateSessionToken();
    const expiresAt = CustomerAuth.getSessionExpiration();

    const { error: sessionError } = await supabase
      .from('customer_sessions')
      .insert({
        customer_id: customer.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json({
        success: false,
        error: 'Login failed. Please try again.'
      } as CustomerAuthResponse, { status: 500 });
    }

    // Remove password hash from response
    const { password_hash, ...customerWithoutPassword } = customer;

    return NextResponse.json({
      success: true,
      customer: customerWithoutPassword,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString()
    } as CustomerAuthResponse, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as CustomerAuthResponse, { status: 500 });
  }
}