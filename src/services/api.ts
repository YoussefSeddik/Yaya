// ============================================================
// YAYA BABY – Base API Client
// Swap the mock layer for real Supabase/REST calls here.
// ============================================================

import type { ApiResponse } from "@/app/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Generic helper for future REST endpoints
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const err = await res.text();
      return { data: null, error: err };
    }
    const data: T = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// Delay helper for simulating async (remove in production)
export const delay = (ms = 300) =>
  new Promise<void>((r) => setTimeout(r, ms));
