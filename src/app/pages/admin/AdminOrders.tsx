"use client";
// ============================================================
// YAYA BABY – Admin Orders Page
// ============================================================
import { useEffect, useState } from "react";
import { Search, Eye, MessageCircle, Download, Filter, X } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/services/orders.service";
import type { Order, OrderStatus, OrderFilters } from "@/app/types";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "#FEF3C7", text: "#92400E" },
  confirmed:  { bg: "#DBEAFE", text: "#1E40AF" },
  processing: { bg: "#E0E7FF", text: "#4338CA" },
  shipped:    { bg: "#FDE8FF", text: "#86198F" },
  delivered:  { bg: "#D1FAE5", text: "#065F46" },
  cancelled:  { bg: "#FEE2E2", text: "#991B1B" },
};

const SOURCE_ICONS: Record<string, string> = {
  website: "🌐", whatsapp: "💬", instagram: "📸", facebook: "👥", phone: "📞",
};

export default function AdminOrders() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage]             = useState(1);

  useEffect(() => { loadOrders(); }, [search, statusFilter, page]);

  async function loadOrders() {
    setLoading(true);
    const filters: OrderFilters = {};
    if (search)       filters.search = search;
    if (statusFilter) filters.status = statusFilter;
    const res = await getOrders(filters, page, 15);
    setOrders(res.data);
    setTotal(res.total);
    setLoading(false);
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : null);
    }
  }

  const exportCSV = () => {
    const header = "Order,Customer,Phone,Date,Total,Status,Payment,Source";
    const rows = orders.map((o) =>
      `${o.order_number},${o.customer.name},${o.customer.phone},${o.date},${o.total},${o.status},${o.payment_status},${o.source}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `yaya-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#4A4238] text-2xl font-bold">Orders</h1>
          <p className="text-[#8a8378] text-sm">{total} total orders</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F5C71A] text-[#4A4238] rounded-full text-sm font-semibold hover:bg-[#F5C71A]/90 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8378]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search order, customer, phone…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#4A4238]/10 focus:border-[#F5C71A] rounded-[14px] outline-none text-[#4A4238] text-sm transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | ""); setPage(1); }}
          className="px-4 py-2.5 bg-white border-2 border-[#4A4238]/10 focus:border-[#F5C71A] rounded-[14px] outline-none text-[#4A4238] text-sm appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFFDF5]">
              <tr>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold">Order</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold">Customer</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold hidden md:table-cell">Items</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold">Total</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold">Status</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold hidden lg:table-cell">Payment</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold hidden lg:table-cell">Source</th>
                <th className="text-left text-[#4A4238] px-4 py-3 text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-[#8a8378]">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-[#8a8378]">No orders found</td></tr>
              ) : orders.map((order) => {
                const s = STATUS_STYLES[order.status];
                return (
                  <tr key={order.id} className="border-t border-[#4A4238]/5 hover:bg-[#FFFDF5]/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#4A4238] font-semibold text-xs">{order.order_number}</p>
                      <p className="text-[#8a8378] text-[11px]">{order.date}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#4A4238] font-medium text-xs">{order.customer.name}</p>
                      <p className="text-[#8a8378] text-[11px]">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[#4A4238] text-xs">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#F5C71A] font-bold text-xs">{order.total} EGP</p>
                      <p className={`text-[10px] font-medium ${order.payment_status === "paid" ? "text-[#22c55e]" : "text-[#92400E]"}`}>
                        {order.payment_status}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="text-[10px] font-semibold capitalize px-2 py-1 rounded-full cursor-pointer border-none outline-none"
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >
                        {STATUS_OPTIONS.map((st) => <option key={st} value={st} className="text-gray-800 bg-white">{st}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-medium ${order.payment_method === "cod" ? "text-[#92400E]" : "text-[#065F46]"}`}>
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs">{SOURCE_ICONS[order.source]} {order.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 hover:bg-[#FFFDF5] rounded-full transition-colors"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#4A4238]" />
                        </button>
                        <a
                          href={`https://wa.me/${order.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${order.customer.name}! Update on your Yaya order ${order.order_number}: `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-[#FFFDF5] rounded-full transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-[#4A4238]/5 flex items-center justify-between">
          <p className="text-[#8a8378] text-xs">Showing {orders.length} of {total}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-full bg-[#FFFDF5] text-[#4A4238] hover:bg-[#F5C71A]/20 transition-colors disabled:opacity-40"
            >Previous</button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={orders.length < 15}
              className="px-3 py-1.5 text-xs rounded-full bg-[#F5C71A] text-[#4A4238] hover:bg-[#F5C71A]/90 transition-colors disabled:opacity-40"
            >Next</button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#4A4238]/10 sticky top-0 bg-white rounded-t-[28px]">
              <div>
                <h3 className="text-[#4A4238] font-bold">{selectedOrder.order_number}</h3>
                <p className="text-[#8a8378] text-xs">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-[#8a8378]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Customer */}
              <div>
                <p className="text-[#4A4238] font-semibold text-sm mb-2">Customer</p>
                <div className="bg-[#FFFDF5] rounded-[16px] p-3 space-y-1">
                  <p className="text-[#4A4238] text-sm font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-[#8a8378] text-xs">{selectedOrder.customer.phone}</p>
                  <p className="text-[#8a8378] text-xs">
                    {[selectedOrder.customer.address_street, selectedOrder.customer.address_area, selectedOrder.customer.address_governorate].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
              {/* Items */}
              <div>
                <p className="text-[#4A4238] font-semibold text-sm mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-[#FFFDF5] rounded-[12px] p-2.5">
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-[10px] object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#4A4238] text-xs font-medium truncate">{item.product_name}</p>
                        <p className="text-[#8a8378] text-[11px]">{item.size} {item.color ? `· ${item.color}` : ""} × {item.quantity}</p>
                      </div>
                      <p className="text-[#F5C71A] text-sm font-bold">{item.price * item.quantity} EGP</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Summary */}
              <div className="bg-[#FFFDF5] rounded-[16px] p-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#4A4238]"><span>Subtotal</span><span>{selectedOrder.subtotal} EGP</span></div>
                <div className="flex justify-between text-[#4A4238]"><span>Shipping</span><span>{selectedOrder.shipping_fee} EGP</span></div>
                <div className="flex justify-between text-[#4A4238] font-bold border-t border-[#4A4238]/10 pt-1.5"><span>Total</span><span className="text-[#F5C71A]">{selectedOrder.total} EGP</span></div>
                <div className="flex justify-between text-[#8a8378] text-xs"><span>Profit</span><span className="text-[#22c55e] font-medium">{selectedOrder.profit} EGP</span></div>
              </div>
              {/* Status update */}
              <div>
                <p className="text-[#4A4238] font-semibold text-sm mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((st) => {
                    const s = STATUS_STYLES[st];
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedOrder.id, st)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                          selectedOrder.status === st ? "ring-2 ring-offset-1 ring-[#F5C71A]" : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >{st}</button>
                    );
                  })}
                </div>
              </div>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${selectedOrder.customer.name}! Your Yaya order ${selectedOrder.order_number} is now: ${selectedOrder.status} 💛`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-full font-bold text-sm hover:bg-[#25D366]/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Notify Customer via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
