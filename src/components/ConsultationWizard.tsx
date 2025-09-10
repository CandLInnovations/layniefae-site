'use client';

import React, { useState } from 'react';
import { FiveFoldSymbol, BowenKnot, QuaternaryCelticKnot, MotherhoodKnot } from '@/components/CelticSymbols';

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  budget: string;
  colorPreferences: string[];
  customColors: string;
  floralStyle: string;
  customStyle: string;
  specialRequests: string;
  inspiration: string;
  inspirationImages: File[];
}

const ConsultationWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
    budget: '',
    colorPreferences: [],
    customColors: '',
    floralStyle: '',
    customStyle: '',
    specialRequests: '',
    inspiration: '',
    inspirationImages: []
  });


  const updateFormData = (field: keyof FormData, value: any) => {
    console.log('Updating form data:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Determine if current service type needs event details (date/guests)
  const needsEventDetails = () => {
    return ['event'].includes(formData.serviceType); // Only Sacred Events need dates/guests
  };

  // Get dynamic total steps based on selections (all services get same steps now)
  const getDynamicTotalSteps = () => {
    if (!formData.serviceType) return 6;
    return 6; // All services get 6 steps now - everyone gets the final panel with images
  };

  const nextStep = () => {
    const dynamicTotal = getDynamicTotalSteps();
    let nextStepNumber = currentStep + 1;
    
    // Skip step 3 (event details) for non-event services, but renumber subsequent steps
    if (currentStep === 2 && !needsEventDetails()) {
      nextStepNumber = 4; // Skip to step 4 (budget/style)
    }
    
    if (nextStepNumber <= dynamicTotal) {
      setCurrentStep(nextStepNumber);
    }
  };

  const prevStep = () => {
    let prevStepNumber = currentStep - 1;
    
    // Skip event details step for non-event services when going back
    if (currentStep === 4 && !needsEventDetails()) {
      prevStepNumber = 2; // Skip back to service selection
    }
    
    if (prevStepNumber >= 1) {
      setCurrentStep(prevStepNumber);
    }
  };

  const handleSubmit = async () => {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowSuccess(true);
  };

  const toggleColorPreference = (color: string) => {
    const currentColors = formData.colorPreferences;
    if (currentColors.includes(color)) {
      updateFormData('colorPreferences', currentColors.filter(c => c !== color));
    } else {
      updateFormData('colorPreferences', [...currentColors, color]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateFormData('inspirationImages', [...formData.inspirationImages, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.inspirationImages.filter((_, i) => i !== index);
    updateFormData('inspirationImages', newImages);
  };

  return (
    <div 
      className="fixed inset-0 bg-midnight-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gradient-to-b from-mist-100 to-rose-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-plum-700 to-midnight-700 rounded-t-3xl p-6 text-white relative overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-10"
          >
            ✕
          </button>
          
          {/* Mystical background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-8 w-6 h-6 bg-plum-400/40 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute bottom-6 right-16 w-4 h-4 bg-rose-300/50 rounded-full blur-sm animate-pulse delay-500"></div>
            <div className="absolute top-8 right-1/3 w-5 h-5 bg-mist-300/30 rounded-full blur-sm animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative">
            <h2 className="font-serif text-3xl mb-2 text-center">Sacred Consultation Journey</h2>
            <p className="text-mist-200 text-center mb-4">Let us weave magic together, step by step</p>
            
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: getDynamicTotalSteps() }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep ? 'bg-rose-300' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          
          {/* Step 1: Welcome & Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🌙</div>
                <h3 className="font-serif text-3xl text-plum-800 mb-4">Welcome, Kindred Spirit</h3>
                <p className="text-midnight-700 leading-relaxed">
                  The moon has guided you here tonight. Let us begin this sacred journey by learning your name 
                  and how the universe may reach you with blessings.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-serif text-plum-800 mb-2">What shall we call you? *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      console.log('Name input changed:', e.target.value);
                      updateFormData('name', e.target.value);
                    }}
                    className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white backdrop-blur-sm text-midnight-800"
                    placeholder="Your sacred name..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-serif text-plum-800 mb-2">Sacred email for our correspondence *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white backdrop-blur-sm text-midnight-800"
                    placeholder="your.email@realm.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-serif text-plum-800 mb-2">Phone number (if the spirits call)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white backdrop-blur-sm text-midnight-800"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Type */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="font-serif text-3xl text-plum-800 mb-4">What Magic Calls to You?</h3>
                <p className="text-midnight-700 leading-relaxed">
                  The path splits into sacred directions. Which enchanted service speaks to your soul?
                </p>
              </div>
              
              <div className="grid gap-4">
                {[
                  { value: 'event', label: 'Sacred Event Florals', icon: '⚜', desc: 'Handfasting, ceremonies, sacred celebrations' },
                  { value: 'bouquet', label: 'Seasonal Sacred Bouquets', icon: '☀', desc: 'Holiday blessings, anniversary magic' },
                  { value: 'crown', label: 'Mystical Crowns', icon: '♀', desc: 'Divine feminine ritual crowns' },
                  { value: 'wreath', label: 'Sacred Wreaths', icon: '⚛', desc: 'Seasonal doorway blessings' },
                  { value: 'accessories', label: 'Hair Mystiques', icon: '☘', desc: 'Enchanted hair accessories' },
                  { value: 'custom', label: 'Custom Vision', icon: '🔮', desc: 'Something unique calls to me' }
                ].map((service) => (
                  <button
                    key={service.value}
                    onClick={() => updateFormData('serviceType', service.value)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                      formData.serviceType === service.value
                        ? 'border-plum-500 bg-plum-100 shadow-lg transform scale-105'
                        : 'border-plum-200 bg-white/60 hover:border-plum-300 hover:bg-plum-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-4 text-plum-700">{service.icon}</span>
                      <div>
                        <h4 className="font-serif text-xl text-plum-800">{service.label}</h4>
                        <p className="text-midnight-700 text-sm">{service.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Event Details OR Service Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {needsEventDetails() ? (
                // Event Details for Sacred Events
                <>
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🌿</div>
                    <h3 className="font-serif text-3xl text-plum-800 mb-4">When Will Magic Unfold?</h3>
                    <p className="text-midnight-700 leading-relaxed">
                      The cosmos align differently for each sacred moment. Tell us about your blessed occasion.
                    </p>
                  </div>
                </>
              ) : (
                // Service Details for Non-Events  
                <>
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="font-serif text-3xl text-plum-800 mb-4">Share Your Sacred Vision</h3>
                    <p className="text-midnight-700 leading-relaxed">
                      Every creation is unique. Tell us more about what calls to your heart and soul.
                    </p>
                  </div>
                </>
              )}
              
              <div className="space-y-4">
                {needsEventDetails() ? (
                  // Event-specific fields
                  <>
                    <div>
                      <label className="block font-serif text-plum-800 mb-2">Sacred date of your ceremony</label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => updateFormData('eventDate', e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white/80 backdrop-blur-sm text-midnight-800"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-serif text-plum-800 mb-2">Type of sacred gathering</label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => updateFormData('eventType', e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white/80 backdrop-blur-sm text-midnight-800"
                      >
                        <option value="">Choose your ceremony...</option>
                        <option value="handfasting">Handfasting Ceremony</option>
                        <option value="wedding">Traditional Wedding</option>
                        <option value="sabbat">Sabbat Celebration</option>
                        <option value="birthday">Birthday Blessing</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="memorial">Memorial Service</option>
                        <option value="blessing">House/Baby Blessing</option>
                        <option value="other">Other Sacred Gathering</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-serif text-plum-800 mb-2">How many souls will gather?</label>
                      <select
                        value={formData.guestCount}
                        onChange={(e) => updateFormData('guestCount', e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white/80 backdrop-blur-sm text-midnight-800"
                      >
                        <option value="">Select gathering size...</option>
                        <option value="intimate">Intimate (2-10 souls)</option>
                        <option value="small">Small Gathering (11-30 souls)</option>
                        <option value="medium">Medium Circle (31-75 souls)</option>
                        <option value="large">Large Celebration (76+ souls)</option>
                        <option value="personal">Just for me</option>
                      </select>
                    </div>
                  </>
                ) : (
                  // Service-specific detailed description
                  <div>
                    <label className="block font-serif text-plum-800 mb-2">
                      Describe your vision in detail *
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => updateFormData('specialRequests', e.target.value)}
                      rows={6}
                      className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white/80 backdrop-blur-sm resize-none text-midnight-800"
                      placeholder={
                        formData.serviceType === 'bouquet' ? 
                          "What occasion is this for? What size bouquet? Any specific flowers you love or want to avoid? Any special meaning or symbolism you'd like included?" :
                        formData.serviceType === 'crown' ? 
                          "What's the occasion for your crown? Head size? Preferred flower types? Colors that make your soul sing? Will you be indoors or outdoors?" :
                        formData.serviceType === 'wreath' ? 
                          "Where will this wreath be displayed? What size are you envisioning? Seasonal theme? Any specific flowers, herbs, or elements that call to you?" :
                        formData.serviceType === 'accessories' ? 
                          "What type of hair accessory? (clips, combs, pins, headbands?) Hair color and length? Occasion? Any flowers or colors you're drawn to?" :
                        formData.serviceType === 'custom' ?
                          "Share your creative vision! What unique floral creation are you dreaming of? Is it wearable, decorative, ceremonial? Any size requirements or special considerations?" :
                          "Tell me about your vision - what are you hoping to create together?"
                      }
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Budget & Style */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="font-serif text-3xl text-plum-800 mb-4">Sacred Investment & Style</h3>
                <p className="text-midnight-700 leading-relaxed">
                  Every magical creation requires earthly resources. What feels aligned with your vision?
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-serif text-plum-800 mb-4">Sacred investment range</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'under-200', label: 'Under $200', desc: 'Small magical touches' },
                      { value: '200-500', label: '$200 - $500', desc: 'Meaningful arrangements' },
                      { value: '500-1000', label: '$500 - $1,000', desc: 'Abundant botanicals' },
                      { value: 'over-1000', label: 'Over $1,000', desc: 'Full magical transformation' }
                    ].map((budget) => (
                      <button
                        key={budget.value}
                        onClick={() => updateFormData('budget', budget.value)}
                        className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                          formData.budget === budget.value
                            ? 'border-plum-500 bg-plum-100'
                            : 'border-plum-200 bg-white/60 hover:border-plum-300'
                        }`}
                      >
                        <div className="font-serif text-lg text-plum-800">{budget.label}</div>
                        <div className="text-sm text-midnight-600">{budget.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block font-serif text-plum-800 mb-4">Mystical style that calls to you</label>
                  <div className="grid gap-3">
                    {[
                      { value: 'wild', label: '🌿 Wild & Natural', desc: 'Untamed beauty, foraged elements' },
                      { value: 'elegant', label: '🌸 Elegant & Refined', desc: 'Classic beauty, sophisticated charm' },
                      { value: 'boho', label: '🍄 Bohemian & Free', desc: 'Eclectic, artistic, unconventional' },
                      { value: 'seasonal', label: '🍂 Seasonal & Traditional', desc: 'Honor the wheel of the year' },
                      { value: 'gothic', label: '🖤 Dark & Mystical', desc: 'Deep colors, dramatic elements' },
                      { value: 'other', label: '✨ Other Style', desc: 'Something unique calls to me' }
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => updateFormData('floralStyle', style.value)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                          formData.floralStyle === style.value
                            ? 'border-plum-500 bg-plum-100'
                            : 'border-plum-200 bg-white/60 hover:border-plum-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            <div className="font-serif text-lg text-plum-800">{style.label}</div>
                            <div className="text-sm text-midnight-600">{style.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Style Input */}
                  {formData.floralStyle === 'other' && (
                    <div className="mt-4">
                      <label className="block font-serif text-plum-800 mb-2">Describe your unique style vision</label>
                      <input
                        type="text"
                        value={formData.customStyle}
                        onChange={(e) => updateFormData('customStyle', e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white backdrop-blur-sm text-midnight-800"
                        placeholder="minimalist modern, vintage romantic, fairy tale whimsical..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Color & Preferences */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🌈</div>
                <h3 className="font-serif text-3xl text-plum-800 mb-4">Colors of Your Soul</h3>
                <p className="text-midnight-700 leading-relaxed">
                  Colors carry energy and intention. Which hues make your spirit sing? Choose all that resonate.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-serif text-plum-800 mb-4">Sacred color palette (select all that call to you)</label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { color: 'white', name: 'Pure White', hex: '#FFFFFF' },
                      { color: 'cream', name: 'Cream', hex: '#F5F5DC' },
                      { color: 'blush', name: 'Soft Blush', hex: '#FFE4E1' },
                      { color: 'peach', name: 'Peach', hex: '#FFCBA4' },
                      { color: 'coral', name: 'Coral', hex: '#FF7F7F' },
                      { color: 'rose', name: 'Rose', hex: '#FF69B4' },
                      
                      { color: 'lavender', name: 'Lavender', hex: '#E6E6FA' },
                      { color: 'lilac', name: 'Lilac', hex: '#C8A2C8' },
                      { color: 'plum', name: 'Deep Plum', hex: '#8B008B' },
                      { color: 'purple', name: 'Royal Purple', hex: '#6A0DAD' },
                      { color: 'violet', name: 'Violet', hex: '#8A2BE2' },
                      { color: 'magenta', name: 'Magenta', hex: '#FF00FF' },
                      
                      { color: 'sage', name: 'Sacred Sage', hex: '#9CAF88' },
                      { color: 'mint', name: 'Mint', hex: '#98FB98' },
                      { color: 'eucalyptus', name: 'Eucalyptus', hex: '#44C767' },
                      { color: 'forest', name: 'Forest Green', hex: '#228B22' },
                      { color: 'emerald', name: 'Emerald', hex: '#50C878' },
                      { color: 'teal', name: 'Teal', hex: '#008080' },
                      
                      { color: 'gold', name: 'Golden Sun', hex: '#FFD700' },
                      { color: 'amber', name: 'Amber', hex: '#FFBF00' },
                      { color: 'copper', name: 'Copper', hex: '#B87333' },
                      { color: 'bronze', name: 'Bronze', hex: '#CD7F32' },
                      { color: 'rust', name: 'Rust', hex: '#B7410E' },
                      { color: 'burgundy', name: 'Burgundy', hex: '#800020' },
                      
                      { color: 'navy', name: 'Midnight Blue', hex: '#191970' },
                      { color: 'royal', name: 'Royal Blue', hex: '#4169E1' },
                      { color: 'sky', name: 'Sky Blue', hex: '#87CEEB' },
                      { color: 'dusty', name: 'Dusty Blue', hex: '#6B8CAE' },
                      { color: 'steel', name: 'Steel Blue', hex: '#4682B4' },
                      { color: 'slate', name: 'Slate', hex: '#708090' }
                    ].map((colorOption) => (
                      <button
                        key={colorOption.color}
                        onClick={() => toggleColorPreference(colorOption.color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 relative group ${
                          formData.colorPreferences.includes(colorOption.color)
                            ? 'border-plum-500 transform scale-110 ring-2 ring-plum-300'
                            : 'border-plum-200 hover:border-plum-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorOption.hex }}
                        title={colorOption.name}
                      >
                        {formData.colorPreferences.includes(colorOption.color) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm font-bold drop-shadow-lg">✓</span>
                          </div>
                        )}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-midnight-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          {colorOption.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block font-serif text-plum-800 mb-2">Custom colors (type any colors not shown above)</label>
                  <input
                    type="text"
                    value={formData.customColors}
                    onChange={(e) => updateFormData('customColors', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white backdrop-blur-sm text-midnight-800"
                    placeholder="dusty rose, champagne, ivory, charcoal..."
                  />
                  <p className="text-sm text-midnight-600 mt-1">Describe any specific colors, shades, or color combinations you envision</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Final Details */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔮</div>
                <h3 className="font-serif text-3xl text-plum-800 mb-4">Share Your Sacred Vision</h3>
                <p className="text-midnight-700 leading-relaxed">
                  The final step in our journey together. What magical details would make your heart sing?
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-serif text-plum-800 mb-2">
                    Complete your vision - any additional details, requests, or dreams? ✨
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => updateFormData('specialRequests', e.target.value)}
                    rows={5}
                    className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white/80 backdrop-blur-sm resize-none text-midnight-800"
                    placeholder="Share any final thoughts, special meaning, specific flower requests, sizing details, timeline needs, sacred elements, or anything else that would help bring your vision to life..."
                  />
                </div>
                
                <div>
                  <label className="block font-serif text-plum-800 mb-2">What inspired you to seek this magic?</label>
                  <textarea
                    value={formData.inspiration}
                    onChange={(e) => updateFormData('inspiration', e.target.value)}
                    rows={3}
                    className="w-full p-4 rounded-2xl border-2 border-plum-200 focus:border-plum-500 focus:outline-none bg-white/80 backdrop-blur-sm resize-none text-midnight-800"
                    placeholder="Pinterest boards, nature walks, dreams, a special memory... what sparked this vision?"
                  />
                </div>
                
                <div>
                  <label className="block font-serif text-plum-800 mb-4">
                    Sacred inspiration images ✨
                  </label>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-plum-300 rounded-2xl p-6 text-center bg-plum-50/50 hover:bg-plum-50 transition-colors duration-300">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer flex flex-col items-center space-y-3"
                      >
                        <div className="text-4xl text-plum-600">📸</div>
                        <div className="text-plum-800 font-medium">Upload inspiration images</div>
                        <p className="text-sm text-midnight-600">
                          Share photos of flowers, colors, styles, or anything that inspires your vision
                        </p>
                        <div className="bg-plum-700 text-white px-6 py-2 rounded-full text-sm hover:bg-plum-600 transition-colors duration-300">
                          Choose Images
                        </div>
                      </label>
                    </div>
                    
                    {/* Image Preview */}
                    {formData.inspirationImages.length > 0 && (
                      <div>
                        <h4 className="font-serif text-lg text-plum-800 mb-3">
                          Your inspiration gallery ({formData.inspirationImages.length} images)
                        </h4>
                        <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-plum-200 rounded-2xl bg-white/50">
                          {formData.inspirationImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Inspiration ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full text-xs hover:bg-rose-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              >
                                ✕
                              </button>
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-plum-100 to-rose-100 rounded-2xl p-6 text-center">
                <h4 className="font-serif text-xl text-plum-800 mb-2">Ready to Manifest Magic? 🌙</h4>
                <p className="text-midnight-700 mb-4">
                  Your sacred consultation request will be sent with love and intention. 
                  I'll reach out within 48 hours to begin our magical collaboration.
                </p>
                <p className="text-sm text-midnight-600 italic">
                  Blessed be, and so it is. ✨
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center px-6 py-3 bg-midnight-200 hover:bg-midnight-300 text-midnight-800 rounded-full font-medium transition-all duration-300"
              >
                ← Previous Step
              </button>
            )}
            
            <div className="flex-1"></div>
            
            {currentStep < getDynamicTotalSteps() ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && (!formData.name || !formData.email)}
                className="flex items-center px-8 py-3 bg-plum-700 hover:bg-plum-600 disabled:bg-plum-300 disabled:cursor-not-allowed text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue Journey →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-plum-700 to-midnight-700 hover:from-plum-600 hover:to-midnight-600 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ✨ Send Sacred Request ✨
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="absolute inset-0 bg-midnight-900/90 backdrop-blur-md flex items-center justify-center z-10">
          <div className="bg-gradient-to-b from-mist-100 to-rose-100 rounded-3xl max-w-lg w-full mx-4 shadow-2xl border-2 border-plum-300">
            
            {/* Mystical header */}
            <div className="bg-gradient-to-r from-plum-700 to-midnight-700 rounded-t-3xl p-8 text-white relative overflow-hidden">
              {/* Floating magical elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-8 w-8 h-8 bg-rose-400/40 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-6 right-12 w-6 h-6 bg-plum-400/50 rounded-full blur-sm animate-pulse delay-700"></div>
                <div className="absolute top-8 right-1/4 w-4 h-4 bg-mist-300/40 rounded-full blur-sm animate-pulse delay-300"></div>
                <div className="absolute bottom-4 left-1/3 w-5 h-5 bg-rose-300/30 rounded-full blur-sm animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative text-center">
                <div className="text-6xl mb-4">🌙✨🌸</div>
                <h2 className="font-serif text-3xl mb-2">Sacred Request Sent!</h2>
                <p className="text-mist-200">Your magical consultation has been blessed and received</p>
              </div>
            </div>

            {/* Success message content */}
            <div className="p-8 text-center">
              <div className="space-y-4 mb-8">
                <p className="text-lg text-midnight-700 leading-relaxed">
                  <span className="font-serif text-xl text-plum-800">Blessed be!</span> 
                  <br />
                  Your sacred consultation request has been woven into the universe's tapestry. 
                </p>
                
                <div className="bg-plum-100/60 rounded-2xl p-6 border border-plum-200">
                  <h3 className="font-serif text-lg text-plum-800 mb-3 flex items-center justify-center">
                    <span className="mr-2">🔮</span>
                    What happens next?
                  </h3>
                  <ul className="text-sm text-midnight-700 space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-plum-600 mr-2 mt-0.5">•</span>
                      I'll review your magical vision within 48 hours
                    </li>
                    <li className="flex items-start">
                      <span className="text-plum-600 mr-2 mt-0.5">•</span>
                      You'll receive a personalized proposal with sacred details
                    </li>
                    <li className="flex items-start">
                      <span className="text-plum-600 mr-2 mt-0.5">•</span>
                      We'll collaborate to bring your botanical dreams to life
                    </li>
                  </ul>
                </div>
                
                <p className="text-midnight-600 italic">
                  "Every bloom carries intention, every creation holds magic." 
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-plum-700 to-midnight-700 hover:from-plum-600 hover:to-midnight-600 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                ✨ Return to Sacred Garden ✨
              </button>
            </div>

            {/* Mystical bottom decoration */}
            <div className="px-8 pb-6">
              <div className="text-center">
                <div className="text-2xl text-plum-600 mb-2">🌿 ⚜ 🌿</div>
                <p className="font-script text-plum-700 text-lg">
                  May your path be filled with beauty and light
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationWizard;