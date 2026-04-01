// ============================================================
// YAYA BABY – Products Service (real Supabase via API routes)
// ============================================================
import type { Product, ApiResponse, PaginatedResponse, ProductFilters } from "@/app/types";

const BASE = "/api/products";

export async function getProducts(
  filters?: ProductFilters,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (filters?.search)                     params.set("search", filters.search);
  if (filters?.category)                   params.set("category", filters.category);
  if (filters?.is_active !== undefined)    params.set("is_active", String(filters.is_active));

  const res  = await fetch(`${BASE}?${params}`);
  if (!res.ok) return { data: [], total: 0, page, pageSize, hasMore: false };
  return res.json();
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) return { data: null, error: "Product not found" };
  const json = await res.json();
  return { data: json.data, error: null };
}

export async function getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
  const res = await fetch(`${BASE}?is_active=true&pageSize=10`);
  if (!res.ok) return { data: null, error: "Failed to fetch products" };
  const json = await res.json();
  return { data: json.data ?? [], error: null };
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Product>> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error ?? "Failed to create product" };
  return { data: json.data, error: null };
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<ApiResponse<Product>> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error ?? "Failed to update product" };
  return { data: json.data, error: null };
}

export async function deleteProduct(id: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    return { data: false, error: json.error ?? "Failed to delete product" };
  }
  return { data: true, error: null };
}
