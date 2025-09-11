'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    
    // Optional: Scroll to top
    window.scrollTo(0, 0);
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl text-mist-100 mb-6">
            Sacred Purchase Complete
          </h1>
          <p className="text-mist-200 mb-8">
            Your mystical journey has been blessed, but we couldn't find your order details.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-plum-700 hover:bg-plum-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-32 pb-20 relative overflow-hidden">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-plum-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-rose-400/15 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-plum-600/10 rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-8 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl animate-float delay-500"></div>
        <div className="absolute top-60 left-1/2 w-20 h-20 bg-plum-400/25 rounded-full blur-xl animate-bounce delay-700"></div>
      </div>

      {/* Floating Mystical Elements */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            >
              {['✨', '🌙', '🔮', '🌸', '⭐', '💫', '🦋', '🌿'][i % 8]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-plum-700/20 rounded-full mb-4">
              <div className="w-16 h-16 bg-plum-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl text-mist-100 mb-4">
            Sacred Purchase Complete!
          </h1>
          <div className="w-32 h-1 bg-plum-600 mx-auto mb-6"></div>
          <p className="text-xl text-mist-200 leading-relaxed">
            Your mystical treasures have been blessed and are now making their way to you with sacred intention.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-mist-100">Order Details</h2>
            <div className="text-right">
              <div className="text-sm text-mist-300">Order ID</div>
              <div className="font-mono text-sm text-plum-300 bg-midnight-900/50 px-3 py-1 rounded">
                {orderId.substring(0, 8)}...
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-mist-200">
              <div className="w-8 h-8 bg-plum-700/20 rounded-full flex items-center justify-center">
                <span className="text-plum-300">📧</span>
              </div>
              <span>A confirmation email has been sent with your sacred receipt</span>
            </div>
            
            <div className="flex items-center space-x-3 text-mist-200">
              <div className="w-8 h-8 bg-plum-700/20 rounded-full flex items-center justify-center">
                <span className="text-plum-300">📦</span>
              </div>
              <span>Your mystical items will be prepared with loving intention</span>
            </div>
            
            <div className="flex items-center space-x-3 text-mist-200">
              <div className="w-8 h-8 bg-plum-700/20 rounded-full flex items-center justify-center">
                <span className="text-plum-300">🌙</span>
              </div>
              <span>Shipping will be arranged within 1-2 sacred days</span>
            </div>
          </div>
        </div>

        {/* Magical Thank You Message */}
        <div className="bg-gradient-to-r from-plum-900/30 to-rose-900/30 backdrop-blur-sm rounded-3xl p-8 border border-plum-600/30 mb-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="font-serif text-2xl text-mist-100 mb-4">
              Blessed Be & Thank You
            </h3>
            <p className="text-mist-200 leading-relaxed max-w-2xl mx-auto">
              Your support of our sacred work means everything. These treasures have been infused with positive 
              energy and intention, carrying with them the blessings of ancient wisdom and modern magic. 
              May they serve you well on your mystical journey.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/shop"
            className="bg-plum-700 hover:bg-plum-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25"
          >
            Continue Sacred Shopping
          </Link>
          
          <Link
            href="/"
            className="border border-plum-600 text-plum-300 hover:bg-plum-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Return to Sacred Home
          </Link>
          
          <Link
            href="/contact"
            className="text-mist-300 hover:text-rose-200 transition-colors duration-300 underline decoration-plum-600"
          >
            Need assistance with your order?
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-sm text-mist-400">
          <p>
            For questions about your sacred purchase, please reach out through our contact page.
            <br />
            We&apos;re here to support your mystical journey every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
}