import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No session token provided'
      }, { status: 400 });
    }

    const sessionToken = authHeader.substring(7);

    // Delete the session
    const { error } = await supabase
      .from('customer_sessions')
      .delete()
      .eq('session_token', sessionToken);

    if (error) {
      console.error('Error logging out:', error);
      return NextResponse.json({
        success: false,
        error: 'Logout failed'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}