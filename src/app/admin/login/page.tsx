'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="font-serif text-3xl text-mist-100 mb-2">
            Sacred Admin Portal
          </h1>
          <div className="w-24 h-1 bg-plum-600 mx-auto mb-4"></div>
          <p className="text-mist-200">
            Enter the mystical realm of management
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mist-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-plum-700 hover:bg-plum-600 disabled:bg-plum-800 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-plum-700/25 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entering Sacred Realm...</span>
                </div>
              ) : (
                'Enter Admin Portal'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-mist-400">
            <p>🔒 Secured by ancient mystical protection</p>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-8 p-4 bg-midnight-900/30 rounded-lg border border-plum-800/20">
          <p className="text-xs text-mist-400 text-center">
            <strong>Development Login:</strong><br />
            Username: <code className="bg-midnight-800 px-2 py-1 rounded">admin</code><br />
            Password: <code className="bg-midnight-800 px-2 py-1 rounded">mystic123</code>
          </p>
        </div>
      </div>
    </div>
  );
}