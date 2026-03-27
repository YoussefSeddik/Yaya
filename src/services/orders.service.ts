// ============================================================
// YAYA BABY – Orders Service
// ============================================================

import { delay } from "./api";
import { MOCK_ORDERS } from "@/app/data/mockData";
import type { Order, ApiResponse, PaginatedResponse, OrderFilters, CartItem, Customer } from "@/app/types";

// ── Read ──────────────────────────────────────────────────────
export async function getOrders(
  filters?: OrderFilters,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Order>> {
  await delay(200);

  let results = [...MOCK_ORDERS];

  if (filters?.status) {
    results = results.filter((o) => o.status === filters.status);
  }
  if (filters?.payment_status) {
    results = results.filter((o) => o.payment_status === filters.payment_status);
  }
  if (filters?.source) {
    results = results.filter((o) => o.source === filters.source);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
    );
  }

  // Sort newest first
  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = results.length;
  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);

  return { data, total, page, pageSize, hasMore: start + pageSize < total };
}

export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  await delay(150);
  const order = MOCK_ORDERS.find((o) => o.id === id);
  return order
    ? { data: order, error: null }
    : { data: null, error: "Order not found" };
}

// ── Create ────────────────────────────────────────────────────
export async function createOrder(
  cartItems: CartItem[],
  customer: Omit<Customer, "id" | "created_at">,
  paymentMethod: Order["payment_method"],
  source: Order["source"],
  shippingFee = 50
): Promise<ApiResponse<Order>> {
  await delay(600);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;
  const totalCost = cartItems.reduce((s, i) => s + (i.price * 0.45) * i.quantity, 0);

  const orderNumber = `YYA-${1000 + MOCK_ORDERS.length + 1}`;
  const customerId = `c${Date.now()}`;

  const newOrder: Order = {
    id: `o${Date.now()}`,
    order_number: orderNumber,
    customer_id: customerId,
    customer: { id: customerId, ...customer },
    items: cartItems.map((item, i) => ({
      id: `oi${Date.now()}_${i}`,
      order_id: `o${Date.now()}`,
      product_id: item.product_id,
      product_name: item.name,
      product_image: item.image_url,
      quantity: item.quantity,
      price: item.price,
      cost: item.price * 0.45,
      size: item.size,
      color: item.color,
    })),
    status: "pending",
    subtotal,
    shipping_fee: shippingFee,
    total,
    total_cost: totalCost,
    profit: total - totalCost - shippingFee,
    payment_method: paymentMethod,
    payment_status: paymentMethod === "cod" ? "unpaid" : "paid",
    source,
    date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  };

  MOCK_ORDERS.unshift(newOrder);
  return { data: newOrder, error: null };
}

// ── Update Status ─────────────────────────────────────────────
export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<ApiResponse<Order>> {
  await delay(300);
  const idx = MOCK_ORDERS.findIndex((o) => o.id === id);
  if (idx === -1) return { data: null, error: "Order not found" };
  MOCK_ORDERS[idx] = {
    ...MOCK_ORDERS[idx],
    status,
    ...(status === "shipped" ? { shipped_at: new Date().toISOString() } : {}),
    ...(status === "delivered" ? { delivered_at: new Date().toISOString() } : {}),
  };
  return { data: MOCK_ORDERS[idx], error: null };
}
