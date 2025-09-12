'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    birth_time: '',
    birth_location: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const { register, isAuthenticated, isLoading } = useCustomerAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/account/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Birth date validation (if provided)
    if (formData.birth_date && new Date(formData.birth_date) > new Date()) {
      newErrors.birth_date = 'Birth date cannot be in the future';
    }

    // Phone validation (if provided)
    if (formData.phone && !/^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    if (result.success) {
      router.push('/account/profile?welcome=true');
    } else {
      setErrors({ general: result.error || 'Registration failed. Please try again.' });
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="font-serif text-3xl text-mist-100 mb-2">Begin Your Sacred Journey</h1>
            <p className="text-mist-300">Create your mystical account</p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-lg bg-rose-900/30 border border-rose-800/50">
              <p className="text-rose-300 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  placeholder="Your first name"
                />
                {errors.first_name && <p className="text-rose-400 text-xs mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-mist-200 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  placeholder="Your last name"
                />
                {errors.last_name && <p className="text-rose-400 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Email Address *
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
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="Create a strong password"
              />
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password}</p>}
              <p className="text-xs text-mist-500 mt-1">Must include uppercase, lowercase, number, and special character</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Optional Astrological Fields Toggle */}
            <div className="border-t border-plum-800/30 pt-6">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="flex items-center justify-between w-full text-left"
              >
                <div>
                  <h3 className="font-medium text-mist-200 mb-1">🌙 Astrological Information (Optional)</h3>
                  <p className="text-sm text-mist-400">Help us provide personalized mystical recommendations</p>
                </div>
                <div className="text-plum-400 text-xl">
                  {showOptionalFields ? '−' : '+'}
                </div>
              </button>
            </div>

            {/* Optional Astrological Fields */}
            {showOptionalFields && (
              <div className="space-y-4 pl-4 border-l-2 border-plum-800/30">
                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  />
                  {errors.birth_date && <p className="text-rose-400 text-xs mt-1">{errors.birth_date}</p>}
                  <p className="text-xs text-mist-500 mt-1">For accurate sun sign and astrological readings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Birth Time
                  </label>
                  <input
                    type="time"
                    name="birth_time"
                    value={formData.birth_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                  />
                  <p className="text-xs text-mist-500 mt-1">For precise moon sign and rising sign calculations</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Birth Location
                  </label>
                  <input
                    type="text"
                    name="birth_location"
                    value={formData.birth_location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="City, State/Country"
                  />
                  <p className="text-xs text-mist-500 mt-1">For accurate house calculations in your birth chart</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mist-200 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-plum-700 to-plum-600 hover:from-plum-600 hover:to-plum-500 disabled:from-plum-800 disabled:to-plum-800 text-white py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Your Account...</span>
                </div>
              ) : (
                '✨ Begin Your Journey ✨'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="border-t border-plum-800/30 pt-4">
              <p className="text-sm text-mist-400 mb-2">Already have an account?</p>
              <Link 
                href="/account/login"
                className="text-plum-400 hover:text-plum-300 transition-colors font-medium"
              >
                Sign in to your sacred account
              </Link>
            </div>

            <div className="text-xs text-mist-500 mt-4">
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