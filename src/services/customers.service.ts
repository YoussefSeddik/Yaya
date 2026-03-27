// ============================================================
// YAYA BABY – Customers Service
// ============================================================

import { delay } from "./api";
import { MOCK_CUSTOMERS } from "@/app/data/mockData";
import type { Customer, ApiResponse, PaginatedResponse } from "@/app/types";

export async function getCustomers(
  search?: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Customer>> {
  await delay(200);
  let results = [...MOCK_CUSTOMERS];
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }
  const total = results.length;
  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);
  return { data, total, page, pageSize, hasMore: start + pageSize < total };
}

export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  await delay(150);
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
  return customer
    ? { data: customer, error: null }
    : { data: null, error: "Customer not found" };
}
