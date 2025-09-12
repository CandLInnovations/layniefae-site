import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/types/order';

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

interface CustomerOrdersState {
  orders: Order[];
  stats: OrderStats;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useCustomerOrders = (page: number = 1, limit: number = 10) => {
  const [state, setState] = useState<CustomerOrdersState>({
    orders: [],
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalSpent: 0
    },
    isLoading: true,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  });

  const fetchOrders = useCallback(async (pageNum: number = page, limitNum: number = limit) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const sessionToken = localStorage.getItem('customer-session-token');
    
    if (!sessionToken) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Not authenticated'
      }));
      return;
    }

    try {
      const response = await fetch(`/api/customers/orders?page=${pageNum}&limit=${limitNum}`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          orders: data.orders,
          stats: data.stats,
          pagination: data.pagination,
          isLoading: false,
          error: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Failed to fetch orders'
        }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error occurred'
      }));
    }
  }, [page, limit]);

  const refreshOrders = useCallback(() => {
    fetchOrders(state.pagination.page, state.pagination.limit);
  }, [fetchOrders, state.pagination.page, state.pagination.limit]);

  const goToPage = useCallback((pageNum: number) => {
    fetchOrders(pageNum, state.pagination.limit);
  }, [fetchOrders, state.pagination.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    ...state,
    refreshOrders,
    goToPage,
    fetchOrders
  };
};