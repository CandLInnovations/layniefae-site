'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, Element } from '@/types/product';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        console.error('Product not found');
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/shop');
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

  const getMoonPhaseEmoji = (phase: string) => {
    const emojis: { [key: string]: string } = {
      'New Moon': '🌑',
      'new-moon': '🌑',
      'Waxing Crescent': '🌒',
      'waxing-crescent': '🌒',
      'First Quarter': '🌓',
      'first-quarter': '🌓',
      'Waxing Gibbous': '🌔',
      'waxing-gibbous': '🌔',
      'Full Moon': '🌕',
      'full-moon': '🌕',
      'Waning Gibbous': '🌖',
      'waning-gibbous': '🌖',
      'Last Quarter': '🌗',
      'last-quarter': '🌗',
      'Waning Crescent': '🌘',
      'waning-crescent': '🌘'
    };
    return emojis[phase] || '🌙';
  };

  const getSabbatEmoji = (sabbat: string) => {
    const emojis: { [key: string]: string } = {
      'Samhain': '🎃',
      'Yule': '🎄',
      'Imbolc': '🕯️',
      'Ostara': '🌸',
      'Beltane': '🌺',
      'Litha': '☀️',
      'Lughnasadh': '🌾',
      'Mabon': '🍂'
    };
    return emojis[sabbat] || '🌟';
  };

  const getPlanetaryEmoji = (planet: string) => {
    const emojis: { [key: string]: string } = {
      'Sun': '☉',
      'Moon': '☽',
      'Mercury': '☿',
      'Venus': '♀',
      'Mars': '♂',
      'Jupiter': '♃',
      'Saturn': '♄',
      'Uranus': '♅',
      'Neptune': '♆',
      'Pluto': '♇'
    };
    return emojis[planet] || '⭐';
  };

  const getChakraEmoji = (chakra: string) => {
    const emojis: { [key: string]: string } = {
      'Root': '🔴',
      'Sacral': '🟠', 
      'Solar Plexus': '🟡',
      'Heart': '💚',
      'Throat': '🔵',
      'Third Eye': '🟣',
      'Crown': '⚪'
    };
    return emojis[chakra] || '🌀';
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product.id,
        product.name,
        product.price,
        1,
        product.images?.[0]?.url
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-plum-600 border-t-transparent mb-4"></div>
          <p className="text-mist-200">Loading sacred details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="font-serif text-2xl text-mist-100 mb-4">Sacred Item Not Found</h2>
          <p className="text-mist-200 mb-6">This mystical offering may have been claimed by another soul.</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-plum-700 hover:bg-plum-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/shop')}
          className="flex items-center space-x-2 text-plum-400 hover:text-plum-300 transition-colors mb-8"
        >
          <span>←</span>
          <span>Back to Shop</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-midnight-800 border border-plum-800/30">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[currentImageIndex]?.url || product.images[0].url}
                  alt={product.images[currentImageIndex]?.altText || product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  🌸
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? 'border-plum-600'
                        : 'border-plum-800/30 hover:border-plum-700/50'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-plum-400 text-sm font-medium mb-2">{product.subcategory}</div>
              <h1 className="font-serif text-4xl text-mist-100 mb-4">{product.name}</h1>
              <div className="text-3xl font-bold text-plum-300 mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            <div>
              <p className="text-mist-200 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Stock and Customizable */}
            <div className="flex items-center space-x-6 text-sm text-mist-400">
              {(product as any).stock_quantity && (
                <div>{(product as any).stock_quantity} in stock</div>
              )}
              {(product as any).is_customizable && (
                <div className="flex items-center space-x-1">
                  <span>✨</span>
                  <span>Customizable</span>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="bg-midnight-800/50 rounded-2xl p-6 border border-plum-800/30">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-plum-700 to-plum-600 hover:from-plum-600 hover:to-plum-500 text-white py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25"
              >
                ✨ Add to Sacred Cart ✨
              </button>
            </div>

            {/* Mystical Properties */}
            {(product as any).ritual_properties && (
              <div className="bg-midnight-800/50 rounded-2xl p-6 border border-plum-800/30">
                <h3 className="font-serif text-xl text-mist-100 mb-6">Sacred Properties</h3>
                
                <div className="space-y-6">
                  {/* Elements */}
                  {(product as any).ritual_properties.elements && (product as any).ritual_properties.elements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-mist-200 mb-3">Associated Elements</h4>
                      <div className="flex flex-wrap gap-2">
                        {(product as any).ritual_properties.elements.map((element: Element, idx: number) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center space-x-2 px-3 py-2 bg-forest-800/50 text-sage-300 rounded-full text-sm"
                          >
                            <span>{getElementEmoji(element)}</span>
                            <span>{element}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intentions */}
                  {(product as any).ritual_properties.intentions && (product as any).ritual_properties.intentions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-mist-200 mb-3">💫 Magical Intentions</h4>
                      <div className="flex flex-wrap gap-2">
                        {(product as any).ritual_properties.intentions.map((intention: string, idx: number) => (
                          <span 
                            key={idx}
                            className="px-3 py-2 bg-rose-800/50 text-rose-300 rounded-full text-sm"
                          >
                            {intention}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Moon Phase */}
                  {(product as any).ritual_properties.moonPhase && (
                    <div>
                      <h4 className="text-sm font-medium text-mist-200 mb-3">🌙 Optimal Moon Phase</h4>
                      <div className="inline-flex items-center space-x-2 px-3 py-2 bg-midnight-700/50 text-plum-300 rounded-full">
                        <span>{getMoonPhaseEmoji((product as any).ritual_properties.moonPhase)}</span>
                        <span>{(product as any).ritual_properties.moonPhase.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                      </div>
                    </div>
                  )}

                  {/* Sabbats */}
                  {(product as any).ritual_properties.sabbats && (product as any).ritual_properties.sabbats.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-mist-200 mb-3">🌟 Sacred Seasons</h4>
                      <div className="flex flex-wrap gap-2">
                        {(product as any).ritual_properties.sabbats.map((sabbat: string, idx: number) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center space-x-2 px-3 py-2 bg-earth-800/50 text-sage-300 rounded-full text-sm"
                          >
                            <span>{getSabbatEmoji(sabbat)}</span>
                            <span>{sabbat}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Planetary Associations */}
                  {(product as any).ritual_properties.planetaryAssociations && (product as any).ritual_properties.planetaryAssociations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-mist-200 mb-3">⭐ Planetary Energies</h4>
                      <div className="flex flex-wrap gap-2">
                        {(product as any).ritual_properties.planetaryAssociations.map((planet: string, idx: number) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center space-x-2 px-3 py-2 bg-plum-800/50 text-rose-200 rounded-full text-sm"
                          >
                            <span>{getPlanetaryEmoji(planet)}</span>
                            <span>{planet}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chakras */}
                  {(product as any).ritual_properties.chakras && (product as any).ritual_properties.chakras.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-mist-200 mb-3">🌀 Chakra Energies</h4>
                      <div className="flex flex-wrap gap-2">
                        {(product as any).ritual_properties.chakras.map((chakra: string, idx: number) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-800/50 text-purple-300 rounded-full text-sm"
                          >
                            <span>{getChakraEmoji(chakra)}</span>
                            <span>{chakra}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}