import { NextRequest, NextResponse } from 'next/server';
import { GiftCardPurchaseData } from '@/types/giftcard';

// POST - Process gift card purchase
export async function POST(request: NextRequest) {
  try {
    const giftCardData: GiftCardPurchaseData = await request.json();
    
    // Validate required fields
    if (!giftCardData.amount || !giftCardData.purchaserEmail || !giftCardData.recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, purchaser email, or recipient email' },
        { status: 400 }
      );
    }

    // Generate unique gift card code
    const giftCardCode = `GC${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create gift card record (in production, this would be saved to database)
    const giftCard = {
      id: `giftcard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code: giftCardCode,
      amount: giftCardData.amount,
      design: giftCardData.design,
      purchaserName: giftCardData.purchaserName,
      purchaserEmail: giftCardData.purchaserEmail,
      recipientName: giftCardData.recipientName,
      recipientEmail: giftCardData.recipientEmail,
      message: giftCardData.message || '',
      status: 'active',
      balance: giftCardData.amount,
      createdAt: new Date().toISOString(),
      expiresAt: null // Never expires
    };

    console.log('Gift card created:', {
      code: giftCard.code,
      amount: giftCard.amount,
      recipient: giftCard.recipientEmail
    });

    // In production, you would:
    // 1. Save gift card to database
    // 2. Send email to recipient with gift card
    // 3. Send confirmation email to purchaser
    // 4. Process payment through Square

    return NextResponse.json({
      success: true,
      giftCard: {
        id: giftCard.id,
        code: giftCard.code,
        amount: giftCard.amount,
        design: giftCard.design
      },
      message: 'Sacred gift card created successfully'
    });
  } catch (error) {
    console.error('Error processing gift card:', error);
    return NextResponse.json(
      { error: 'Failed to process gift card purchase' },
      { status: 500 }
    );
  }
}

// GET - Validate gift card code (for checkout)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'Gift card code is required' },
        { status: 400 }
      );
    }

    // In production, look up gift card in database
    // For now, return mock validation
    
    return NextResponse.json({
      success: true,
      giftCard: {
        code,
        balance: 5000, // $50.00 in cents
        isValid: true
      }
    });
  } catch (error) {
    console.error('Error validating gift card:', error);
    return NextResponse.json(
      { error: 'Failed to validate gift card' },
      { status: 500 }
    );
  }
}