'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

interface HeaderProps {
  onConsultationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onConsultationClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { customer, isAuthenticated } = useCustomerAuth();

  const navigation = [
    { name: 'Services', href: '/services' },
    { name: 'Shop', href: '/shop' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-midnight-900/95 backdrop-blur-sm border-b border-plum-800/30 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group relative focus:outline-none focus:ring-0 focus:border-0 outline-none">
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 transition-transform duration-300 group-hover:scale-105 translate-y-1 sm:translate-y-2">
              <Image
                src="/Laynie_Fae_logo_badge_wfairy2.png"
                alt="Laynie Fae Logo"
                width={150}
                height={153}
                className="object-contain focus:outline-none outline-none"
                priority
              />
            </div>
            <div className="w-24 h-16 sm:w-32 sm:h-20 lg:w-36 lg:h-20"></div> {/* Spacer to prevent navigation overlap */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-mist-200 hover:text-rose-100 font-serif transition-colors duration-300 relative group"
              >
                {item.name}
                {/* Smokey effect */}
                <>
                  <div className="absolute -bottom-6 left-1/2 w-20 h-20 bg-plum-500/60 rounded-full blur-2xl transform -translate-x-1/2 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700 pointer-events-none"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-rose-400/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 animate-float transition-opacity duration-500 delay-200 pointer-events-none"></div>
                  <div className="absolute -bottom-5 -right-6 w-14 h-14 bg-plum-600/70 rounded-full blur-lg opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-600 delay-100 pointer-events-none"></div>
                  <div className="absolute -bottom-8 left-0 w-16 h-16 bg-midnight-600/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-800 delay-400 pointer-events-none"></div>
                  <div className="absolute -bottom-2 right-2 w-8 h-8 bg-rose-500/55 rounded-full blur-lg opacity-0 group-hover:opacity-100 animate-float transition-opacity duration-600 delay-600 pointer-events-none"></div>
                  <div className="absolute -top-4 left-1/3 w-10 h-10 bg-plum-400/35 rounded-full blur-xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-900 delay-800 pointer-events-none"></div>
                  <div className="absolute -bottom-7 right-1/4 w-6 h-6 bg-rose-300/45 rounded-full blur-md opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500 delay-300 pointer-events-none"></div>
                </>
              </Link>
            ))}
          </nav>

          {/* Cart and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-mist-200 hover:text-rose-100 transition-colors duration-300 rounded-full hover:bg-midnight-800"
              title="Shopping Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 8.32a2 2 0 002 2h9.36a2 2 0 002-2L17 13m-8 0V9a3 3 0 116 0v4m-6 0h6" />
              </svg>
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-plum-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cart.itemCount}
                </span>
              )}
            </button>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/account/profile"
                  className="flex items-center space-x-2 text-mist-200 hover:text-rose-100 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-midnight-800"
                  title="Your Profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">
                    {customer?.first_name || 'Profile'}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/account/login"
                  className="text-mist-200 hover:text-rose-100 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-midnight-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/account/register"
                  className="bg-plum-700 hover:bg-plum-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Join 🌙
                </Link>
              </div>
            )}
            
            <button
              onClick={onConsultationClick}
              className="bg-gradient-to-r from-rose-700 to-plum-700 hover:from-rose-600 hover:to-plum-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25"
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-mist-200 hover:text-rose-100 hover:bg-midnight-800 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-all duration-500 ${isMenuOpen ? 'rotate-180 scale-110' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <>
                  {/* Mystical Moon/Crystal Close Icon */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 0 15c-.132 0-.26 0-.393 0A7.5 7.5 0 1 1 12 3z"
                    className="animate-pulse"
                  />
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="2" 
                    strokeWidth={1.5} 
                    className="animate-pulse delay-150"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="m8 8 8 8 M16 8 l-8 8"
                    opacity="0.6"
                  />
                </>
              ) : (
                <>
                  {/* Mystical Menu Lines with Dots */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16"/>
                  <circle cx="2" cy="6" r="0.5" fill="currentColor" className="animate-pulse"/>
                  <circle cx="2" cy="12" r="0.5" fill="currentColor" className="animate-pulse delay-100"/>
                  <circle cx="2" cy="18" r="0.5" fill="currentColor" className="animate-pulse delay-200"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out relative ${
            isMenuOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          {/* Mobile menu smoky background effect */}
          {isMenuOpen && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-8 w-16 h-16 bg-plum-500/40 rounded-full blur-2xl" style={{animation: 'smoke-drift 4s ease-in-out infinite'}}></div>
              <div className="absolute top-6 left-4 w-12 h-12 bg-rose-400/30 rounded-full blur-xl" style={{animation: 'smoke-swirl 5s ease-in-out infinite'}}></div>
              <div className="absolute bottom-4 right-12 w-20 h-20 bg-midnight-600/25 rounded-full blur-3xl" style={{animation: 'smoke-drift 6s ease-in-out infinite 300ms'}}></div>
              <div className="absolute top-12 right-2 w-8 h-8 bg-plum-600/50 rounded-full blur-lg" style={{animation: 'smoke-swirl 3.5s ease-in-out infinite 500ms'}}></div>
              <div className="absolute bottom-8 left-6 w-14 h-14 bg-rose-500/35 rounded-full blur-xl" style={{animation: 'smoke-drift 5.5s ease-in-out infinite 700ms'}}></div>
              <div className="absolute top-20 left-12 w-6 h-6 bg-plum-400/40 rounded-full blur-md" style={{animation: 'smoke-swirl 4.5s ease-in-out infinite 900ms'}}></div>
              <div className="absolute bottom-12 right-4 w-10 h-10 bg-rose-300/30 rounded-full blur-lg" style={{animation: 'smoke-drift 3.8s ease-in-out infinite 1100ms'}}></div>
              <div className="absolute top-16 right-20 w-18 h-18 bg-midnight-500/20 rounded-full blur-2xl" style={{animation: 'smoke-swirl 6.5s ease-in-out infinite 200ms'}}></div>
            </div>
          )}
          
          <nav className="flex flex-col space-y-4 pt-4 border-t border-plum-800/30 relative z-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-mist-200 hover:text-rose-100 font-serif transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-midnight-800 text-right"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Authentication Links */}
            <div className="border-t border-plum-800/30 pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-end space-x-2 text-mist-200 hover:text-rose-100 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-midnight-800"
                  >
                    <span>Profile ({customer?.first_name || 'Account'})</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-mist-200 hover:text-rose-100 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-midnight-800 text-right block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/account/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-plum-700 hover:bg-plum-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 text-center ml-auto mr-4 w-fit block"
                  >
                    Join 🌙
                  </Link>
                </>
              )}
            </div>
            
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onConsultationClick?.();
              }}
              className="bg-gradient-to-r from-rose-700 to-plum-700 hover:from-rose-600 hover:to-plum-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 text-center mt-4 ml-auto mr-4 w-fit"
            >
              Book Consultation
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;