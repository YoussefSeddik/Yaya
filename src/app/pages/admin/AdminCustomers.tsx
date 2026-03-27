"use client";
// ============================================================
// YAYA BABY – Admin Customers Page
// ============================================================
import { useEffect, useState, useCallback } from "react";
import {
  Search, Phone, Mail, MapPin, Package, User,
  ChevronRight, X, MessageCircle, ShoppingBag,
  TrendingUp, Calendar,
} from "lucide-react";
import { TeddyBear } from "../../components/Mascots";
import { getCustomers, getCustomerById } from "@/services/customers.service";
import { getOrders }                       from "@/services/orders.service";
import type { Customer, Order }            from "@/app/types";

// ── Helpers ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "#FEF3C7", text: "#92400E" },
  confirmed:  { bg: "#DBEAFE", text: "#1E40AF" },
  processing: { bg: "#E0E7FF", text: "#4338CA" },
  shipped:    { bg: "#FDE8FF", text: "#86198F" },
  delivered:  { bg: "#D1FAE5", text: "#065F46" },
  cancelled:  { bg: "#FEE2E2", text: "#991B1B" },
};

// ── Customer Detail Modal ─────────────────────────────────────
function CustomerModal({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders(undefined, 1, 100).then((res) => {
      // Filter orders by customer phone (mock data uses phone as identifier)
      const customerOrders = res.data.filter(
        (o) => o.customer.phone === customer.phone
      );
      setOrders(customerOrders);
      setLoading(false);
    });
  }, [customer.phone]);

  const totalSpent   = orders.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total, 0);
  const orderCount   = orders.length;
  const lastOrder    = orders[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4A4238]/10 sticky top-0 bg-white rounded-t-[28px]">
          <h2 className="text-[#4A4238] font-bold text-lg">Customer Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-[#4A4238]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#F5C71A]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <TeddyBear className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-[#4A4238] font-bold text-lg">{customer.name}</h3>
              {customer.email && (
                <p className="text-[#8a8378] text-xs flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {customer.email}
                </p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#FFFDF5] rounded-[20px] p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-[#F5C71A] flex-shrink-0" />
              <span className="text-[#4A4238]">{customer.phone}</span>
              <a
                href={`https://wa.me/${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${customer.name}! 👋 This is Yaya Baby.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto bg-[#25D366] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#25D366]/90 transition-colors"
              >
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            </div>
            {customer.address_governorate && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[#F5C71A] flex-shrink-0 mt-0.5" />
                <span className="text-[#4A4238]">
                  {[customer.address_street, customer.address_area, customer.address_governorate]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {customer.created_at && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-[#F5C71A] flex-shrink-0" />
                <span className="text-[#8a8378]">
                  Customer since {new Date(customer.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Orders",     value: orderCount.toString(),           icon: ShoppingBag, color: "#F5C71A" },
              { label: "Spent",      value: `${totalSpent.toLocaleString()} EGP`, icon: TrendingUp, color: "#EFAFD0" },
              { label: "Last Order", value: lastOrder ? lastOrder.date.slice(0, 7) : "—", icon: Calendar, color: "#F5C71A" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[#FFFDF5] rounded-[16px] p-3 text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5"
                  style={{ backgroundColor: `${color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[#4A4238] font-bold text-sm">{value}</p>
                <p className="text-[#8a8378] text-[11px]">{label}</p>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div>
            <h4 className="text-[#4A4238] font-semibold text-sm mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#F5C71A]" /> Order History
            </h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <TeddyBear className="w-8 h-8 animate-bounce" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-[#8a8378] text-sm text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => {
                  const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 bg-[#FFFDF5] rounded-[16px] px-4 py-3"
                    >
                      <div>
                        <p className="text-[#4A4238] text-xs font-semibold">{order.order_number}</p>
                        <p className="text-[#8a8378] text-[11px]">{order.date}</p>
                      </div>
                      <div className="flex-1" />
                      <span className="text-[#F5C71A] text-xs font-bold">{order.total} EGP</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >
                        {order.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AdminCustomers() {
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(false);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Customer | null>(null);

  const PAGE_SIZE = 10;

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const res = await getCustomers(q || undefined, p, PAGE_SIZE);
    setCustomers(res.data);
    setTotal(res.total);
    setHasMore(res.hasMore);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(search, page);
  }, [page]); // eslint-disable-line

  const handleSearch = () => {
    setPage(1);
    load(search, 1);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-[#4A4238] text-2xl font-bold">Customers</h1>
          <p className="text-[#8a8378] text-sm">{total} total customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#4A4238]/10 rounded-[16px] px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-[#8a8378] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name, phone, or email…"
            className="flex-1 bg-transparent outline-none text-[#4A4238] text-sm placeholder:text-[#8a8378]"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); load("", 1); }}>
              <X className="w-3.5 h-3.5 text-[#8a8378]" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#F5C71A] text-[#4A4238] px-5 py-2.5 rounded-[16px] font-semibold text-sm hover:bg-[#F5C71A]/90 transition-colors shadow-sm"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <TeddyBear className="w-10 h-10 animate-bounce" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <User className="w-10 h-10 text-[#8a8378] opacity-30" />
            <p className="text-[#8a8378] text-sm">No customers found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FFFDF5]">
                  <tr>
                    {["Customer", "Phone", "Location", "Joined", ""].map((h) => (
                      <th key={h} className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-[#4A4238]/5 hover:bg-[#FFFDF5]/70 transition-colors cursor-pointer"
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F5C71A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <TeddyBear className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[#4A4238] font-medium text-xs">{c.name}</p>
                            {c.email && <p className="text-[#8a8378] text-[11px]">{c.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[#4A4238] text-xs">{c.phone}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[#8a8378] text-xs">
                          {[c.address_area, c.address_governorate].filter(Boolean).join(", ") || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[#8a8378] text-xs">
                          {c.created_at
                            ? new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(c); }}
                          className="flex items-center gap-1 text-[#F5C71A] text-xs font-semibold hover:text-[#F5C71A]/80 transition-colors"
                        >
                          View <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#4A4238]/5">
              {customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFFDF5] transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-[#F5C71A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <TeddyBear className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#4A4238] font-medium text-sm truncate">{c.name}</p>
                    <p className="text-[#8a8378] text-xs">{c.phone}</p>
                    {c.address_governorate && (
                      <p className="text-[#8a8378] text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {c.address_governorate}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8a8378] flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#4A4238]/10">
              <p className="text-[#8a8378] text-xs">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-[10px] text-xs font-medium bg-[#FFFDF5] text-[#4A4238] disabled:opacity-40 hover:bg-[#F5C71A]/20 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                  className="px-3 py-1.5 rounded-[10px] text-xs font-medium bg-[#FFFDF5] text-[#4A4238] disabled:opacity-40 hover:bg-[#F5C71A]/20 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <CustomerModal customer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
