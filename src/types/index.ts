/**
 * Domain types shared between client and server.
 * All Firestore documents are timestamped; we surface `id` alongside.
 */

export type ProductCategory =
  | 'dhoop'
  | 'lamp'
  | 'cake'
  | 'oil'
  | 'soap'
  | 'tea'
  | 'wellness'
  | 'other';

export interface Product {
  id: string;
  slug: string;
  titleEn: string;
  titleKn: string; // Kannada title
  descriptionEn: string;
  descriptionKn?: string;
  price: number; // current price (in INR)
  originalPrice?: number; // shown as strikethrough
  category: ProductCategory;
  imageUrl: string;
  images?: string[];
  inStock: boolean;
  featured?: boolean;
  benefits?: string[];
  ingredients?: string[];
  createdAt: number;
  updatedAt: number;
  order?: number;
}

export interface Thought {
  id: string;
  text: string;
  textKn?: string; // Optional Kannada version
  author: string;
  backgroundUrl?: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  slug: string;
  titleEn: string;
  titleKn?: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus =
  | 'created'
  | 'paid'
  | 'failed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

export interface SiteSettings {
  heroHeadlineEn: string;
  heroHeadlineKn: string;
  heroSubtext: string;
  founderName: string;
  founderBio: string;
  shalaAddress: string;
  shalaPhone: string;
  shalaEmail: string;
  shalaHours: string;
}
