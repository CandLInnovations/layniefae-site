export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  customizations?: CartCustomization[];
  variationId?: string;
  variationName?: string;
}

export interface CartCustomization {
  optionId: string;
  optionName: string;
  value: string;
  additionalPrice?: number; // in cents
}

export interface Cart {
  items: CartItem[];
  subtotal: number; // in cents
  tax?: number; // in cents
  total: number; // in cents
  itemCount: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  locality: string; // city
  administrativeDistrictLevel1: string; // state
  postalCode: string;
  country: string;
}

export interface CheckoutData {
  cart: Cart;
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  email: string;
  notes?: string;
}