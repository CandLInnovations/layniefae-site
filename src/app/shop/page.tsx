'use client';

import React, { useState, useEffect } from 'react';
import { Product, Element, ProductSearchResult } from '@/types/product';
import { useCart } from '@/hooks/useCart';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const result: ProductSearchResult = await response.json();
      setProducts(result.products);
    } catch (error) {
      console.error('Error fetching products:', error);
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group bg-midnight-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-plum-800/30 hover:border-plum-600/50 transition-all duration-500 hover:transform hover:scale-105"
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
                  
                  {/* Ritual Properties Overlay */}
                  {product.ritualProperties && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="flex space-x-1">
                        {product.ritualProperties.elements.slice(0, 3).map((element, idx) => (
                          <span 
                            key={idx}
                            className="bg-midnight-900/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-mist-100 border border-plum-600/30"
                            title={element}
                          >
                            {getElementEmoji(element)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customizable Badge */}
                  {product.isCustomizable && (
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

                  {/* Intentions */}
                  {product.ritualProperties?.intentions && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.ritualProperties.intentions.slice(0, 3).map((intention, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-forest-800/50 text-rose-300 px-2 py-1 rounded-full"
                          >
                            {intention}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold text-plum-300">
                      {formatPrice(product.price)}
                    </div>
                    {product.stockQuantity && (
                      <div className="text-sm text-mist-400">
                        {product.stockQuantity} in stock
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-plum-700 hover:bg-plum-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                    <button className="px-4 py-3 border border-plum-600 text-plum-300 hover:bg-plum-600 hover:text-white rounded-lg transition-colors duration-300">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}