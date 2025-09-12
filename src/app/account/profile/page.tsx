'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { Element } from '@/types/product';
import { RitualPreferences, ZODIAC_SIGNS, MOON_PHASES, EXPERIENCE_LEVELS } from '@/types/customer';
import { Order, OrderStatus } from '@/types/order';

const elements = [
  { value: Element.EARTH, label: 'Earth', emoji: '🌱', description: 'Grounding, stability, abundance' },
  { value: Element.AIR, label: 'Air', emoji: '💨', description: 'Communication, intellect, new beginnings' },
  { value: Element.FIRE, label: 'Fire', emoji: '🔥', description: 'Passion, transformation, courage' },
  { value: Element.WATER, label: 'Water', emoji: '💧', description: 'Emotion, intuition, healing' },
  { value: Element.SPIRIT, label: 'Spirit', emoji: '✨', description: 'Connection, transcendence, unity' }
];

const commonIntentions = [
  'Love & Relationships', 'Protection', 'Healing', 'Prosperity', 'Wisdom',
  'Courage', 'Peace', 'Purification', 'Intuition', 'Creativity', 'Balance', 
  'Grounding', 'Manifestation', 'Shadow Work', 'Past Life Healing'
];

const sabbats = [
  { name: 'Samhain', emoji: '🎃', description: 'Honoring ancestors, divination' },
  { name: 'Yule', emoji: '🎄', description: 'Winter solstice, rebirth of light' },
  { name: 'Imbolc', emoji: '🕯️', description: 'Purification, new beginnings' },
  { name: 'Ostara', emoji: '🌸', description: 'Spring equinox, balance, fertility' },
  { name: 'Beltane', emoji: '🌺', description: 'Fertility, passion, life force' },
  { name: 'Litha', emoji: '☀️', description: 'Summer solstice, peak power' },
  { name: 'Lughnasadh', emoji: '🌾', description: 'First harvest, gratitude' },
  { name: 'Mabon', emoji: '🍂', description: 'Autumn equinox, thanksgiving' }
];

const planets = [
  { name: 'Sun', emoji: '☉', description: 'Vitality, leadership, self-expression' },
  { name: 'Moon', emoji: '☽', description: 'Intuition, emotions, cycles' },
  { name: 'Mercury', emoji: '☿', description: 'Communication, learning, travel' },
  { name: 'Venus', emoji: '♀', description: 'Love, beauty, relationships' },
  { name: 'Mars', emoji: '♂', description: 'Action, courage, passion' },
  { name: 'Jupiter', emoji: '♃', description: 'Expansion, wisdom, abundance' },
  { name: 'Saturn', emoji: '♄', description: 'Discipline, structure, lessons' },
  { name: 'Uranus', emoji: '♅', description: 'Innovation, rebellion, awakening' },
  { name: 'Neptune', emoji: '♆', description: 'Dreams, spirituality, illusion' },
  { name: 'Pluto', emoji: '♇', description: 'Transformation, rebirth, power' }
];

const chakras = [
  { name: 'Root', emoji: '🔴', description: 'Grounding, survival, stability' },
  { name: 'Sacral', emoji: '🟠', description: 'Creativity, sexuality, emotions' },
  { name: 'Solar Plexus', emoji: '🟡', description: 'Personal power, confidence' },
  { name: 'Heart', emoji: '💚', description: 'Love, compassion, connection' },
  { name: 'Throat', emoji: '🔵', description: 'Communication, truth, expression' },
  { name: 'Third Eye', emoji: '🟣', description: 'Intuition, wisdom, psychic abilities' },
  { name: 'Crown', emoji: '⚪', description: 'Spirituality, enlightenment, unity' }
];

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading, logout, updateProfile } = useCustomerAuth();
  const { orders, stats, isLoading: ordersLoading, error: ordersError, pagination, goToPage } = useCustomerOrders();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSavingRef = useRef(false);

  // Profile form data
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    birth_time: '',
    birth_location: '',
    phone: ''
  });

  // Ritual preferences form data
  const [ritualPrefs, setRitualPrefs] = useState<RitualPreferences>({
    preferred_elements: [],
    favorite_intentions: [],
    preferred_moon_phases: [],
    favorite_sabbats: [],
    chakra_focus: [],
    planetary_affinities: [],
    ritual_experience_level: 'beginner',
    preferred_price_range: { min: 1000, max: 10000 }, // in cents
    notification_preferences: {
      new_products: true,
      sabbat_reminders: true,
      moon_phase_alerts: true,
      personalized_recommendations: true
    }
  });

  // Check for welcome parameter and authentication
  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setShowWelcome(true);
    }
    
    if (!isLoading && !isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  // Load customer data when available (but not during save operations)
  useEffect(() => {
    if (customer && !isSavingRef.current) {
      setProfileData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        birth_date: customer.birth_date || '',
        birth_time: customer.birth_time || '',
        birth_location: customer.birth_location || '',
        phone: customer.phone || ''
      });
      
      if (customer.ritual_preferences) {
        setRitualPrefs({
          ...ritualPrefs,
          ...customer.ritual_preferences
        });
      }
    }
  }, [customer]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    isSavingRef.current = true;
    setSaveMessage('');

    const success = await updateProfile(profileData);
    
    if (success) {
      setSaveMessage('Profile updated successfully! ✨');
    } else {
      setSaveMessage('Failed to update profile. Please try again.');
    }
    
    setIsSaving(false);
    isSavingRef.current = false;
    // Clear message after 5 seconds
    setTimeout(() => {
      setSaveMessage('');
    }, 5000);
  };

  const handleRitualPrefsSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    const success = await updateProfile({ ritual_preferences: ritualPrefs });
    
    if (success) {
      setSaveMessage('Preferences saved successfully! 🌙');
    } else {
      setSaveMessage('Failed to save preferences. Please try again.');
    }
    
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-plum-600 border-t-transparent mb-4"></div>
          <p className="text-mist-200">Loading your sacred profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 p-6 bg-gradient-to-r from-plum-900/50 to-rose-900/50 rounded-3xl border border-plum-600/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-serif text-2xl text-mist-100 mb-2">Welcome to Your Sacred Journey!</h2>
              <p className="text-mist-300 mb-4">
                Your mystical account has been created. Take a moment to set your ritual preferences 
                and let us provide you with personalized recommendations.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-plum-400 hover:text-plum-300 transition-colors"
              >
                Continue to Profile
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl text-mist-100 mb-2">
                Sacred Profile
              </h1>
              <p className="text-mist-300">
                Welcome back, {customer?.first_name || 'Sacred Soul'} ✨
              </p>
            </div>
            <button
              onClick={logout}
              className="text-mist-400 hover:text-mist-200 transition-colors px-4 py-2 rounded-lg hover:bg-midnight-700/50"
            >
              Sign Out
            </button>
          </div>
        </div>


        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-midnight-800/50 rounded-2xl p-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-plum-600 text-white'
                  : 'text-mist-300 hover:text-mist-100 hover:bg-midnight-700/50'
              }`}
            >
              👤 Personal Info
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'preferences'
                  ? 'bg-plum-600 text-white'
                  : 'text-mist-300 hover:text-mist-100 hover:bg-midnight-700/50'
              }`}
            >
              🌙 Ritual Preferences
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'bg-plum-600 text-white'
                  : 'text-mist-300 hover:text-mist-100 hover:bg-midnight-700/50'
              }`}
            >
              📦 Order History
            </button>
          </div>
        </div>

        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          
          {/* Personal Info Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customer?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-midnight-700/50 text-mist-400 border border-plum-800/50 rounded-lg cursor-not-allowed"
                />
                <p className="text-xs text-mist-500 mt-1">Email cannot be changed. Contact support if needed.</p>
              </div>

              <div className="border-t border-plum-800/30 pt-6">
                <h3 className="text-lg font-medium text-mist-100 mb-4">🌟 Astrological Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-2">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={profileData.birth_date}
                      onChange={(e) => setProfileData(prev => ({ ...prev, birth_date: e.target.value }))}
                      className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mist-200 mb-2">
                      Birth Time
                    </label>
                    <input
                      type="time"
                      value={profileData.birth_time}
                      onChange={(e) => setProfileData(prev => ({ ...prev, birth_time: e.target.value }))}
                      className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Birth Location
                  </label>
                  <input
                    type="text"
                    value={profileData.birth_location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birth_location: e.target.value }))}
                    placeholder="City, State/Country"
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  />
                </div>
              </div>

              {/* Save Message */}
              {saveMessage && (
                <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 border border-emerald-500/50 text-center shadow-lg animate-fade-in">
                  <p className="text-white font-medium text-lg">{saveMessage}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="bg-plum-600 hover:bg-plum-500 disabled:bg-plum-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Ritual Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl text-mist-100 mb-2">Ritual Preferences</h2>
                <p className="text-mist-300 mb-6">
                  Customize your mystical journey. These preferences help us provide personalized recommendations.
                </p>
              </div>

              {/* Elements */}
              <div>
                <h3 className="text-lg font-medium text-mist-100 mb-4">🌍 Preferred Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {elements.map((element) => (
                    <button
                      key={element.value}
                      onClick={() => setRitualPrefs(prev => ({
                        ...prev,
                        preferred_elements: toggleArrayValue(prev.preferred_elements || [], element.value)
                      }))}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        ritualPrefs.preferred_elements?.includes(element.value)
                          ? 'bg-forest-700/50 border-2 border-sage-500 text-sage-100'
                          : 'bg-midnight-700/50 border-2 border-plum-800/30 text-mist-300 hover:border-plum-600/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{element.emoji}</div>
                      <div className="font-medium text-lg">{element.label}</div>
                      <div className="text-sm opacity-80">{element.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h3 className="text-lg font-medium text-mist-100 mb-4">🔮 Experience Level</h3>
                <div className="flex gap-4">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setRitualPrefs(prev => ({ ...prev, ritual_experience_level: level }))}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${
                        ritualPrefs.ritual_experience_level === level
                          ? 'bg-plum-600 text-white'
                          : 'bg-midnight-700/50 text-mist-300 hover:bg-plum-700/30'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intentions */}
              <div>
                <h3 className="text-lg font-medium text-mist-100 mb-4">💫 Favorite Intentions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {commonIntentions.map((intention) => (
                    <button
                      key={intention}
                      onClick={() => setRitualPrefs(prev => ({
                        ...prev,
                        favorite_intentions: toggleArrayValue(prev.favorite_intentions || [], intention)
                      }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        ritualPrefs.favorite_intentions?.includes(intention)
                          ? 'bg-rose-700 text-rose-100'
                          : 'bg-midnight-700/50 text-mist-300 hover:bg-rose-800/30'
                      }`}
                    >
                      {intention}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-medium text-mist-100 mb-4">💰 Preferred Price Range</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-mist-200 mb-2">Minimum Price</label>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      step="500"
                      value={ritualPrefs.preferred_price_range?.min || 1000}
                      onChange={(e) => setRitualPrefs(prev => ({
                        ...prev,
                        preferred_price_range: {
                          ...prev.preferred_price_range!,
                          min: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full mb-2"
                    />
                    <div className="text-plum-300 font-medium">
                      ${((ritualPrefs.preferred_price_range?.min || 1000) / 100).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-mist-200 mb-2">Maximum Price</label>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="1000"
                      value={ritualPrefs.preferred_price_range?.max || 10000}
                      onChange={(e) => setRitualPrefs(prev => ({
                        ...prev,
                        preferred_price_range: {
                          ...prev.preferred_price_range!,
                          max: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full mb-2"
                    />
                    <div className="text-plum-300 font-medium">
                      ${((ritualPrefs.preferred_price_range?.max || 10000) / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRitualPrefsSave}
                  disabled={isSaving}
                  className="bg-plum-600 hover:bg-plum-500 disabled:bg-plum-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Order History</h2>
              
              {/* Order Statistics */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-midnight-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-plum-300">{stats.totalOrders}</div>
                    <div className="text-mist-300 text-sm">Total Orders</div>
                  </div>
                  <div className="bg-midnight-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-300">{stats.pendingOrders}</div>
                    <div className="text-mist-300 text-sm">Pending</div>
                  </div>
                  <div className="bg-midnight-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-300">{stats.completedOrders}</div>
                    <div className="text-mist-300 text-sm">Completed</div>
                  </div>
                  <div className="bg-midnight-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-sage-300">${(stats.totalSpent / 100).toFixed(2)}</div>
                    <div className="text-mist-300 text-sm">Total Spent</div>
                  </div>
                </div>
              )}
              
              {ordersLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-plum-600 border-t-transparent mb-4"></div>
                  <p className="text-mist-200">Loading your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="font-serif text-xl text-mist-100 mb-2">Error Loading Orders</h3>
                  <p className="text-mist-300">{ordersError}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="font-serif text-xl text-mist-100 mb-2">No Orders Yet</h3>
                  <p className="text-mist-300 mb-6">
                    Your mystical journey awaits! Browse our sacred collection and make your first purchase.
                  </p>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-plum-600 hover:bg-plum-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <>
                  {/* Orders List */}
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-midnight-700/30 rounded-xl p-6 border border-plum-800/30">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-mist-100 mb-1">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <p className="text-mist-400 text-sm">
                              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-3 lg:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30' :
                              order.status === 'SHIPPED' ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30' :
                              order.status === 'PROCESSING' ? 'bg-amber-600/20 text-amber-300 border border-amber-600/30' :
                              order.status === 'CONFIRMED' ? 'bg-plum-600/20 text-plum-300 border border-plum-600/30' :
                              'bg-mist-600/20 text-mist-300 border border-mist-600/30'
                            }`}>
                              {order.status}
                            </span>
                            <div className="text-mist-100 font-bold">
                              ${(order.total_amount / 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              {item.product_image && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.product_image} 
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="text-mist-100 font-medium">{item.product_name}</h4>
                                {item.variation_name && (
                                  <p className="text-mist-400 text-sm">{item.variation_name}</p>
                                )}
                                <p className="text-mist-400 text-sm">
                                  Quantity: {item.quantity} × ${(item.unit_price / 100).toFixed(2)}
                                </p>
                              </div>
                              <div className="text-mist-200 font-medium">
                                ${(item.total_price / 100).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Order Actions */}
                        <div className="mt-4 pt-4 border-t border-plum-800/30 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                          <div className="text-mist-400 text-sm">
                            Fulfillment: <span className="text-mist-200 capitalize">{order.fulfillment_status.toLowerCase()}</span>
                          </div>
                          <div className="flex space-x-3">
                            {order.square_receipt_url && (
                              <a
                                href={order.square_receipt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-plum-400 hover:text-plum-300 text-sm transition-colors"
                              >
                                View Receipt
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                      <button
                        onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-midnight-700/50 text-mist-300 hover:bg-plum-700/30 hover:text-mist-100"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.totalPages, pagination.page - 2 + i));
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-plum-600 text-white'
                                : 'bg-midnight-700/50 text-mist-300 hover:bg-plum-700/30 hover:text-mist-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-midnight-700/50 text-mist-300 hover:bg-plum-700/30 hover:text-mist-100"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}