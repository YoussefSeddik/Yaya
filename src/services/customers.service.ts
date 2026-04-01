// ============================================================
// YAYA BABY – Customers Service (real Supabase via API routes)
// ============================================================
import type { Customer, ApiResponse, PaginatedResponse } from "@/app/types";

const BASE = "/api/customers";

export async function getCustomers(
  search?: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Customer>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (search) params.set("search", search);

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) return { data: [], total: 0, page, pageSize, hasMore: false };
  return res.json();
}

export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) return { data: null, error: "Customer not found" };
  const json = await res.json();
  return { data: json.data, error: null };
}

export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at">
): Promise<ApiResponse<Customer>> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error ?? "Failed to create customer" };
  return { data: json.data, error: null };
}

export async function updateCustomer(
  id: string,
  updates: Partial<Customer>
): Promise<ApiResponse<Customer>> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) return { data: null, error: json.error ?? "Failed to update customer" };
  return { data: json.data, error: null };
}

export async function deleteCustomer(id: string): Promise<ApiResponse<boolean>> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    return { data: false, error: json.error ?? "Failed to delete customer" };
  }
  return { data: true, error: null };
}
