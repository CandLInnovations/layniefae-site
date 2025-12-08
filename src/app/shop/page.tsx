'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, Element, ProductSearchResult } from '@/types/product';
import { useCart } from '@/hooks/useCart';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const result: ProductSearchResult = await response.json();
      setProducts(result.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getElementEmoji = (element: Element) => {
    const emojis = {
      [Element.EARTH]: '🌱',
      [Element.AIR]: '💨',
      [Element.FIRE]: '🔥',
      [Element.WATER]: '💧',
      [Element.SPIRIT]: '✨'
    };
    return emojis[element];
  };


  const handleAddToCart = (product: Product) => {
    addToCart(
      product.id,
      product.name,
      product.price,
      1,
      product.images[0]?.url
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-mist-100 mb-6">
            Mystical Marketplace
          </h1>
          <div className="w-24 h-1 bg-plum-600 mx-auto mb-8"></div>
          <p className="text-xl text-mist-100 leading-relaxed max-w-3xl mx-auto">
            Discover handcrafted botanical blessings, sacred arrangements, and ritual tools 
            infused with intention and ancient wisdom.
          </p>
        </div>
      </section>

      {/* Gift Cards Quick Access */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/gift-cards"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-plum-600 to-purple-600 hover:from-plum-500 hover:to-purple-500 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-plum-500/25"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Gift Cards Available
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-plum-600 border-t-transparent"></div>
            <p className="text-mist-200 mt-4">Gathering sacred offerings...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="font-serif text-2xl text-mist-100 mb-4">No Sacred Items Found</h3>
            <p className="text-mist-200">Try again later to discover magical offerings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group bg-midnight-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-plum-800/30 hover:border-plum-600/50 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-midnight-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/50 to-transparent z-10"></div>
                  {product.images && product.images.length > 0 && product.images[0].url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.images[0].altText || product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-midnight-700">
                      🌸
                    </div>
                  )}
                  
                  {/* Element badges - simplified */}
                  {(product as any).ritual_properties?.elements && (product as any).ritual_properties.elements.length > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="flex space-x-1">
                        {(product as any).ritual_properties.elements.slice(0, 2).map((element: Element, idx: number) => (
                          <span 
                            key={idx}
                            className="bg-midnight-900/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-mist-100 border border-plum-600/30"
                            title={element}
                          >
                            {getElementEmoji(element)}
                          </span>
                        ))}
                        {(product as any).ritual_properties.elements.length > 2 && (
                          <span className="bg-midnight-900/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-mist-100 border border-plum-600/30">
                            +{(product as any).ritual_properties.elements.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customizable Badge */}
                  {(product as any).is_customizable && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-plum-700/90 backdrop-blur-sm text-xs px-3 py-1 rounded-full text-white">
                        ✨ Customizable
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-plum-400 text-sm font-medium">{product.subcategory}</span>
                  </div>
                  
                  <h3 className="font-serif text-xl text-mist-100 mb-3 group-hover:text-rose-200 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-mist-300 text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Brief mystical properties preview */}
                  {(product as any).ritual_properties && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-plum-400 flex items-center space-x-2">
                          {(product as any).ritual_properties.intentions?.length > 0 && (
                            <span>💫 {(product as any).ritual_properties.intentions.length} intentions</span>
                          )}
                          {(product as any).ritual_properties.moonPhase && (
                            <span>🌙 Moon work</span>
                          )}
                        </div>
                        <span className="text-xs text-mist-500">View details →</span>
                      </div>
                    </div>
                  )}

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold text-plum-300">
                      {formatPrice(product.price)}
                    </div>
                    {(product as any).stock_quantity && (
                      <div className="text-sm text-mist-400">
                        {(product as any).stock_quantity} in stock
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="flex-1 bg-plum-700 hover:bg-plum-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/${product.id}`);
                      }}
                      className="px-4 py-3 border border-plum-600 text-plum-300 hover:bg-plum-600 hover:text-white rounded-lg transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Gift Card "Product" */}
            <div 
              className="group bg-gradient-to-br from-plum-900/30 to-sage-900/20 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-plum-600/40 hover:border-sage-500/60 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer"
              onClick={() => router.push('/gift-cards')}
            >
              {/* Gift Card Image */}
              <div className="relative h-64 bg-gradient-to-br from-purple-800 via-plum-700 to-emerald-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/40 to-transparent z-10"></div>
                {/* Elemental Harmony Design Elements */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🌀</div>
                    <h3 className="font-serif text-2xl text-white/90 mb-2">Elemental Harmony</h3>
                    <p className="text-white/70 text-sm">Balance of earth, air, fire, and water</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-sage-600/90 text-white px-3 py-1 rounded-full text-xs font-medium z-20">
                  Special Offer
                </div>
              </div>
              
              {/* Gift Card Info */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-sage-400 text-sm font-medium">Perfect Gift</span>
                </div>
                
                <h3 className="font-serif text-xl text-mist-100 mb-3 group-hover:text-sage-200 transition-colors">
                  Sacred Gift Cards
                </h3>
                
                <p className="text-mist-300 text-sm mb-4 leading-relaxed">
                  Share the magic of mystical ceremonies and sacred botanicals. Available in multiple amounts for any occasion.
                </p>

                {/* Gift card features */}
                <div className="mb-4">
                  <div className="text-xs text-sage-400 flex items-center space-x-2">
                    <span>✨ Never expires</span>
                    <span>💌 Instant delivery</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-right">
                    <div className="text-xl font-semibold text-sage-100">Multiple Values</div>
                    <div className="text-sm text-sage-300">Starting at $25</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/gift-cards');
                    }}
                    className="flex-1 bg-gradient-to-r from-plum-600 to-purple-600 hover:from-plum-500 hover:to-purple-500 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-plum-500/25"
                  >
                    Purchase Gift Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}