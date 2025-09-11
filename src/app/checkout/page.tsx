'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Script from 'next/script';

interface PaymentForm {
  card?: any;
  googlePay?: any;
  applePay?: any;
}

interface SquarePayments {
  payments: (applicationId: string, locationId: string) => Promise<any>;
}

declare global {
  interface Window {
    Square?: SquarePayments;
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({});
  const [payments, setPayments] = useState<any>(null);
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);

  // Customer information form
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    console.log('Checkout page mounted, cart items:', cart.items.length);
    // Don't redirect, just show empty state message instead
  }, [cart.items.length]);

  // Initialize Square payments when component mounts and Square is loaded
  useEffect(() => {
    const initWhenReady = () => {
      if (window.Square && cart.items.length > 0) {
        console.log('Both Square and cart ready, initializing payments...');
        initializeSquarePayments();
      }
    };

    // Try to initialize immediately if Square is already loaded
    initWhenReady();
  }, [cart.items.length]); // Re-run if cart changes

  const initializeSquarePayments = async (retryCount = 0) => {
    if (!window.Square) {
      console.error('Square.js failed to load');
      return;
    }

    try {
      const paymentsInstance = window.Square.payments(
        process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!
      );
      
      const payments = await paymentsInstance;
      setPayments(payments);
      
      // Check if card container exists
      const cardContainer = document.getElementById('card-container');
      if (!cardContainer) {
        if (retryCount < 10) {
          console.log(`Card container not found, retrying... (${retryCount + 1}/10)`);
          setTimeout(() => initializeSquarePayments(retryCount + 1), 200);
          return;
        } else {
          console.error('Card container not found after 10 retries');
          return;
        }
      }
      
      console.log('Card container found, initializing Square payment form...');
      
      // Initialize card payment form
      const card = await payments.card();
      await card.attach('#card-container');
      
      setPaymentForm({ card });
      setIsSquareLoaded(true);
      
      console.log('Square payment form initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Square payments:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
    if (!customerInfo.city.trim()) newErrors.city = 'City is required';
    if (!customerInfo.state.trim()) newErrors.state = 'State is required';
    if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!paymentForm.card) {
      alert('Payment form not initialized. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await paymentForm.card.tokenize();
      
      if (result.status === 'OK') {
        // Send payment token to your backend
        const response = await fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: cart.total,
            currency: 'USD',
            customerInfo,
            cartItems: cart.items,
          }),
        });

        const paymentResult = await response.json();

        if (paymentResult.success) {
          // Clear cart and redirect to success page
          clearCart();
          router.push(`/checkout/success?orderId=${paymentResult.orderId}`);
        } else {
          throw new Error(paymentResult.error || 'Payment failed');
        }
      } else {
        throw new Error(result.errors?.join(', ') || 'Payment tokenization failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl text-mist-100 mb-6">
            Sacred Cart Empty
          </h1>
          <p className="text-mist-200 mb-8">
            Please add some mystical items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-plum-700 hover:bg-plum-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        onLoad={() => {
          console.log('Square.js loaded successfully');
          // Wait for DOM to be ready before initializing
          if (cart.items.length > 0) {
            setTimeout(() => {
              console.log('Attempting to initialize Square payments after script load...');
              initializeSquarePayments();
            }, 200);
          }
        }}
        onError={() => {
          console.error('Failed to load Square.js');
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-mist-100 mb-4">
              Sacred Checkout
            </h1>
            <div className="w-24 h-1 bg-plum-600 mx-auto mb-6"></div>
            <p className="text-mist-200">
              Complete your mystical purchase with blessed intention
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Sacred Order</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-plum-800/20">
                    <div className="w-16 h-16 bg-midnight-700 rounded-lg flex items-center justify-center text-2xl">
                      🌸
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-mist-100">{item.name}</h3>
                      <p className="text-mist-300 text-sm">Quantity: {item.quantity}</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="text-xs text-mist-400 mt-1">
                          {item.customizations.map((custom, idx) => (
                            <span key={idx}>
                              {custom.optionName}: {custom.value}{custom.additionalPrice ? ` (+${formatPrice(custom.additionalPrice)})` : ''}
                              {idx < item.customizations!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-plum-300 font-medium">
                      {formatPrice((item.price + (item.customizations?.reduce((sum, custom) => sum + (custom.additionalPrice || 0), 0) || 0)) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-mist-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-mist-100 pt-2 border-t border-plum-800/30">
                  <span>Total:</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Sacred Details</h2>
              
              {/* Customer Information */}
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                      placeholder="First name"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                      placeholder="Last name"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                      placeholder="ST"
                    />
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={customerInfo.zipCode}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-4 py-3 bg-midnight-700 border border-plum-800/50 rounded-lg text-midnight-800 bg-mist-100 focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                      placeholder="12345"
                    />
                    {errors.zipCode && <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-mist-200 mb-4">Payment Method</h3>
                <div 
                  id="card-container"
                  className="bg-mist-100 rounded-lg p-4 border border-plum-800/50 focus-within:border-plum-600 transition-colors"
                >
                  {!isSquareLoaded && (
                    <div className="text-center py-4 text-mist-400">
                      Loading payment form...
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Purchase Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading || !isSquareLoaded}
                className="w-full bg-plum-700 hover:bg-plum-600 disabled:bg-plum-800 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Sacred Transaction...</span>
                  </div>
                ) : (
                  `Complete Sacred Purchase • ${formatPrice(cart.total)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}