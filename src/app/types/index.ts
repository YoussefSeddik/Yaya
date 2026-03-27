// ============================================================
// YAYA BABY – Shared TypeScript Types
// ============================================================

// ── Product ──────────────────────────────────────────────────
export type AgeSize = "0-3M" | "3-6M" | "6-12M" | "12-18M" | "18-24M";
export type ProductCategory = "Onesies" | "Sets" | "Rompers" | "Sleepwear" | "Outerwear" | "Accessories";

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  price: number;           // selling price (EGP)
  cost: number;            // cost price (EGP)
  category: ProductCategory;
  image_url: string;
  images?: string[];       // additional images
  stock: number;
  sku: string;
  is_active: boolean;
  sizes: AgeSize[];
  colors: string[];
  material?: string;
  care_instructions?: string[];
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ── Customer ─────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address_street?: string;
  address_area?: string;
  address_city?: string;
  address_governorate?: string;
  notes?: string;
  total_orders?: number;
  total_spent?: number;
  created_at?: string;
}

// ── Order ────────────────────────────────────────────────────
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "card" | "transfer" | "instapay";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type OrderSource = "website" | "whatsapp" | "instagram" | "facebook" | "phone";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  cost: number;
  size?: AgeSize;
  color?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer: Customer;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount?: number;
  total: number;
  total_cost: number;
  profit: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  source: OrderSource;
  notes?: string;
  date: string;
  created_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

// ── Cart ─────────────────────────────────────────────────────
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  size: AgeSize;
  color?: string;
  quantity: number;
  stock: number;
}

// ── Wishlist ─────────────────────────────────────────────────
export interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  sizes: AgeSize[];
  added_at: string;
}

// ── Analytics ────────────────────────────────────────────────
export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  revenueChange: number;    // % change vs last period
  ordersChange: number;
  customersChange: number;
}

// ── API Response Wrappers ─────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ── Filters ──────────────────────────────────────────────────
export interface ProductFilters {
  category?: ProductCategory;
  size?: AgeSize;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  is_active?: boolean;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  source?: OrderSource;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
