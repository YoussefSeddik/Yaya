// ============================================================
// YAYA BABY – Products Service
// Wraps mock data today; swap internals for Supabase calls.
// ============================================================

import { delay } from "./api";
import { MOCK_PRODUCTS } from "@/app/data/mockData";
import type { Product, ApiResponse, PaginatedResponse, ProductFilters } from "@/app/types";

// ── Read ──────────────────────────────────────────────────────
export async function getProducts(
  filters?: ProductFilters,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Product>> {
  await delay(200);

  let results = [...MOCK_PRODUCTS];

  if (filters?.is_active !== undefined) {
    results = results.filter((p) => p.is_active === filters.is_active);
  }
  if (filters?.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters?.size) {
    results = results.filter((p) => p.sizes.includes(filters.size!));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);

  return { data, total, page, pageSize, hasMore: start + pageSize < total };
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  await delay(150);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return product
    ? { data: product, error: null }
    : { data: null, error: "Product not found" };
}

export async function getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
  await delay(150);
  const featured = MOCK_PRODUCTS.filter((p) => p.is_featured && p.is_active);
  return { data: featured, error: null };
}

// ── Write (mirror to Supabase in prod) ───────────────────────
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Product>> {
  await delay(400);
  const newProduct: Product = {
    ...product,
    id: `p${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  // TODO: supabase.from('products').insert(newProduct)
  MOCK_PRODUCTS.push(newProduct);
  return { data: newProduct, error: null };
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<ApiResponse<Product>> {
  await delay(350);
  const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (idx === -1) return { data: null, error: "Product not found" };
  MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...updates, updated_at: new Date().toISOString() };
  // TODO: supabase.from('products').update(updates).eq('id', id)
  return { data: MOCK_PRODUCTS[idx], error: null };
}

export async function deleteProduct(id: string): Promise<ApiResponse<boolean>> {
  await delay(300);
  const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (idx === -1) return { data: false, error: "Product not found" };
  MOCK_PRODUCTS.splice(idx, 1);
  // TODO: supabase.from('products').delete().eq('id', id)
  return { data: true, error: null };
}
