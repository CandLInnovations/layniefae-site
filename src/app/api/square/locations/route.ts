import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square-client';

export async function GET() {
  try {
    const response = await squareClient.locations.list();
    
    if (response.locations && response.locations.length > 0) {
      return NextResponse.json({ locations: response.locations });
    } else {
      return NextResponse.json({ error: 'No locations found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching Square locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' }, 
      { status: 500 }
    );
  }
}