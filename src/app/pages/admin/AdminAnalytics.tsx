"use client";
// ============================================================
// YAYA BABY – Admin Analytics Page
// ============================================================
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, DollarSign, ShoppingBag, Package,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { TeddyBear } from "../../components/Mascots";
import { getDailySales, getCategorySales, getAdminStats } from "@/services/analytics.service";
import type { DailySales, AdminStats } from "@/app/types";

// ── Brand palette for charts ──────────────────────────────────
const CHART_COLORS = ["#F5C71A", "#EFAFD0", "#4A4238", "#22c55e", "#818cf8", "#fb923c"];

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#4A4238]/10 rounded-[14px] shadow-lg px-4 py-3 text-xs">
      <p className="text-[#8a8378] mb-1.5 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" && entry.name.toLowerCase().includes("egp")
            ? entry.value.toLocaleString()
            : entry.value.toLocaleString()} {entry.name.toLowerCase().includes("orders") ? "" : "EGP"}
        </p>
      ))}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({
  label, value, change, positive, icon: Icon, color,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}25` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 ${positive ? "text-[#22c55e]" : "text-red-500"}`}
          >
            {positive
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-[#4A4238] text-xl font-bold">{value}</p>
      <p className="text-[#8a8378] text-xs mt-0.5">{label}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AdminAnalytics() {
  const [stats, setStats]       = useState<AdminStats | null>(null);
  const [daily, setDaily]       = useState<DailySales[]>([]);
  const [catSales, setCatSales] = useState<{ category: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getDailySales(),
      getCategorySales(),
    ]).then(([s, d, c]) => {
      if (s.data) setStats(s.data);
      if (d.data) setDaily(d.data);
      if (c.data) setCatSales(c.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <TeddyBear className="w-12 h-12 animate-bounce" />
      </div>
    );
  }

  // Derived: profit margin per day
  const dailyWithMargin = daily.map((d) => ({
    ...d,
    margin: d.revenue > 0 ? Math.round((d.profit / d.revenue) * 100) : 0,
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#4A4238] text-2xl font-bold">Analytics</h1>
        <p className="text-[#8a8378] text-sm mt-0.5">Last 14 days performance overview</p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Revenue"
            value={`${stats.totalRevenue.toLocaleString()} EGP`}
            change={`+${stats.revenueChange}%`}
            positive
            icon={DollarSign}
            color="#F5C71A"
          />
          <StatCard
            label="Total Profit"
            value={`${stats.totalProfit.toLocaleString()} EGP`}
            change={`${Math.round((stats.totalProfit / Math.max(stats.totalRevenue, 1)) * 100)}% margin`}
            positive
            icon={TrendingUp}
            color="#EFAFD0"
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders.toString()}
            change={`+${stats.ordersChange}%`}
            positive
            icon={ShoppingBag}
            color="#F5C71A"
          />
          <StatCard
            label="Active Products"
            value={stats.totalProducts.toString()}
            change=""
            positive
            icon={Package}
            color="#EFAFD0"
          />
        </div>
      )}

      {/* Revenue & Profit Line Chart */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm">
        <h2 className="text-[#4A4238] font-semibold mb-4">Revenue vs Profit (EGP)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyWithMargin} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A4238" strokeOpacity={0.06} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8a8378", fontSize: 10 }}
              tickFormatter={(d) => d.slice(5)} // MM-DD
            />
            <YAxis tick={{ fill: "#8a8378", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#4A4238", paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue EGP"
              stroke="#F5C71A"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#F5C71A" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit EGP"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3, fill: "#22c55e" }}
              activeDot={{ r: 5 }}
              strokeDasharray="5 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Bar Chart */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm">
        <h2 className="text-[#4A4238] font-semibold mb-4">Daily Orders</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={daily} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A4238" strokeOpacity={0.06} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8a8378", fontSize: 10 }}
              tickFormatter={(d) => d.slice(5)}
            />
            <YAxis tick={{ fill: "#8a8378", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orders" name="Orders" fill="#F5C71A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: Pie + Top Categories table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm">
          <h2 className="text-[#4A4238] font-semibold mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={catSales}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {catSales.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()} EGP`, "Revenue"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Table */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm">
          <h2 className="text-[#4A4238] font-semibold mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {catSales.map((row, i) => {
              const maxRev = Math.max(...catSales.map((r) => r.revenue));
              const pct = maxRev > 0 ? (row.revenue / maxRev) * 100 : 0;
              return (
                <div key={row.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-[#4A4238] text-xs font-medium">{row.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#F5C71A] text-xs font-bold">{row.revenue.toLocaleString()} EGP</span>
                      <span className="text-[#8a8378] text-[11px] ml-2">({row.orders} units)</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#FFFDF5] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profit Margin Trend */}
      <div className="bg-white rounded-[24px] p-5 shadow-sm">
        <h2 className="text-[#4A4238] font-semibold mb-4">Profit Margin % Trend</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={dailyWithMargin} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A4238" strokeOpacity={0.06} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8a8378", fontSize: 10 }}
              tickFormatter={(d) => d.slice(5)}
            />
            <YAxis tick={{ fill: "#8a8378", fontSize: 10 }} unit="%" domain={[0, 100]} />
            <Tooltip formatter={(v: number) => [`${v}%`, "Margin"]} />
            <Line
              type="monotone"
              dataKey="margin"
              name="Margin %"
              stroke="#EFAFD0"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#EFAFD0" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
