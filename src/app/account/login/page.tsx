'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useCustomerAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/account/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(formData);

    if (result.success) {
      router.push('/account/profile');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-plum-600 border-t-transparent mb-4"></div>
          <p className="text-mist-200">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-24">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌙</div>
            <h1 className="font-serif text-3xl text-mist-100 mb-2">Welcome Back</h1>
            <p className="text-mist-300">Sign in to your sacred account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-900/30 border border-rose-800/50">
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-plum-700 to-plum-600 hover:from-plum-600 hover:to-plum-500 disabled:from-plum-800 disabled:to-plum-800 text-white py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                '✨ Sign In ✨'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className="text-sm text-mist-400">
              <Link href="#" className="text-plum-400 hover:text-plum-300 transition-colors">
                Forgot your password?
              </Link>
            </div>
            
            <div className="border-t border-plum-800/30 pt-4">
              <p className="text-sm text-mist-400 mb-2">Don't have an account?</p>
              <Link 
                href="/account/register"
                className="text-plum-400 hover:text-plum-300 transition-colors font-medium"
              >
                Create your sacred account
              </Link>
            </div>

            <div className="text-xs text-mist-500">
              <Link href="/shop" className="hover:text-mist-300 transition-colors">
                Continue shopping as guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}