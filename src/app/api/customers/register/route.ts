import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CustomerAuth } from '@/lib/customer-auth';
import { CustomerRegistration, CustomerAuthResponse } from '@/types/customer';

export async function POST(request: NextRequest) {
  try {
    const body: CustomerRegistration = await request.json();
    const { email, password, first_name, last_name, birth_date, birth_time, birth_location, phone } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      } as CustomerAuthResponse, { status: 400 });
    }

    // Validate email format
    if (!CustomerAuth.isValidEmail(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      } as CustomerAuthResponse, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = CustomerAuth.isStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({
        success: false,
        error: `Password requirements not met: ${passwordValidation.errors.join(', ')}`
      } as CustomerAuthResponse, { status: 400 });
    }

    // Validate phone number if provided
    if (phone && !CustomerAuth.validatePhoneNumber(phone)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid phone number format'
      } as CustomerAuthResponse, { status: 400 });
    }

    // Sanitize input
    const sanitizedEmail = CustomerAuth.sanitizeEmail(email);
    const sanitizedFirstName = first_name ? CustomerAuth.sanitizeName(first_name) : null;
    const sanitizedLastName = last_name ? CustomerAuth.sanitizeName(last_name) : null;
    const formattedPhone = phone ? CustomerAuth.formatPhoneNumber(phone) : null;

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customer_profiles')
      .select('id')
      .eq('email', sanitizedEmail)
      .single();

    if (existingCustomer) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists'
      } as CustomerAuthResponse, { status: 409 });
    }

    // Hash password
    const hashedPassword = await CustomerAuth.hashPassword(password);
    
    // Generate verification token
    const verificationToken = CustomerAuth.generateVerificationToken();

    // Create customer profile
    const { data: newCustomer, error: createError } = await supabase
      .from('customer_profiles')
      .insert({
        email: sanitizedEmail,
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        password_hash: hashedPassword,
        birth_date: birth_date || null,
        birth_time: birth_time || null,
        birth_location: birth_location || null,
        phone: formattedPhone,
        email_verification_token: verificationToken,
        ritual_preferences: {},
        astrological_profile: {}
      })
      .select('id, email, first_name, last_name, birth_date, birth_time, birth_location, phone, is_active, email_verified, ritual_preferences, astrological_profile, created_at, updated_at')
      .single();

    if (createError || !newCustomer) {
      console.error('Error creating customer:', createError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create account. Please try again.'
      } as CustomerAuthResponse, { status: 500 });
    }

    // Create session
    const sessionToken = CustomerAuth.generateSessionToken();
    const expiresAt = CustomerAuth.getSessionExpiration();

    const { error: sessionError } = await supabase
      .from('customer_sessions')
      .insert({
        customer_id: newCustomer.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json({
        success: false,
        error: 'Account created but login failed. Please try logging in.'
      } as CustomerAuthResponse, { status: 500 });
    }

    // TODO: Send verification email here
    console.log(`Verification token for ${sanitizedEmail}: ${verificationToken}`);

    return NextResponse.json({
      success: true,
      customer: newCustomer,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString()
    } as CustomerAuthResponse, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as CustomerAuthResponse, { status: 500 });
  }
}