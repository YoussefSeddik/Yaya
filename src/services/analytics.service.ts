// ============================================================
// YAYA BABY – Analytics Service
// ============================================================

import { delay } from "./api";
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_DAILY_SALES } from "@/app/data/mockData";
import type { AdminStats, DailySales, ApiResponse } from "@/app/types";

export async function getAdminStats(): Promise<ApiResponse<AdminStats>> {
  await delay(200);

  const totalRevenue = MOCK_ORDERS.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total, 0);
  const totalProfit = MOCK_ORDERS.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.profit, 0);
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === "pending").length;
  const lowStockCount = MOCK_PRODUCTS.filter(p => p.stock > 0 && p.stock < 5).length;

  return {
    data: {
      totalRevenue,
      totalProfit,
      totalOrders: MOCK_ORDERS.length,
      pendingOrders,
      totalCustomers: MOCK_CUSTOMERS.length,
      totalProducts: MOCK_PRODUCTS.filter(p => p.is_active).length,
      lowStockCount,
      revenueChange: 18,
      ordersChange: 12,
      customersChange: 8,
    },
    error: null,
  };
}

export async function getDailySales(): Promise<ApiResponse<DailySales[]>> {
  await delay(150);
  return { data: MOCK_DAILY_SALES, error: null };
}

export async function getCategorySales(): Promise<ApiResponse<{ category: string; revenue: number; orders: number }[]>> {
  await delay(150);
  const map: Record<string, { revenue: number; orders: number }> = {};
  MOCK_ORDERS.forEach(order => {
    order.items.forEach(item => {
      const product = MOCK_PRODUCTS.find(p => p.id === item.product_id);
      const cat = product?.category ?? "Other";
      if (!map[cat]) map[cat] = { revenue: 0, orders: 0 };
      map[cat].revenue += item.price * item.quantity;
      map[cat].orders += item.quantity;
    });
  });
  const data = Object.entries(map).map(([category, vals]) => ({ category, ...vals }));
  return { data, error: null };
}
