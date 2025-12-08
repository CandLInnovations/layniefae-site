'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

export default function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getItemTotalPrice = (item: any) => {
    const customizationPrice = item.customizations?.reduce((sum: number, custom: any) => 
      sum + (custom.additionalPrice || 0), 0) || 0;
    return (item.price + customizationPrice) * item.quantity;
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-midnight-900/80 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-midnight-800 shadow-2xl z-50 transform transition-transform duration-300 border-l border-plum-800/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-plum-800/30">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🛒</div>
            <div>
              <h2 className="font-serif text-xl text-mist-100">Sacred Cart</h2>
              <p className="text-sm text-mist-400">{cart.itemCount} items</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-mist-400 hover:text-mist-100 transition-colors rounded-lg hover:bg-midnight-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto max-h-96 p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌙</div>
              <h3 className="font-serif text-lg text-mist-100 mb-2">Your cart is empty</h3>
              <p className="text-mist-400 text-sm">Add some magical items to begin your journey</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div key={item.id} className="group">
                  <div className="flex space-x-4 p-4 rounded-2xl bg-midnight-700/50 border border-plum-800/30 hover:border-plum-600/50 transition-all duration-300">
                    
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg bg-midnight-600 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🌸
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-mist-100 text-sm leading-tight mb-1">
                        {item.name}
                      </h4>
                      
                      {item.variationName && (
                        <p className="text-xs text-plum-400 mb-1">
                          {item.variationName}
                        </p>
                      )}

                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mb-2">
                          {item.customizations.map((custom, idx) => (
                            <p key={idx} className="text-xs text-mist-400">
                              {custom.optionName}: {custom.value}
                              {custom.additionalPrice && custom.additionalPrice > 0 && (
                                <span className="text-plum-400 ml-1">
                                  (+{formatPrice(custom.additionalPrice)})
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-midnight-600 text-mist-300 hover:bg-plum-700 hover:text-white transition-colors flex items-center justify-center text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm text-mist-100 min-w-[24px] sm:min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-midnight-600 text-mist-300 hover:bg-plum-700 hover:text-white transition-colors flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm font-medium text-plum-300">
                            {formatPrice(getItemTotalPrice(item))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-mist-500 hover:text-rose-400 transition-all duration-200 p-2 sm:p-1"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cart.items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-center py-2 text-sm text-mist-500 hover:text-rose-400 transition-colors"
                >
                  Clear all items
                </button>
              )}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-plum-800/30 p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-mist-200">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-mist-100 pt-2 border-t border-plum-800/30">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                // Navigate to checkout - we'll implement this next
                window.location.href = '/checkout';
              }}
              className="w-full bg-gradient-to-r from-plum-700 to-plum-600 hover:from-plum-600 hover:to-plum-500 text-white py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25"
            >
              ✨ Begin Sacred Checkout ✨
            </button>
            
            <p className="text-xs text-center text-mist-400">
              Secure payment powered by Square
            </p>
          </div>
        )}
      </div>
    </>
  );
}