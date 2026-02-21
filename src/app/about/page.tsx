'use client';

import React, { useState } from 'react';
import ConsultationWizard from '@/components/ConsultationWizard';

export default function AboutPage() {
  const [showWizard, setShowWizard] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-mist-100 mb-6">
            Blessed to Meet You
          </h1>
          <div className="w-24 h-1 bg-plum-600 mx-auto mb-8"></div>
          <p className="text-xl text-mist-100 leading-relaxed">
            I'm Laynie, a devoted keeper of botanical wisdom and attuned ceremonies, 
            weaving magic through flowers and ritual in the mystical landscapes of Northern Arizona.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 light-bg bg-gradient-to-b from-mist-100 to-rose-100">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <div className="mb-16">
            <p className="text-lg text-midnight-700 leading-relaxed mb-6">
              Hello, kindred spirit! I'm Laynie, a passionate floral artist and spirited ceremony guide 
              rooted in the enchanted high desert of Northern Arizona. Since the universe called me 
              to this path in 2018, I've been crafting botanical spells that honor the earth's wisdom 
              and celebrate life's most sacred moments. What began as a mystical winter's night 
              revelation has blossomed into my soul's true calling, and I'm blessed to share this 
              magical journey with you.
            </p>
          </div>

          {/* How It All Began */}
          <div className="mb-16">
            <h2 className="font-serif text-4xl text-plum-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">🌙</span>
              How the Magic Awakened
            </h2>
            <div className="bg-midnight-800/10 rounded-3xl p-8 backdrop-blur-sm">
              <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                The craft wasn't always my calling—the ancestors had to whisper a little louder first. 
                During a snow-blessed Friday evening in late 2018, as the veil between worlds grew thin 
                with winter's embrace, my roommate and I found ourselves divinely guided by boredom. 
                The snowfall had created a sacred cocoon around our home, and spirit urged us toward 
                the local craft sanctuary.
              </p>
              <p className="text-lg text-midnight-700 leading-relaxed mb-6">
                Never considering myself particularly gifted in the craft arts, I wandered the aisles 
                like a seeker in a temple. Then—as if by otherworldly guidance—a simple wreath base 
                called to my spirit. It whispered of Yule magic and winter blessings yet to come. 
                I gathered oak leaves for strength, winter blooms for hope, and returned home to 
                perform my first act of floral alchemy.
              </p>
              <p className="text-lg text-midnight-700 leading-relaxed">
                To my wonder and delight, my maiden Christmas wreath emerged as a thing of beauty, 
                crackling with the energy I'd unknowingly woven into every placement. That moment 
                ignited a radiant fire I couldn't ignore. From there, the path revealed itself: 
                flower crowns to honor the divine feminine, corsages blessed with intention, 
                and wedding arbors that would witness love's most sacred vows—each creation 
                deepening my communion with the plant spirits.
              </p>
            </div>
          </div>

          {/* Why I Do What I Do */}
          <div className="mb-16">
            <h2 className="font-serif text-4xl text-plum-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">🌿</span>
              The Heart of It
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-plum-100/50 rounded-3xl p-8">
                <h3 className="font-serif text-2xl text-plum-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">✨</span>
                  Earth's Calling
                </h3>
                <p className="text-midnight-700 leading-relaxed">
                  My journey flows from a deep reverence for Mother Earth's creative force and 
                  the ancient wisdom that joy is medicine for the soul. Each arrangement begins 
                  with gratitude—to the earth that nurtures each bloom, to the seasons that 
                  guide their timing, and to the divine feminine energy that flows through all 
                  growing things.
                </p>
              </div>
              
              <div className="bg-forest-100/50 rounded-3xl p-8">
                <h3 className="font-serif text-2xl text-plum-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">🔮</span>
                  Elemental Craft
                </h3>
                <p className="text-midnight-700 leading-relaxed">
                  Using only the finest earthly materials and time-honored binding techniques, 
                  I craft durable talismans of beauty that honor both form and spirit. 
                  When the universe revealed that this enchanted work could sustain my earthly 
                  needs, I knew I'd found my dharma—my soul's true purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-plum-200/30 to-forest-200/30 rounded-3xl p-12 text-center">
            <div className="text-4xl mb-6">🌸 🕯️ 🌙</div>
            <h2 className="font-serif text-3xl text-plum-800 mb-6">
              My Hallowed Promise
            </h2>
            <p className="text-lg text-midnight-700 leading-relaxed mb-6">
              My intention is pure and simple: to channel the earth's magic into the perfect 
              botanical blessing for your journey—whether it graces your cherished space or 
              witnesses the most blessed day of your life. Every creation, from the smallest 
              boutonniere to the grandest ceremony arch, is a unique reflection of your soul's 
              light and the natural world's infinite wisdom.
            </p>
            <p className="text-lg text-midnight-700 leading-relaxed font-medium">
              Each piece carries intention, holds energy, and whispers the ancient truth: 
              <em className="text-plum-700"> that love, like flowers, is meant to bloom wild and free.</em>
            </p>
            <div className="mt-8">
              <p className="font-script text-2xl text-plum-600">Blessed be, and so it is. 🌿</p>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-midnight-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-mist-100 mb-6">
            Ready to Create Magic Together?
          </h2>
          <p className="text-xl text-mist-200 mb-8">
            Let's weave your dreams into reality with sacred botanicals and blessed ceremonies.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowWizard(true)}
              className="bg-plum-700 hover:bg-plum-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Begin Your Journey
            </button>
            <button className="border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
              Fae-Touched Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Consultation Wizard */}
      {showWizard && (
        <ConsultationWizard onClose={() => setShowWizard(false)} />
      )}

    </div>
  );
}