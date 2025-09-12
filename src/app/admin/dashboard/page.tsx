'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, ProductCategory } from '@/types/product';
import { Order, OrderStatus, FulfillmentStatus } from '@/types/order';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockItems: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSummary, setOrderSummary] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [orderFilters, setOrderFilters] = useState({
    status: '',
    search: ''
  });
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string, slug: string, is_default: boolean}[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setStats(prev => ({ ...prev, totalProducts: data.products.length }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        ...(orderFilters.status && { status: orderFilters.status }),
        ...(orderFilters.search && { search: orderFilters.search })
      });

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setOrderSummary(data.summary || orderSummary);
        // Update overview stats with order data
        setStats(prev => ({
          ...prev,
          totalOrders: data.summary?.totalOrders || 0,
          totalRevenue: data.summary?.totalRevenue || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, fulfillmentStatus?: string) => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          status,
          fulfillmentStatus
        })
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const addCustomCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory.trim() })
      });

      if (response.ok) {
        setNewCategory('');
        fetchCategories(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error creating category: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  const removeCustomCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error deleting category: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchCategories();
      fetchProducts();
      fetchOrders();
    }
  }, [router]);

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'products', 'categories', 'orders', 'giftcards', 'analytics'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/admin/login');
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });

      if (response.ok) {
        fetchProducts(); // Refresh the product list
        alert('Product deleted successfully');
      } else {
        const error = await response.json();
        alert(`Error deleting product: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'products', name: 'Products', icon: '🌸' },
    { id: 'categories', name: 'Categories', icon: '🏷️' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'giftcards', name: 'Gift Cards', icon: '🎁' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 to-forest-900 pt-24">
      {/* Header */}
      <header className="bg-midnight-800/50 backdrop-blur-sm border-b border-plum-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔮</div>
              <div>
                <h1 className="font-serif text-xl text-mist-100">Sacred Admin</h1>
                <p className="text-xs text-mist-400">Mystical Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="text-mist-300 hover:text-rose-200 transition-colors text-sm"
              >
                View Site 🔗
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mist-400">Total Products</p>
                <p className="text-2xl font-bold text-mist-100">{stats.totalProducts}</p>
              </div>
              <div className="text-3xl">🌸</div>
            </div>
          </div>

          <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mist-400">Total Orders</p>
                <p className="text-2xl font-bold text-mist-100">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mist-400">Total Revenue</p>
                <p className="text-2xl font-bold text-mist-100">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mist-400">Low Stock Items</p>
                <p className="text-2xl font-bold text-mist-100">{stats.lowStockItems}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-midnight-800/30 p-1 rounded-2xl mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-plum-700 text-white'
                  : 'text-mist-300 hover:text-mist-100 hover:bg-midnight-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-midnight-800/50 backdrop-blur-sm rounded-3xl p-8 border border-plum-800/30">
          {activeTab === 'overview' && (
            <div>
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Sacred Overview</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-mist-200 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {orders.length > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-midnight-700/50 rounded-lg">
                        <span className="text-green-400">✅</span>
                        <span className="text-mist-300 text-sm">
                          Latest order - ${(orders[0]?.total_amount / 100).toFixed(2)} from {orders[0]?.customer_email}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-3 bg-midnight-700/50 rounded-lg">
                      <span className="text-blue-400">📦</span>
                      <span className="text-mist-300 text-sm">Product inventory updated</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-midnight-700/50 rounded-lg">
                      <span className="text-purple-400">🌟</span>
                      <span className="text-mist-300 text-sm">System running smoothly</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-mist-200 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => router.push('/admin/products/new')}
                      className="w-full bg-plum-700 hover:bg-plum-600 text-white p-4 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">➕</span>
                        <div>
                          <div className="font-medium">Add New Product</div>
                          <div className="text-sm opacity-75">Create mystical offerings</div>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('giftcards')}
                      className="w-full bg-rose-700 hover:bg-rose-600 text-white p-4 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">🎁</span>
                        <div>
                          <div className="font-medium">Manage Gift Cards</div>
                          <div className="text-sm opacity-75">Sacred gift offerings</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-mist-100">Product Management</h2>
                <button 
                  onClick={() => router.push('/admin/products/new')}
                  className="bg-plum-700 hover:bg-plum-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  ➕ Add Product
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-plum-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-mist-300">Loading sacred products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌸</div>
                  <h3 className="text-xl text-mist-200 mb-4">No Products Yet</h3>
                  <p className="text-mist-400 mb-6">Create your first mystical offering to get started</p>
                  <button 
                    onClick={() => router.push('/admin/products/new')}
                    className="bg-plum-700 hover:bg-plum-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {products.map((product) => (
                    <div key={`product-${product.id}`} className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-serif text-xl text-mist-100">{product.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (product as any).is_active 
                                ? 'bg-green-700/30 text-green-300 border border-green-600/30' 
                                : 'bg-red-700/30 text-red-300 border border-red-600/30'
                            }`}>
                              {(product as any).is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-mist-300 mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-mist-400">
                            <span>💰 ${(product.price / 100).toFixed(2)}</span>
                            <span>📦 {(product as any).stock_quantity || 'Unlimited'}</span>
                            <span>🏷️ {(product as any).categories?.name || 'No Category'}</span>
                            {(product as any).is_customizable && <span>✨ Customizable</span>}
                          </div>
                          {(product as any).ritual_properties && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {(product as any).ritual_properties.elements?.map((element: string, index: number) => (
                                <span key={`element-${product.id}-${index}`} className="px-2 py-1 bg-plum-700/30 text-plum-300 text-xs rounded-full">
                                  {element}
                                </span>
                              ))}
                              {(product as any).ritual_properties.intentions?.slice(0, 3).map((intention: string, index: number) => (
                                <span key={`intention-${product.id}-${index}`} className="px-2 py-1 bg-rose-700/30 text-rose-300 text-xs rounded-full">
                                  {intention}
                                </span>
                              ))}
                              {(product as any).ritual_properties.intentions?.length > 3 && (
                                <span className="px-2 py-1 bg-mist-700/30 text-mist-300 text-xs rounded-full">
                                  +{(product as any).ritual_properties.intentions.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-6">
                          <button 
                            onClick={() => handleEditProduct(product.id)}
                            className="p-2 bg-plum-700/30 hover:bg-plum-700/50 text-plum-300 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-red-700/30 hover:bg-red-700/50 text-red-300 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-mist-100">Category Management</h2>
                <div className="text-sm text-mist-300">
                  Manage product categories for your mystical offerings
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Default Categories */}
                <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
                  <h3 className="font-serif text-lg text-mist-100 mb-4">✨ Default Categories</h3>
                  <p className="text-sm text-mist-400 mb-4">Built-in categories for your sacred business</p>
                  <div className="space-y-2">
                    {categories.filter(cat => cat.is_default).map((category) => (
                      <div key={`default-category-${category.id}`} className="flex items-center justify-between p-3 bg-midnight-700/50 rounded-lg">
                        <span className="text-mist-200">{category.name}</span>
                        <span className="px-2 py-1 bg-plum-700/30 text-plum-300 text-xs rounded-full">Default</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Categories */}
                <div className="bg-midnight-800/50 backdrop-blur-sm rounded-2xl p-6 border border-plum-800/30">
                  <h3 className="font-serif text-lg text-mist-100 mb-4">🎨 Custom Categories</h3>
                  <p className="text-sm text-mist-400 mb-4">Create your own unique product categories</p>
                  
                  {/* Add New Category */}
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                        className="flex-1 px-3 py-2 bg-mist-100 text-midnight-800 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600 transition-colors"
                        placeholder="e.g., Crystal Collections, Tarot Accessories..."
                      />
                      <button
                        onClick={addCustomCategory}
                        disabled={!newCategory.trim()}
                        className="bg-plum-700 hover:bg-plum-600 disabled:bg-plum-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Custom Categories List */}
                  {categories.filter(cat => !cat.is_default).length > 0 ? (
                    <div className="space-y-2">
                      {categories.filter(cat => !cat.is_default).map((category) => (
                        <div key={`custom-category-${category.id}`} className="flex items-center justify-between p-3 bg-midnight-700/50 rounded-lg">
                          <span className="text-mist-200">{category.name}</span>
                          <button
                            onClick={() => removeCustomCategory(category.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🏷️</div>
                      <p className="text-mist-400 text-sm">No custom categories yet</p>
                      <p className="text-mist-500 text-xs mt-1">Add your first custom category above</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Usage Info */}
              <div className="mt-8 bg-midnight-900/30 rounded-2xl p-6 border border-plum-800/20">
                <h3 className="font-serif text-lg text-mist-100 mb-4">📋 Category Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-mist-300">
                  <div>
                    <p className="mb-2">✨ <strong>Default Categories:</strong> Pre-built for mystical businesses</p>
                    <p className="mb-2">🎨 <strong>Custom Categories:</strong> Create unique categories for your offerings</p>
                  </div>
                  <div>
                    <p className="mb-2">🔄 <strong>Dynamic Updates:</strong> Categories update across the entire system</p>
                    <p className="mb-2">⚠️ <strong>Note:</strong> Removing categories may affect existing products</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'giftcards' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-mist-100">Gift Card Management</h2>
                <button className="bg-rose-700 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  🎁 Create Gift Card
                </button>
              </div>
              
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl text-mist-200 mb-4">Gift Card System Coming Soon</h3>
                <p className="text-mist-400">Magical gift cards with custom designs and amounts</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-mist-100">Order Management</h2>
                <div className="flex space-x-3">
                  <select 
                    value={orderFilters.status}
                    onChange={(e) => {
                      setOrderFilters(prev => ({ ...prev, status: e.target.value }));
                      setTimeout(fetchOrders, 100);
                    }}
                    className="px-3 py-2 bg-midnight-700 text-mist-100 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600"
                  >
                    <option value="">All Orders</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderFilters.search}
                    onChange={(e) => {
                      setOrderFilters(prev => ({ ...prev, search: e.target.value }));
                      setTimeout(fetchOrders, 500);
                    }}
                    className="px-3 py-2 bg-midnight-700 text-mist-100 border border-plum-800/50 rounded-lg focus:border-plum-600 focus:ring-1 focus:ring-plum-600"
                  />
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-midnight-800/50 rounded-xl p-4 border border-plum-800/30">
                  <div className="text-sm text-mist-400">Total Orders</div>
                  <div className="text-2xl font-bold text-mist-100">{orderSummary.totalOrders}</div>
                </div>
                <div className="bg-midnight-800/50 rounded-xl p-4 border border-plum-800/30">
                  <div className="text-sm text-mist-400">Pending</div>
                  <div className="text-2xl font-bold text-rose-300">{orderSummary.pendingOrders}</div>
                </div>
                <div className="bg-midnight-800/50 rounded-xl p-4 border border-plum-800/30">
                  <div className="text-sm text-mist-400">Completed</div>
                  <div className="text-2xl font-bold text-green-300">{orderSummary.completedOrders}</div>
                </div>
                <div className="bg-midnight-800/50 rounded-xl p-4 border border-plum-800/30">
                  <div className="text-sm text-mist-400">Revenue</div>
                  <div className="text-2xl font-bold text-plum-300">${(orderSummary.totalRevenue / 100).toFixed(2)}</div>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl text-mist-200 mb-4">No Orders Found</h3>
                    <p className="text-mist-400">Orders will appear here once customers start purchasing</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-midnight-800/50 rounded-2xl p-6 border border-plum-800/30">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-lg text-mist-100">
                            Order #{order.id.substring(0, 8)}...
                          </h3>
                          <p className="text-sm text-mist-300">{order.customer_email}</p>
                          <p className="text-xs text-mist-400">
                            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-plum-300">
                            ${(order.total_amount / 100).toFixed(2)}
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED' ? 'bg-green-700/30 text-green-300' :
                              order.status === 'CANCELLED' ? 'bg-red-700/30 text-red-300' :
                              'bg-yellow-700/30 text-yellow-300'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.order_items && order.order_items.length > 0 && (
                        <div className="bg-midnight-700/50 rounded-lg p-4 mb-4">
                          <div className="text-sm text-mist-400 mb-2">Items ({order.order_items.length})</div>
                          <div className="space-y-2">
                            {order.order_items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 text-sm">
                                <div className="w-8 h-8 bg-midnight-600 rounded flex items-center justify-center text-xs">
                                  {item.quantity}x
                                </div>
                                <span className="text-mist-200 flex-1">{item.product_name}</span>
                                <span className="text-plum-300">${(item.total_price / 100).toFixed(2)}</span>
                              </div>
                            ))}
                            {order.order_items.length > 3 && (
                              <div className="text-xs text-mist-400">
                                +{order.order_items.length - 3} more items
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Start Processing
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                            className="px-3 py-1 bg-plum-700 hover:bg-plum-600 text-white text-sm rounded-lg transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.square_receipt_url && (
                          <a
                            href={order.square_receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-midnight-600 hover:bg-midnight-500 text-mist-200 text-sm rounded-lg transition-colors"
                          >
                            View Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="font-serif text-2xl text-mist-100 mb-6">Sacred Analytics</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl text-mist-200 mb-4">Analytics Dashboard Coming Soon</h3>
                <p className="text-mist-400">Insights into your mystical business performance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}