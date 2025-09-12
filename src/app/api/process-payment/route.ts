import { NextRequest, NextResponse } from 'next/server';
import { squareClient } from '@/lib/square-client';
import { supabaseAdmin } from '@/lib/supabase';
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
      
      // Save order to database
      const orderId = randomUUID();
      
      // Check if customer is logged in by looking up their profile
      let customerId = null;
      try {
        const { data: customerProfile } = await supabaseAdmin
          .from('customer_profiles')
          .select('id')
          .eq('email', customerInfo.email)
          .single();
        
        if (customerProfile) {
          customerId = customerProfile.id;
        }
      } catch (error) {
        // Customer not found or not logged in - that's okay, order will still be saved
        console.log('No customer profile found for email:', customerInfo.email);
      }
      
      const orderData = {
        id: orderId,
        square_payment_id: payment.id,
        status: 'CONFIRMED',
        total_amount: amountInCents,
        currency: currency.toUpperCase(),
        customer_id: customerId, // Link to customer profile if they're registered
        customer_email: customerInfo.email,
        customer_name: customerInfo.name || '',
        payment_method: 'SQUARE',
        square_receipt_url: payment.receiptUrl,
        fulfillment_status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: savedOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Error saving order:', orderError);
        // Don't fail the payment, but log the error
      }

      // Save order items
      if (savedOrder && cartItems.length > 0) {
        const orderItems = cartItems.map(item => ({
          id: randomUUID(),
          order_id: orderId,
          product_id: item.productId,
          product_name: item.name,
          product_image: item.image || null,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          variation_name: item.variationName || null,
          customizations: item.customizations || null
        }));

        const { error: itemsError } = await supabaseAdmin
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Error saving order items:', itemsError);
        }
      }
      
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