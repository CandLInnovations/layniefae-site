import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// Simple admin credentials (in production, use proper user management)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'mystic123'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate JWT token
      const token = sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        success: true,
        token,
        message: 'Welcome to the sacred admin portal'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid mystical credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}