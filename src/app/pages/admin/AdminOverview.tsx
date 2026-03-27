"use client";
// ============================================================
// YAYA BABY – Admin Overview (Dashboard home)
// ============================================================
import { useEffect, useState } from "react";
import {
  ShoppingBag, DollarSign, Users, Package,
  TrendingUp, AlertCircle, Eye, MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { TeddyBear, ChickA, ChickB, BearCub } from "../../components/Mascots";
import { getAdminStats }    from "@/services/analytics.service";
import { getOrders }        from "@/services/orders.service";
import type { AdminStats, Order } from "@/app/types";
import type { AdminTab }    from "../AdminDashboard";
import { updateOrderStatus } from "@/services/orders.service";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "#FEF3C7", text: "#92400E" },
  confirmed:  { bg: "#DBEAFE", text: "#1E40AF" },
  processing: { bg: "#E0E7FF", text: "#4338CA" },
  shipped:    { bg: "#FDE8FF", text: "#86198F" },
  delivered:  { bg: "#D1FAE5", text: "#065F46" },
  cancelled:  { bg: "#FEE2E2", text: "#991B1B" },
};

interface Props { setTab: (t: AdminTab) => void }

export default function AdminOverview({ setTab }: Props) {
  const [stats, setStats]   = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getOrders(undefined, 1, 5),
    ]).then(([s, o]) => {
      if (s.data) setStats(s.data);
      setOrders(o.data);
      setLoading(false);
    });
  }, []);

  const statCards = stats
    ? [
        { label: "Total Revenue",  value: `${stats.totalRevenue.toLocaleString()} EGP`, change: `+${stats.revenueChange}%`, icon: DollarSign, color: "#F5C71A" },
        { label: "Total Orders",   value: stats.totalOrders.toString(),                 change: `+${stats.ordersChange}%`,  icon: ShoppingBag, color: "#EFAFD0" },
        { label: "Customers",      value: stats.totalCustomers.toString(),               change: `+${stats.customersChange}%`,icon: Users,      color: "#F5C71A" },
        { label: "Active Products",value: stats.totalProducts.toString(),               change: "",                          icon: Package,     color: "#EFAFD0" },
      ]
    : [];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <TeddyBear className="w-12 h-12 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#4A4238] text-2xl font-bold">
          Welcome back! 👋
        </h1>
        <p className="text-[#8a8378] text-sm mt-0.5">Here's what's happening at Yaya today</p>
      </div>

      {/* Alerts */}
      {stats && stats.pendingOrders > 0 && (
        <div className="flex items-center gap-3 bg-[#FEF3C7] border border-[#F5C71A]/40 rounded-[16px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#92400E] flex-shrink-0" />
          <p className="text-[#92400E] text-sm font-medium">
            {stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? "s" : ""} need{stats.pendingOrders === 1 ? "s" : ""} attention
          </p>
          <button onClick={() => setTab("orders")} className="ml-auto text-[#92400E] text-xs font-semibold underline">
            View
          </button>
        </div>
      )}
      {stats && stats.lowStockCount > 0 && (
        <div className="flex items-center gap-3 bg-[#FEE2E2] border border-red-200 rounded-[16px] px-4 py-3">
          <Package className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm font-medium">
            {stats.lowStockCount} product{stats.lowStockCount !== 1 ? "s" : ""} running low on stock
          </p>
          <button onClick={() => setTab("products")} className="ml-auto text-red-600 text-xs font-semibold underline">
            Manage
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-[24px] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                {card.change && (
                  <span className="text-[#22c55e] text-xs font-semibold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />{card.change}
                  </span>
                )}
              </div>
              <p className="text-[#4A4238] text-xl font-bold">{card.value}</p>
              <p className="text-[#8a8378] text-xs mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#4A4238]/10">
          <h2 className="text-[#4A4238] font-semibold">Recent Orders</h2>
          <button
            onClick={() => setTab("orders")}
            className="text-[#F5C71A] text-xs font-semibold flex items-center gap-0.5 hover:text-[#F5C71A]/80 transition-colors"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFFDF5]">
              <tr>
                <th className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">Order</th>
                <th className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">Customer</th>
                <th className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold hidden sm:table-cell">Date</th>
                <th className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">Total</th>
                <th className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">Status</th>
                <th className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                return (
                  <tr key={order.id} className="border-t border-[#4A4238]/5 hover:bg-[#FFFDF5]/70 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-[#4A4238] font-medium text-xs">{order.order_number}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[#4A4238] font-medium text-xs">{order.customer.name}</p>
                      <p className="text-[#8a8378] text-[11px]">{order.customer.phone}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-[#8a8378] text-xs">{order.date}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[#F5C71A] font-bold text-xs">{order.total} EGP</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize"
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-[#FFFDF5] rounded-full transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5 text-[#4A4238]" />
                        </button>
                        <a
                          href={`https://wa.me/${order.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${order.customer.name}! Your Yaya order ${order.order_number} update:`)}`}
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
      </div>

      {/* Mascot footer */}
      <div className="flex items-center justify-center gap-2 py-2 text-[#8a8378] text-xs">
        <ChickA className="w-6 h-6" />
        <TeddyBear className="w-7 h-7" />
        <span>Made with love for babies 💛</span>
        <ChickB className="w-7 h-7" />
        <BearCub className="w-6 h-6" />
      </div>
    </div>
  );
}
