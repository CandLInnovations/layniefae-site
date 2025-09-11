import { NextRequest, NextResponse } from 'next/server';
import { squareClient } from '@/lib/square-client';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      sourceId,
      amount,
      currency = 'USD',
      customerInfo,
      cartItems,
    } = await request.json();

    console.log('Payment request received:', {
      sourceId: sourceId ? 'present' : 'missing',
      amount,
      currency,
      itemCount: cartItems?.length
    });

    if (!sourceId || !amount || !customerInfo || !cartItems) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Debug Square client
    console.log('Square client initialized:', !!squareClient);
    console.log('Payments API available:', !!squareClient.payments);

    // Convert dollar amount to cents for Square API
    const amountInCents = Math.round(amount);

    // Generate unique idempotency key for this payment
    const idempotencyKey = randomUUID();

    // Create the payment request
    const paymentRequest = {
      sourceId,
      amountMoney: {
        amount: BigInt(amountInCents),
        currency: currency.toUpperCase(),
      },
      idempotencyKey,
      locationId: process.env.SQUARE_LOCATION_ID!,
      note: `Laynie Fae Sacred Purchase - ${cartItems.length} item(s)`,
      // Optional: Add customer information
      buyerEmailAddress: customerInfo.email,
    };

    console.log('Processing payment with request:', {
      ...paymentRequest,
      sourceId: 'hidden'
    });

    // Process the payment with Square
    const response = await squareClient.payments.create(paymentRequest);
    
    if (response && response.payment) {
      const payment = response.payment;
      
      // TODO: Save order to database here
      // For now, we'll just return success with order details
      
      const orderDetails = {
        orderId: payment.id,
        status: payment.status,
        amount: amountInCents,
        currency,
        customerInfo,
        items: cartItems,
        createdAt: payment.createdAt,
        receiptUrl: payment.receiptUrl,
      };

      // Log successful payment for debugging
      console.log('Payment successful:', {
        orderId: payment.id,
        amount: amountInCents,
        status: payment.status,
      });

      return NextResponse.json({
        success: true,
        orderId: payment.id,
        status: payment.status,
        receiptUrl: payment.receiptUrl,
        orderDetails,
      });
    } else {
      // Payment failed
      const errors = response.errors?.map((error: any) => error.detail).join(', ') || 'Payment processing failed';
      
      console.error('Payment failed:', {
        errors: response.errors,
      });

      return NextResponse.json(
        { error: errors },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment processing error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error during payment processing' },
      { status: 500 }
    );
  }
}