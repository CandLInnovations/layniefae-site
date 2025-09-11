'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Cart, CartItem, CartCustomization } from '@/types/cart';

interface CartContextType {
  cart: Cart;
  addToCart: (
    productId: string, 
    name: string, 
    price: number, 
    quantity?: number,
    image?: string,
    customizations?: CartCustomization[],
    variationId?: string,
    variationName?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('layniefae-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('layniefae-cart', JSON.stringify(cart));
  }, [cart]);

  const calculateCartTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => {
      const itemPrice = item.price + (item.customizations?.reduce((customSum, custom) => 
        customSum + (custom.additionalPrice || 0), 0) || 0);
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // For now, total equals subtotal (no tax calculation)
    const total = subtotal;
    
    return { subtotal, total, itemCount };
  };

  const addToCart = (
    productId: string,
    name: string,
    price: number,
    quantity = 1,
    image?: string,
    customizations?: CartCustomization[],
    variationId?: string,
    variationName?: string
  ) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(item => 
        item.productId === productId && 
        item.variationId === variationId &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = currentCart.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId,
          name,
          price,
          quantity,
          image,
          customizations,
          variationId,
          variationName
        };
        newItems = [...currentCart.items, newItem];
      }

      const totals = calculateCartTotals(newItems);
      return {
        items: newItems,
        ...totals
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(item => item.id !== itemId);
      const totals = calculateCartTotals(newItems);
      return {
        items: newItems,
        ...totals
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(currentCart => {
      const newItems = currentCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const totals = calculateCartTotals(newItems);
      return {
        items: newItems,
        ...totals
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      total: 0,
      itemCount: 0
    });
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}