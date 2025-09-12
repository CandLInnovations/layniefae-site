'use client';

import { useState, useEffect, useCallback } from 'react';
import { CustomerProfile, CustomerAuthResponse, CustomerRegistration, CustomerLogin } from '@/types/customer';

interface CustomerAuthState {
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionToken: string | null;
}

export const useCustomerAuth = () => {
  const [state, setState] = useState<CustomerAuthState>({
    customer: null,
    isAuthenticated: false,
    isLoading: true,
    sessionToken: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const sessionToken = localStorage.getItem('customer-session-token');
      
      if (!sessionToken) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await fetch('/api/customers/verify-session', {
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setState({
            customer: data.customer,
            isAuthenticated: true,
            isLoading: false,
            sessionToken
          });
        } else {
          // Invalid or expired session
          localStorage.removeItem('customer-session-token');
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('customer-session-token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkExistingSession();
  }, []);

  const register = useCallback(async (registrationData: CustomerRegistration): Promise<CustomerAuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      const data: CustomerAuthResponse = await response.json();

      if (data.success && data.customer && data.session_token) {
        localStorage.setItem('customer-session-token', data.session_token);
        setState({
          customer: data.customer,
          isAuthenticated: true,
          isLoading: false,
          sessionToken: data.session_token
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      return data;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }, []);

  const login = useCallback(async (loginData: CustomerLogin): Promise<CustomerAuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data: CustomerAuthResponse = await response.json();

      if (data.success && data.customer && data.session_token) {
        localStorage.setItem('customer-session-token', data.session_token);
        setState({
          customer: data.customer,
          isAuthenticated: true,
          isLoading: false,
          sessionToken: data.session_token
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }

      return data;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const sessionToken = localStorage.getItem('customer-session-token');
      
      if (sessionToken) {
        await fetch('/api/customers/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });
      }

      localStorage.removeItem('customer-session-token');
      setState({
        customer: null,
        isAuthenticated: false,
        isLoading: false,
        sessionToken: null
      });

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('customer-session-token');
      setState({
        customer: null,
        isAuthenticated: false,
        isLoading: false,
        sessionToken: null
      });
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<CustomerProfile>): Promise<boolean> => {
    if (!state.sessionToken || !state.customer) {
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`/api/customers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.sessionToken}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          customer: { ...prev.customer!, ...data.customer },
          isLoading: false
        }));
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, [state.sessionToken, state.customer]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const sessionToken = localStorage.getItem('customer-session-token');
    
    if (!sessionToken) return false;

    try {
      const response = await fetch('/api/customers/verify-session', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          customer: data.customer,
          isAuthenticated: true
        }));
        return true;
      } else {
        localStorage.removeItem('customer-session-token');
        setState({
          customer: null,
          isAuthenticated: false,
          isLoading: false,
          sessionToken: null
        });
        return false;
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }, []);

  return {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    refreshSession
  };
};