'use client';

import React, { useState } from 'react';
import ConsultationWizard from '@/components/ConsultationWizard';

export default function HomePage() {
  const [showWizard, setShowWizard] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-mist-800 to-rose-800">

      {/* Hero Section */}
      <section className="py-16 px-4 light-bg">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl text-midnight-800 leading-tight">
                Sacred Blooms & Ceremonies
              </h2>
              <p className="text-lg text-midnight-700 leading-relaxed">
                I create enchanting pagan wedding ceremonies and stunning floral arrangements 
                that honor the ancient traditions while celebrating your unique love story. 
                Every bloom is chosen with intention, every ritual crafted with reverence.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowWizard(true)}
                  className="bg-plum-700 hover:bg-plum-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Plan Your Ceremony
                </button>
                <button className="border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
                  View Floral Designs
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-plum-200 to-forest-200 rounded-full p-8 animate-float">
                <div className="w-full h-full bg-gradient-to-br from-plum-300 to-midnight-300 rounded-full flex items-center justify-center">
                  <div className="text-center text-midnight-800">
                    <div className="text-6xl mb-4">🌿</div>
                    <p className="font-script text-2xl">Sacred Botanicals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-midnight-800/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-mist-100 mb-16">
            Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Wedding Ceremonies */}
            <div className="bg-midnight-700/60 backdrop-blur rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 text-center">🕯️</div>
              <h3 className="font-serif text-2xl text-rose-100 mb-4 text-center">
                Pagan Wedding Ceremonies
              </h3>
              <p className="text-mist-200 text-center leading-relaxed">
                Handfasting rituals, seasonal ceremonies, and sacred unions that honor 
                your spiritual path and celebrate your eternal bond.
              </p>
            </div>

            {/* Floral Arrangements */}
            <div className="bg-midnight-700/60 backdrop-blur rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 text-center">🌸</div>
              <h3 className="font-serif text-2xl text-rose-100 mb-4 text-center">
                Floral Design
              </h3>
              <p className="text-mist-200 text-center leading-relaxed">
                Ritual bouquets, altar arrangements, and ceremonial florals infused 
                with intention and magical correspondences.
              </p>
            </div>

            {/* Consultation */}
            <div className="bg-midnight-700/60 backdrop-blur rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 text-center">🔮</div>
              <h3 className="font-serif text-2xl text-rose-100 mb-4 text-center">
                Spiritual Guidance
              </h3>
              <p className="text-mist-200 text-center leading-relaxed">
                Personal consultations to design ceremonies that reflect your beliefs, 
                traditions, and the unique magic of your love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-forest-700 to-plum-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-6">
            Ready to Create Sacred Magic Together?
          </h2>
          <p className="text-xl mb-8 text-mist-200">
            Let's craft a ceremony and floral experience that honors your love 
            and celebrates the divine feminine energy of nature.
          </p>
          <button 
            onClick={() => setShowWizard(true)}
            className="bg-white text-midnight-800 hover:bg-mist-100 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-earth-700 text-earth-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-script text-3xl text-sage-200 mb-4">Laynie Fae</h3>
          <p className="mb-6">Sacred Blooms & Pagan Wedding Ceremonies</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="hover:text-sage-300 transition-colors duration-300">
              Contact
            </a>
            <a href="#" className="hover:text-sage-300 transition-colors duration-300">
              Gallery
            </a>
            <a href="#" className="hover:text-sage-300 transition-colors duration-300">
              Services
            </a>
            <a href="#" className="hover:text-sage-300 transition-colors duration-300">
              About
            </a>
          </div>
          <p className="text-earth-300 text-sm">
            © 2025 Laynie Fae. All rights reserved. • Blessed be.
          </p>
        </div>
      </footer>

      {/* Consultation Wizard */}
      {showWizard && (
        <ConsultationWizard onClose={() => setShowWizard(false)} />
      )}
    </div>
  );
}