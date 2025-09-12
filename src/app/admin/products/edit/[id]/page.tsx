'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Element } from '@/types/product';
import ImageUpload from '@/components/ImageUpload';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [productId, setProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'sacred_flowers',
    subcategory: '',
    stockQuantity: '',
    isCustomizable: false,
    ritualProperties: {
      elements: [] as Element[],
      intentions: [] as string[],
      moonPhase: '',
      chakras: [] as string[],
      sabbats: [] as string[],
      planetaryAssociations: [] as string[]
    },
    images: [] as { url: string; alt: string }[]
  });
  const [customIntention, setCustomIntention] = useState('');
  const [allCategories, setAllCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const router = useRouter();

  // Resolve params and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        setProductId(resolvedParams.id);
        
        // Check admin authentication
        const token = localStorage.getItem('admin-token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Load categories and product data in parallel
        await Promise.all([
          loadCategories(),
          loadProduct(resolvedParams.id, token)
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        router.push('/admin/dashboard');
      }
    };

    loadData();
  }, [params, router]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setAllCategories(data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async (id: string, token: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Product not found');
      }

      const productData = await response.json();
      
      // Transform data to match form structure
      setProduct({
        name: productData.name || '',
        description: productData.description || '',
        price: ((productData.price || 0) / 100).toFixed(2), // Convert from cents
        category: productData.categories?.slug || 'sacred_flowers',
        subcategory: productData.subcategory || '',
        stockQuantity: productData.stock_quantity?.toString() || '',
        isCustomizable: productData.is_customizable || false,
        ritualProperties: {
          elements: productData.ritual_properties?.elements || [],
          intentions: productData.ritual_properties?.intentions || [],
          moonPhase: productData.ritual_properties?.moon_phases?.[0] || '',
          chakras: [],
          sabbats: productData.ritual_properties?.sabbats || [],
          planetaryAssociations: productData.ritual_properties?.planetaryAssociations || []
        },
        images: (productData.images || []).map((img: any) => ({
          url: img.url,
          alt: img.altText || img.alt_text || img.alt || productData.name || 'Product image'
        }))
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Error loading product. Redirecting to dashboard.');
      router.push('/admin/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const elements = [
    { value: Element.EARTH, label: 'Earth 🌱', color: 'text-green-400' },
    { value: Element.AIR, label: 'Air 💨', color: 'text-blue-400' },
    { value: Element.FIRE, label: 'Fire 🔥', color: 'text-red-400' },
    { value: Element.WATER, label: 'Water 💧', color: 'text-cyan-400' },
    { value: Element.SPIRIT, label: 'Spirit ✨', color: 'text-purple-400' }
  ];

  const commonIntentions = [
    'Love & Relationships', 'Protection', 'Healing', 'Prosperity', 'Wisdom',
    'Courage', 'Peace', 'Purification', 'Intuition', 'Creativity', 'Balance', 'Grounding'
  ];

  const sabbats = [
    'Samhain', 'Yule', 'Imbolc', 'Ostara', 'Beltane', 'Litha', 'Lughnasadh', 'Mabon'
  ];

  const planetaryAssociations = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ];

  const chakras = [
    'Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setIsSaving(true);

    try {
      // Convert price to cents
      const priceInCents = Math.round(parseFloat(product.price) * 100);
      
      // Transform frontend data to database format
      const productData = {
        name: product.name,
        description: product.description,
        price: priceInCents,
        category_id: allCategories.find(cat => cat.slug === product.category)?.id || null,
        subcategory: product.subcategory,
        stock_quantity: parseInt(product.stockQuantity) || null,
        is_customizable: product.isCustomizable,
        ritual_properties: {
          elements: product.ritualProperties.elements,
          intentions: product.ritualProperties.intentions,
          moon_phases: product.ritualProperties.moonPhase ? [product.ritualProperties.moonPhase] : [],
          chakras: product.ritualProperties.chakras,
          sabbats: product.ritualProperties.sabbats,
          planetaryAssociations: product.ritualProperties.planetaryAssociations
        },
        images: product.images.map((img, index) => ({
          url: img.url,
          alt_text: img.alt || product.name,
          is_primary: index === 0,
          sort_order: index
        }))
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        router.push('/admin/dashboard?tab=products&success=updated');
      } else {
        const error = await response.json();
        alert(`Error updating product: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleElement = (element: Element) => {
    setProduct(prev => ({
      ...prev,
      ritualProperties: {
        ...prev.ritualProperties,
        elements: prev.ritualProperties.elements.includes(element)
          ? prev.ritualProperties.elements.filter(e => e !== element)
          : [...prev.ritualProperties.elements, element]
      }
    }));
  };

  const toggleIntention = (intention: string) => {
    setProduct(prev => ({
      ...prev,
      ritualProperties: {
        ...prev.ritualProperties,
        intentions: prev.ritualProperties.intentions.includes(intention)
          ? prev.ritualProperties.intentions.filter(i => i !== intention)
          : [...prev.ritualProperties.intentions, intention]
      }
    }));
  };

  const addCustomIntention = () => {
    if (customIntention.trim() && !product.ritualProperties.intentions.includes(customIntention.trim())) {
      setProduct(prev => ({
        ...prev,
        ritualProperties: {
          ...prev.ritualProperties,
          intentions: [...prev.ritualProperties.intentions, customIntention.trim()]
        }
      }));
      setCustomIntention('');
    }
  };

  const removeIntention = (intentionToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      ritualProperties: {
        ...prev.ritualProperties,
        intentions: prev.ritualProperties.intentions.filter(i => i !== intentionToRemove)
      }
    }));
  };

  const toggleSabbat = (sabbat: string) => {
    setProduct(prev => ({
      ...prev,
      ritualProperties: {
        ...prev.ritualProperties,
        sabbats: prev.ritualProperties.sabbats.includes(sabbat)
          ? prev.ritualProperties.sabbats.filter(s => s !== sabbat)
          : [...prev.ritualProperties.sabbats, sabbat]
      }
    }));
  };

  const togglePlanetaryAssociation = (planet: string) => {
    setProduct(prev => ({
      ...prev,
      ritualProperties: {
        ...prev.ritualProperties,
        planetaryAssociations: prev.ritualProperties.planetaryAssociations.includes(planet)
          ? prev.ritualProperties.planetaryAssociations.filter(p => p !== planet)
          : [...prev.ritualProperties.planetaryAssociations, planet]
      }
    }));
  };

  const toggleChakra = (chakra: string) => {
    setProduct(prev => ({
      ...prev,
      ritualProperties: {
        ...prev.ritualProperties,
        chakras: prev.ritualProperties.chakras.includes(chakra)
          ? prev.ritualProperties.chakras.filter(c => c !== chakra)
          : [...prev.ritualProperties.chakras, chakra]
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-plum-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-mist-200">Loading sacred product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-24">
      {/* Header */}
      <header className="bg-midnight-800/50 backdrop-blur-sm border-b border-plum-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center space-x-2 text-mist-300 hover:text-mist-100 transition-colors"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="font-serif text-xl text-mist-100">Edit Sacred Product</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  placeholder="Sacred Rose Love Bundle"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  placeholder="25.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Description *
              </label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="A mystical blend of roses and sacred herbs, blessed under the full moon..."
                required
              />
            </div>

            {/* Category and Stock */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Category *
                </label>
                <select
                  value={product.category}
                  onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                >
                  {allCategories.map((cat) => (
                    <option key={`category-${cat.id}`} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={product.subcategory}
                  onChange={(e) => setProduct(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  placeholder="Love Blends"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={product.stockQuantity}
                  onChange={(e) => setProduct(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Customizable Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="customizable"
                checked={product.isCustomizable}
                onChange={(e) => setProduct(prev => ({ ...prev, isCustomizable: e.target.checked }))}
                className="w-5 h-5 rounded border-plum-800 text-plum-600 focus:ring-plum-600 focus:ring-2"
              />
              <label htmlFor="customizable" className="text-mist-200">
                This product is customizable
              </label>
            </div>

            {/* Product Images */}
            <div className="border-t border-plum-800/30 pt-8">
              <h3 className="text-lg font-medium text-mist-100 mb-6">Product Images</h3>
              <ImageUpload
                onImageUpload={(images) => setProduct(prev => ({ ...prev, images }))}
                existingImages={product.images}
                maxImages={5}
              />
            </div>

            {/* Ritual Properties */}
            <div className="border-t border-plum-800/30 pt-8">
              <h3 className="text-lg font-medium text-mist-100 mb-6">Sacred Properties</h3>
              
              {/* Elements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mist-200 mb-3">
                  Associated Elements
                </label>
                <div className="flex flex-wrap gap-3">
                  {elements.map((element) => (
                    <button
                      key={`element-${element.value}`}
                      type="button"
                      onClick={() => toggleElement(element.value)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        product.ritualProperties.elements.includes(element.value)
                          ? 'bg-plum-700 border-plum-600 text-white'
                          : 'bg-midnight-700 border-plum-800/50 text-mist-300 hover:bg-midnight-600'
                      }`}
                    >
                      {element.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intentions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mist-200 mb-3">
                  Magical Intentions
                </label>
                
                {/* Selected Intentions */}
                {product.ritualProperties.intentions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-mist-400 mb-2">Selected intentions:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ritualProperties.intentions.map((intention, index) => (
                        <span
                          key={`selected-intention-${index}-${intention.toLowerCase().replace(/\s+/g, '-')}`}
                          className="inline-flex items-center px-3 py-1 bg-rose-700 text-white rounded-full text-sm"
                        >
                          {intention}
                          <button
                            type="button"
                            onClick={() => removeIntention(intention)}
                            className="ml-2 text-rose-200 hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Intentions */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {commonIntentions.map((intention, index) => (
                    <button
                      key={`intention-${index}-${intention.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => toggleIntention(intention)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        product.ritualProperties.intentions.includes(intention)
                          ? 'bg-rose-700 border-rose-600 text-white'
                          : 'bg-midnight-700 border-plum-800/50 text-mist-300 hover:bg-midnight-600'
                      }`}
                    >
                      {intention}
                    </button>
                  ))}
                </div>

                {/* Custom Intention Input */}
                <div className="bg-midnight-700/30 rounded-lg p-4 border border-plum-800/50">
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Add Custom Intention
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={customIntention}
                      onChange={(e) => setCustomIntention(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomIntention())}
                      className="flex-1 px-3 py-2 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                      placeholder="e.g., Manifestation, Shadow Work, Past Life Healing..."
                    />
                    <button
                      type="button"
                      onClick={addCustomIntention}
                      disabled={!customIntention.trim() || product.ritualProperties.intentions.includes(customIntention.trim())}
                      className="bg-rose-700 hover:bg-rose-600 disabled:bg-rose-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-mist-400 mt-2">Create your own unique magical intentions beyond the common ones</p>
                </div>
              </div>

              {/* Moon Phase */}
              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Optimal Moon Phase
                </label>
                <select
                  value={product.ritualProperties.moonPhase}
                  onChange={(e) => setProduct(prev => ({
                    ...prev,
                    ritualProperties: { ...prev.ritualProperties, moonPhase: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                >
                  <option value="">Select moon phase</option>
                  <option value="new-moon">New Moon 🌑</option>
                  <option value="waxing-crescent">Waxing Crescent 🌒</option>
                  <option value="first-quarter">First Quarter 🌓</option>
                  <option value="waxing-gibbous">Waxing Gibbous 🌔</option>
                  <option value="full-moon">Full Moon 🌕</option>
                  <option value="waning-gibbous">Waning Gibbous 🌖</option>
                  <option value="last-quarter">Last Quarter 🌗</option>
                  <option value="waning-crescent">Waning Crescent 🌘</option>
                </select>
              </div>

              {/* Sabbats Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-mist-200 mb-4">
                  🌟 Sacred Seasons (Sabbats)
                </label>
                
                {/* Selected Sabbats */}
                {product.ritualProperties.sabbats.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-mist-400 mb-2">Selected sabbats:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ritualProperties.sabbats.map((sabbat, index) => (
                        <span
                          key={`selected-sabbat-${index}-${sabbat.toLowerCase().replace(/\s+/g, '-')}`}
                          className="inline-flex items-center px-3 py-1 bg-earth-700 text-sage-200 rounded-full text-sm"
                        >
                          {sabbat}
                          <button
                            type="button"
                            onClick={() => toggleSabbat(sabbat)}
                            className="ml-2 hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Available Sabbats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sabbats.map((sabbat) => (
                    <button
                      key={`sabbat-option-${sabbat.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => toggleSabbat(sabbat)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        product.ritualProperties.sabbats.includes(sabbat)
                          ? 'bg-earth-700 border-earth-600 text-sage-200'
                          : 'bg-midnight-700 border-plum-800/50 text-mist-300 hover:bg-midnight-600'
                      }`}
                    >
                      {sabbat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Planetary Associations Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-mist-200 mb-4">
                  ⭐ Planetary Energies
                </label>
                
                {/* Selected Planetary Associations */}
                {product.ritualProperties.planetaryAssociations.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-mist-400 mb-2">Selected planetary associations:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ritualProperties.planetaryAssociations.map((planet, index) => (
                        <span
                          key={`selected-planet-${index}-${planet.toLowerCase().replace(/\s+/g, '-')}`}
                          className="inline-flex items-center px-3 py-1 bg-plum-700 text-rose-200 rounded-full text-sm"
                        >
                          {planet}
                          <button
                            type="button"
                            onClick={() => togglePlanetaryAssociation(planet)}
                            className="ml-2 hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Available Planetary Associations */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {planetaryAssociations.map((planet) => (
                    <button
                      key={`planet-option-${planet.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => togglePlanetaryAssociation(planet)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        product.ritualProperties.planetaryAssociations.includes(planet)
                          ? 'bg-plum-700 border-plum-600 text-rose-200'
                          : 'bg-midnight-700 border-plum-800/50 text-mist-300 hover:bg-midnight-600'
                      }`}
                    >
                      {planet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chakras Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-mist-200 mb-4">
                  🌀 Chakra Energies
                </label>
                
                {/* Selected Chakras */}
                {product.ritualProperties.chakras.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-mist-400 mb-2">Selected chakras:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ritualProperties.chakras.map((chakra, index) => (
                        <span
                          key={`selected-chakra-${index}-${chakra.toLowerCase().replace(/\s+/g, '-')}`}
                          className="inline-flex items-center px-3 py-1 bg-purple-700 text-purple-200 rounded-full text-sm"
                        >
                          {chakra}
                          <button
                            type="button"
                            onClick={() => toggleChakra(chakra)}
                            className="ml-2 hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Available Chakras */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {chakras.map((chakra) => (
                    <button
                      key={`chakra-option-${chakra.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => toggleChakra(chakra)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                        product.ritualProperties.chakras.includes(chakra)
                          ? 'bg-purple-700 border-purple-600 text-purple-200'
                          : 'bg-midnight-700 border-plum-800/50 text-mist-300 hover:bg-midnight-600'
                      }`}
                    >
                      {chakra}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-8 border-t border-plum-800/30">
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-3 border border-plum-600 text-plum-300 hover:bg-plum-600 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-plum-700 hover:bg-plum-600 disabled:bg-plum-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Sacred Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}