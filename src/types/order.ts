export interface Order {
  id: string;
  square_payment_id: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  customer_email: string;
  customer_name?: string;
  shipping_address?: ShippingAddress;
  order_items: OrderItem[];
  payment_method: string;
  square_receipt_url?: string;
  fulfillment_status: FulfillmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations?: OrderCustomization[];
  variation_name?: string;
}

export interface OrderCustomization {
  option_name: string;
  value: string;
  additional_price?: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum FulfillmentStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}