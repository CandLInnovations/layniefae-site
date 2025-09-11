'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCategory, Element } from '@/types/product';

export default function NewProductPage() {
  const [isLoading, setIsLoading] = useState(false);
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
      chakras: [] as string[]
    },
    images: [] as File[]
  });
  const [customIntention, setCustomIntention] = useState('');
  const [allCategories, setAllCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const router = useRouter();

  // Fetch categories from database
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

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      loadCategories();
    }
  }, [router]);


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert price to cents
      const priceInCents = Math.round(parseFloat(product.price) * 100);
      
      const productData = {
        ...product,
        price: priceInCents,
        stockQuantity: parseInt(product.stockQuantity) || 0,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        router.push('/admin/dashboard?tab=products&success=created');
      } else {
        const error = await response.json();
        alert(`Error creating product: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
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
            <h1 className="font-serif text-xl text-mist-100">Create New Product</h1>
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
                  onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
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
            </div>

            {/* Submit Button */}
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
                disabled={isLoading}
                className="bg-plum-700 hover:bg-plum-600 disabled:bg-plum-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Sacred Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}