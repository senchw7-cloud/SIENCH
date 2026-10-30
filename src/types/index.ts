/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductTag = 'NEW ARRIVAL' | 'BEST SELLER' | 'LIMITED EDITION' | 'SIGNATURE';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  minStock: number;
  sku: string;
  dimensions?: string;
  material?: string;
  tags: ProductTag[];
  isActive: boolean;
  featured: boolean;
  salesCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'bank_transfer' | 'qris' | 'gateway' | 'whatsapp';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerWhatsApp: string;
  customerEmail?: string;
  shippingAddress: ShippingAddress;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  shippingCourier?: string;
  couponCode?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 50000 for Rp 50.000
  minPurchase: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  registeredAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeAmount: number; // e.g. -1 for sale, +10 for restock
  previousStock: number;
  newStock: number;
  reason: 'Sale' | 'Restock' | 'Correction' | 'Return' | 'Damage';
  timestamp: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}

export interface SiteSettings {
  brandName: string;
  brandPhilosophy: string;
  mainSlogan: string;
  subSlogan: string;
  brandStatement: string;
  brandStatementDesc: string;
  whatsappNumber: string;
  instagramUrl: string;
  tiktokUrl: string;
  supportEmail: string;
  storeAddress: string;
  shippingPolicy: string;
  returnPolicy: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroButtonText: string;
  heroBannerImage?: string;
  announcementText: string;
  announcementActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: ShippingAddress;
}
