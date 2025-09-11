'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GiftCardDesign, GiftCardPurchaseData } from '@/types/giftcard';
import { useCart } from '@/hooks/useCart';

export default function GiftCardsPage() {
  const [giftCardData, setGiftCardData] = useState<GiftCardPurchaseData>({
    amount: 50,
    design: GiftCardDesign.MYSTICAL_MOON,
    purchaserName: '',
    purchaserEmail: '',
    recipientName: '',
    recipientEmail: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addToCart } = useCart();
  const router = useRouter();

  const designs = [
    {
      id: GiftCardDesign.MYSTICAL_MOON,
      name: 'Mystical Moon',
      description: 'Luna\'s blessing under starlit skies',
      emoji: '🌙',
      gradient: 'from-indigo-900 via-purple-800 to-midnight-900'
    },
    {
      id: GiftCardDesign.SACRED_ROSES,
      name: 'Sacred Roses',
      description: 'Eternal love and divine beauty',
      emoji: '🌹',
      gradient: 'from-rose-900 via-pink-800 to-red-900'
    },
    {
      id: GiftCardDesign.CRYSTAL_ENERGY,
      name: 'Crystal Energy',
      description: 'Amplified intentions and clarity',
      emoji: '💎',
      gradient: 'from-cyan-900 via-teal-800 to-emerald-900'
    },
    {
      id: GiftCardDesign.ELEMENTAL_HARMONY,
      name: 'Elemental Harmony',
      description: 'Balance of earth, air, fire, and water',
      emoji: '🌀',
      gradient: 'from-green-900 via-yellow-800 to-orange-900'
    },
    {
      id: GiftCardDesign.CELESTIAL_BLESSING,
      name: 'Celestial Blessing',
      description: 'Divine guidance from the stars',
      emoji: '✨',
      gradient: 'from-violet-900 via-purple-800 to-indigo-900'
    }
  ];

  const amounts = [25, 50, 75, 100, 150, 200];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!giftCardData.purchaserName.trim()) newErrors.purchaserName = 'Your name is required';
    if (!giftCardData.purchaserEmail.trim()) newErrors.purchaserEmail = 'Your email is required';
    else if (!/\S+@\S+\.\S+/.test(giftCardData.purchaserEmail)) newErrors.purchaserEmail = 'Email is invalid';

    if (!giftCardData.recipientName?.trim()) newErrors.recipientName = 'Recipient name is required';
    if (!giftCardData.recipientEmail?.trim()) newErrors.recipientEmail = 'Recipient email is required';
    else if (!/\S+@\S+\.\S+/.test(giftCardData.recipientEmail || '')) newErrors.recipientEmail = 'Recipient email is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validateForm()) {
      return;
    }

    const selectedDesign = designs.find(d => d.id === giftCardData.design);
    
    // Add gift card as a product to cart
    addToCart(
      `giftcard_${giftCardData.design}`,
      `Sacred Gift Card - ${selectedDesign?.name}`,
      giftCardData.amount * 100, // Convert to cents
      1,
      '/images/gift-cards/mystical-gift-card.jpg',
      [
        { optionId: 'design', optionName: 'Design', value: selectedDesign?.name || '', additionalPrice: 0 },
        { optionId: 'amount', optionName: 'Amount', value: `$${giftCardData.amount}`, additionalPrice: 0 },
        { optionId: 'recipient', optionName: 'Recipient', value: giftCardData.recipientName || '', additionalPrice: 0 },
        { optionId: 'message', optionName: 'Message', value: giftCardData.message || 'No message', additionalPrice: 0 }
      ],
      giftCardData.design,
      selectedDesign?.name
    );

    // Store gift card data in localStorage for checkout process
    localStorage.setItem('giftcard-data', JSON.stringify(giftCardData));
    
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="font-serif text-4xl md:text-5xl text-mist-100 mb-4">
            Sacred Gift Cards
          </h1>
          <div className="w-24 h-1 bg-plum-600 mx-auto mb-6"></div>
          <p className="text-xl text-mist-200 leading-relaxed max-w-2xl mx-auto">
            Share the magic of sacred intentions with those you love. 
            Our gift cards carry blessings for any mystical journey.
          </p>
        </div>

        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Gift Card Preview */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Design Your Gift</h2>
              
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-mist-200 mb-3">
                  Gift Amount
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {amounts.map((amount) => (
                    <button
                      key={`amount-${amount}`}
                      type="button"
                      onClick={() => setGiftCardData(prev => ({ ...prev, amount }))}
                      className={`p-4 rounded-lg border font-medium transition-colors ${
                        giftCardData.amount === amount
                          ? 'bg-plum-700 border-plum-600 text-white'
                          : 'bg-midnight-700 border-plum-800/50 text-mist-300 hover:bg-midnight-600'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Selection */}
              <div>
                <label className="block text-sm font-medium text-mist-200 mb-3">
                  Sacred Design
                </label>
                <div className="space-y-3">
                  {designs.map((design) => (
                    <button
                      key={`design-${design.id}`}
                      type="button"
                      onClick={() => setGiftCardData(prev => ({ ...prev, design: design.id }))}
                      className={`w-full p-4 rounded-lg border text-left transition-colors ${
                        giftCardData.design === design.id
                          ? 'bg-plum-700/30 border-plum-600 text-white'
                          : 'bg-midnight-700/30 border-plum-800/50 text-mist-300 hover:bg-midnight-600/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-10 bg-gradient-to-r ${design.gradient} rounded flex items-center justify-center text-xl`}>
                          {design.emoji}
                        </div>
                        <div>
                          <div className="font-medium">{design.name}</div>
                          <div className="text-sm opacity-75">{design.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift Card Preview */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-mist-200 mb-3">Preview</h3>
                <div className={`w-full h-40 bg-gradient-to-r ${designs.find(d => d.id === giftCardData.design)?.gradient} rounded-2xl p-6 flex flex-col justify-between border border-plum-600/30`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white text-lg font-serif">Sacred Gift Card</div>
                      <div className="text-white/80 text-sm">Laynie Fae</div>
                    </div>
                    <div className="text-3xl">
                      {designs.find(d => d.id === giftCardData.design)?.emoji}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-white/60 text-xs">For: {giftCardData.recipientName || 'Recipient'}</div>
                    <div className="text-white text-2xl font-bold">${giftCardData.amount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Card Details */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Gift Details</h2>

              {/* Purchaser Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-mist-200">Your Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={giftCardData.purchaserName}
                    onChange={(e) => setGiftCardData(prev => ({ ...prev, purchaserName: e.target.value }))}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.purchaserName && <p className="text-red-400 text-xs mt-1">{errors.purchaserName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={giftCardData.purchaserEmail}
                    onChange={(e) => setGiftCardData(prev => ({ ...prev, purchaserEmail: e.target.value }))}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="your@email.com"
                  />
                  {errors.purchaserEmail && <p className="text-red-400 text-xs mt-1">{errors.purchaserEmail}</p>}
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-mist-200">Recipient Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={giftCardData.recipientName}
                    onChange={(e) => setGiftCardData(prev => ({ ...prev, recipientName: e.target.value }))}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="Recipient's full name"
                  />
                  {errors.recipientName && <p className="text-red-400 text-xs mt-1">{errors.recipientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={giftCardData.recipientEmail}
                    onChange={(e) => setGiftCardData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="recipient@email.com"
                  />
                  {errors.recipientEmail && <p className="text-red-400 text-xs mt-1">{errors.recipientEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-1">Personal Message (Optional)</label>
                  <textarea
                    value={giftCardData.message}
                    onChange={(e) => setGiftCardData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="Share your heartfelt message of love and light..."
                    maxLength={300}
                  />
                  <p className="text-xs text-mist-400 mt-1">{(giftCardData.message || '').length}/300 characters</p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-plum-700 hover:bg-plum-600 text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25 mt-8"
              >
                Add Sacred Gift Card to Cart • ${giftCardData.amount}.00
              </button>
            </div>
          </div>
        </div>

        {/* Gift Card Info */}
        <div className="mt-12 bg-midnight-900/30 rounded-2xl p-6 border border-plum-800/20">
          <h3 className="font-serif text-lg text-mist-100 mb-4">✨ Gift Card Information</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-mist-300">
            <div>
              <p className="mb-2">🎁 <strong>Instant Delivery:</strong> Gift cards are sent immediately via email</p>
              <p className="mb-2">💫 <strong>No Expiration:</strong> Sacred energy never fades</p>
            </div>
            <div>
              <p className="mb-2">🔒 <strong>Secure Codes:</strong> Each gift card has a unique mystical code</p>
              <p className="mb-2">✉️ <strong>Beautiful Design:</strong> Delivered with your chosen sacred design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}