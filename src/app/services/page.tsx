'use client';

import React, { useState } from 'react';
import { FiveFoldSymbol, BowenKnot, QuaternaryCelticKnot, MotherhoodKnot } from '@/components/CelticSymbols';
import ConsultationWizard from '@/components/ConsultationWizard';

export default function ServicesPage() {
  const [showWizard, setShowWizard] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-mist-100 mb-6">
            Sacred Services & Blessed Moments
          </h1>
          <div className="w-24 h-1 bg-plum-600 mx-auto mb-8"></div>
          <p className="text-xl text-mist-100 leading-relaxed max-w-4xl mx-auto">
            From intimate ceremonies to grand celebrations, I weave earth's magic into every 
            creation, honoring your sacred moments with botanical artistry infused with intention and love.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-3 sm:px-4 lg:px-6 light-bg bg-gradient-to-b from-mist-100 to-rose-100">
        <div className="max-w-6xl mx-auto">
          
          {/* Events Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-plum-200/40 to-midnight-200/40 rounded-3xl p-4 sm:p-8 lg:p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <div className="text-6xl mb-6">⭐◊⚜</div>
                <h2 className="font-serif text-4xl text-plum-800 mb-6">
                  Enchanting Event Florals
                </h2>
                <div className="w-16 h-1 bg-plum-600 mx-auto mb-6"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                    Do you seek a devoted botanical guardian for your upcoming sacred gathering? 
                    When you choose LaynieFae to weave floral magic for your celebration, you are 
                    embracing quality, reverence, and deeply personalized attention to your vision.
                  </p>
                  <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                    Each arrangement begins with intention, honoring the unique energy of your event 
                    and the seasonal wisdom of nature's offerings. From handfasting ceremonies to 
                    seasonal celebrations, every bloom is chosen with purpose and placed with care.
                  </p>
                  <div className="bg-plum-100/60 rounded-2xl p-6">
                    <h3 className="font-serif text-xl text-plum-800 mb-3 flex items-center">
                      <span className="text-lg mr-2">🔮</span>
                      Begin Your Journey
                    </h3>
                    <p className="text-midnight-700">
                      To ensure I can manifest arrangements that perfectly capture your vision, 
                      the first step is sharing your dreams through our consultation portal below.
                    </p>
                  </div>
                </div>
                
                <div className="bg-midnight-800/10 rounded-3xl p-8">
                  <h3 className="font-serif text-2xl text-plum-800 mb-4 text-center">
                    Sacred Event Offerings
                  </h3>
                  <ul className="space-y-3 text-midnight-700">
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-plum-600 mr-3 flex-shrink-0" />
                      Handfasting & Wedding Ceremonies
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-plum-600 mr-3 flex-shrink-0" />
                      Seasonal Celebrations & Sabbats
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-plum-600 mr-3 flex-shrink-0" />
                      Anointed Altar Arrangements
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-plum-600 mr-3 flex-shrink-0" />
                      Ritual & Ceremony Florals
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-plum-600 mr-3 flex-shrink-0" />
                      Blessing & Dedication Ceremonies
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Holiday Bouquets Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-forest-200/40 to-rose-200/40 rounded-3xl p-4 sm:p-8 lg:p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <div className="text-6xl mb-6">☀🌙🍃</div>
                <h2 className="font-serif text-4xl text-plum-800 mb-6">
                  Seasonal Bewitched Bouquets
                </h2>
                <div className="w-16 h-1 bg-forest-600 mx-auto mb-6"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-forest-100/60 rounded-3xl p-8">
                  <h3 className="font-serif text-2xl text-plum-800 mb-4 text-center">
                    Wheel of the Year Blessings
                  </h3>
                  <ul className="space-y-3 text-midnight-700">
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-forest-600 mr-3 flex-shrink-0" />
                      Spring Equinox & Beltane Blooms
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-forest-600 mr-3 flex-shrink-0" />
                      Summer Solstice Celebrations
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-forest-600 mr-3 flex-shrink-0" />
                      Autumn Harvest & Samhain
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-forest-600 mr-3 flex-shrink-0" />
                      Winter Solstice & Yule Magic
                    </li>
                    <li className="flex items-center">
                      <FiveFoldSymbol className="w-5 h-5 text-forest-600 mr-3 flex-shrink-0" />
                      Anniversary & Love Celebrations
                    </li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                    With LaynieFae, you can request a beautiful, soul-stirring bouquet blessed 
                    for your anniversary or seasonal celebration, crafted with the sacred energies 
                    of each turning of the wheel. Each creation honors the divine timing of 
                    nature's cycles and your heart's intention.
                  </p>
                  <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                    These mystical arrangements can be blessed and collected in the enchanted 
                    high desert town of Seligman, Arizona each weekend, where the veil between 
                    worlds grows thin and magic flows freely.
                  </p>
                  <div className="bg-rose-100/60 rounded-2xl p-6">
                    <h3 className="font-serif text-xl text-plum-800 mb-3 flex items-center">
                      <span className="text-lg mr-2">🌙</span>
                      Divine Consultation
                    </h3>
                    <p className="text-midnight-700">
                      Fill out the blessed consultation form below to receive a personalized 
                      proposal infused with seasonal magic and your unique intentions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crowns & Wreaths Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-rose-200/40 to-plum-200/40 rounded-3xl p-4 sm:p-8 lg:p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <div className="text-6xl mb-6">♀☘⚜</div>
                <h2 className="font-serif text-4xl text-plum-800 mb-6">
                  Mystical Crowns, Bewitched Wreaths & Divine Adornments
                </h2>
                <div className="w-16 h-1 bg-rose-600 mx-auto mb-6"></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-rose-100/60 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <BowenKnot className="w-8 h-8 text-plum-700" />
                  </div>
                  <h3 className="font-serif text-xl text-plum-800 mb-3">Enchanted Crowns</h3>
                  <p className="text-midnight-700 text-sm">
                    Channel your inner goddess with floral crowns blessed for ritual, 
                    ceremony, or celebrating your divine feminine energy.
                  </p>
                </div>
                
                <div className="bg-plum-100/60 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <QuaternaryCelticKnot className="w-8 h-8 text-plum-700" />
                  </div>
                  <h3 className="font-serif text-xl text-plum-800 mb-3">Seasonal Wreaths</h3>
                  <p className="text-midnight-700 text-sm">
                    Welcome each season's magic with wreaths that honor the turning 
                    wheel and invite blessings into your sacred space.
                  </p>
                </div>
                
                <div className="bg-midnight-100/60 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <MotherhoodKnot className="w-8 h-8 text-plum-700" />
                  </div>
                  <h3 className="font-serif text-xl text-plum-800 mb-3">Hair Mystiques</h3>
                  <p className="text-midnight-700 text-sm">
                    Adorn yourself with enchanted hair accessories and hat wreaths 
                    that whisper of ancient woodland magic and natural beauty.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                  Beyond charmed arrangements for celebrations and seasonal blessings, I craft 
                  mystical floral crowns, seasonal wreaths, enchanted hair accessories, blessed 
                  hat adornments, and so much more. Each piece carries the magic of intention 
                  and the beauty of nature's infinite creativity.
                </p>
                <p className="text-lg text-midnight-700 leading-relaxed mb-8">
                  You can discover my own spirit-guided creations in the divine boutique, 
                  but if the ancestors whisper of a specific vision calling to your soul, 
                  please share your magical inspiration through the form below. Together, 
                  we'll manifest your botanical dreams into a fae-touched reality.
                </p>
                
                <div className="bg-gradient-to-r from-plum-100/60 to-rose-100/60 rounded-2xl p-8 max-w-2xl mx-auto">
                  <h3 className="font-serif text-2xl text-plum-800 mb-4 flex items-center justify-center">
                    <span className="text-xl mr-3">🔮</span>
                    Ready to Begin Your Magical Journey?
                  </h3>
                  <p className="text-midnight-700 mb-6">
                    Whether you seek mystical event florals, seasonal blessings, or intention infused adornments, 
                    every creation begins with understanding your unique vision and intention.
                  </p>
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="bg-plum-700 hover:bg-plum-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Begin Divine Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-midnight-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-6">🌙 ✨ 🌿</div>
          <h2 className="font-serif text-4xl text-mist-100 mb-6">
            Let's Weave Magic Together
          </h2>
          <p className="text-xl text-mist-200 mb-8 leading-relaxed">
            Every bloom tells a story, every arrangement holds intention. 
            Share your vision and let's create something truly enchanted.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowWizard(true)}
              className="bg-plum-700 hover:bg-plum-600 text-white px-10 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
            >
              Schedule Consultation
            </button>
            <button className="border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white px-10 py-4 rounded-full font-medium transition-all duration-300 text-lg">
              View Gallery
            </button>
          </div>
          <p className="font-script text-2xl text-plum-400 mt-8">
            Blessed be, and so it is. 🌸
          </p>
        </div>
      </section>

      {/* Consultation Wizard */}
      {showWizard && (
        <ConsultationWizard onClose={() => setShowWizard(false)} />
      )}

    </div>
  );
}