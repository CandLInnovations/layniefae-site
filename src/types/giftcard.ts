export interface GiftCard {
  id: string;
  code: string;
  amount: number; // in cents
  balance: number; // in cents
  purchaserEmail: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  design: GiftCardDesign;
  status: GiftCardStatus;
  createdAt: string;
  expiresAt?: string;
  usedAt?: string;
  orderId?: string; // Associated with purchase order
}

export enum GiftCardStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum GiftCardDesign {
  MYSTICAL_MOON = 'mystical-moon',
  SACRED_ROSES = 'sacred-roses',
  CRYSTAL_ENERGY = 'crystal-energy',
  ELEMENTAL_HARMONY = 'elemental-harmony',
  CELESTIAL_BLESSING = 'celestial-blessing'
}

export interface GiftCardUsage {
  id: string;
  giftCardId: string;
  orderId: string;
  amountUsed: number; // in cents
  usedAt: string;
}

export interface GiftCardPurchaseData {
  amount: number;
  design: GiftCardDesign;
  purchaserName: string;
  purchaserEmail: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  deliveryDate?: string; // For scheduled delivery
}