// Auto-generated types matching the Supabase schema
// Run `supabase gen types typescript` to regenerate from your live schema

export type GenderTarget = "boys" | "girls" | "unisex";
export type AgeGroup = "infant" | "toddler" | "kids" | "teens";
export type DiscountType = "percentage" | "fixed";
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  password_hash: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  street: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
}

export interface Product {
  id: string;
  category_id: string | null;
  brand_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  gender_target: GenderTarget | null;
  age_group: AgeGroup | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string | null;
  stock_qty: number;
  price_ngn: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  expiry_date: string | null;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  coupon_id: string | null;
  status: OrderStatus;
  subtotal_ngn: number;
  discount_amount: number;
  delivery_fee: number;
  total_ngn: number;
  courier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  placed_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price_ngn: number;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  reference: string;
  status: PaymentStatus;
  amount_ngn: number;
  paid_at: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Joined types used in components
export interface ProductWithRelations extends Product {
  brand: Brand | null;
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface OrderWithRelations extends Order {
  items: (OrderItem & { variant: ProductVariant & { product: Product } })[];
  address: Address;
  payment: Payment | null;
}

// Cart (client-side only, not persisted to DB)
export interface CartItem {
  variant: ProductVariant;
  product: Product;
  image_url: string | null;
  quantity: number;
}
