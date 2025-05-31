import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laynie Fae - Sacred Blooms & Pagan Wedding Ceremonies',
  description: 'Beautiful pagan wedding ceremonies and sacred floral arrangements that honor nature and celebrate your unique love story.',
  keywords: 'pagan wedding, handfasting, sacred flowers, nature ceremony, spiritual wedding, botanical arrangements',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-earth-50">
      {/* Header */}
      <header className="relative py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-script text-6xl md:text-8xl text-sage-700 mb-4 animate-fade-in">
            Laynie Fae
          </h1>
          <p className="font-serif text-xl md:text-2xl text-earth-600 mb-8 animate-slide-up">
            Sacred Blooms & Pagan Wedding Ceremonies
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-sage-500 to-ritual-500 mx-auto rounded-full"></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl text-sage-700 leading-tight">
                Where Nature's Magic Meets Sacred Union
              </h2>
              <p className="text-lg text-earth-600 leading-relaxed">
                I create enchanting pagan wedding ceremonies and stunning floral arrangements 
                that honor the ancient traditions while celebrating your unique love story. 
                Every bloom is chosen with intention, every ritual crafted with reverence.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Plan Your Ceremony
                </button>
                <button className="border-2 border-sage-600 text-sage-700 hover:bg-sage-600 hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
                  View Floral Designs
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-sage-200 to-ritual-200 rounded-full p-8 animate-float">
                <div className="w-full h-full bg-gradient-to-br from-sage-300 to-earth-300 rounded-full flex items-center justify-center">
                  <div className="text-center text-sage-700">
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
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-sage-700 mb-16">
            Sacred Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Wedding Ceremonies */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 text-center">🕯️</div>
              <h3 className="font-serif text-2xl text-sage-700 mb-4 text-center">
                Pagan Wedding Ceremonies
              </h3>
              <p className="text-earth-600 text-center leading-relaxed">
                Handfasting rituals, seasonal ceremonies, and sacred unions that honor 
                your spiritual path and celebrate your eternal bond.
              </p>
            </div>

            {/* Floral Arrangements */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 text-center">🌸</div>
              <h3 className="font-serif text-2xl text-sage-700 mb-4 text-center">
                Sacred Floral Design
              </h3>
              <p className="text-earth-600 text-center leading-relaxed">
                Ritual bouquets, altar arrangements, and ceremonial florals infused 
                with intention and magical correspondences.
              </p>
            </div>

            {/* Consultation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4 text-center">🔮</div>
              <h3 className="font-serif text-2xl text-sage-700 mb-4 text-center">
                Spiritual Guidance
              </h3>
              <p className="text-earth-600 text-center leading-relaxed">
                Personal consultations to design ceremonies that reflect your beliefs, 
                traditions, and the unique magic of your love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-sage-600 to-ritual-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-6">
            Ready to Create Sacred Magic Together?
          </h2>
          <p className="text-xl mb-8 text-sage-100">
            Let's craft a ceremony and floral experience that honors your love 
            and celebrates the divine feminine energy of nature.
          </p>
          <button className="bg-white text-sage-700 hover:bg-sage-50 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
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
    </div>
  );
}