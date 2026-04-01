"use client";
// ============================================================
// YAYA BABY – Admin Dashboard (Router shell + sidebar)
// ============================================================
import { useState } from "react";
import { Link } from "react-router";
import {
  Home, ShoppingBag, Package, Users, TrendingUp,
  Settings, ChevronRight, LogOut, Menu, X, ShieldCheck,
} from "lucide-react";
import { YayaLogo, TeddyBear, ChickA, ChickB, BearCub } from "../components/Mascots";
import { useAuth } from "@/store/AuthContext";
import AdminOverview   from "./admin/AdminOverview";
import AdminOrders     from "./admin/AdminOrders";
import AdminProducts   from "./admin/AdminProducts";
import AdminCustomers  from "./admin/AdminCustomers";
import AdminAnalytics  from "./admin/AdminAnalytics";
import AdminAdmins     from "./admin/AdminAdmins";

export type AdminTab = "dashboard" | "orders" | "products" | "customers" | "analytics" | "settings" | "admins";

const BASE_NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: Home        },
  { id: "orders",     label: "Orders",     icon: ShoppingBag },
  { id: "products",   label: "Products",   icon: Package     },
  { id: "customers",  label: "Customers",  icon: Users       },
  { id: "analytics",  label: "Analytics",  icon: TrendingUp  },
  { id: "settings",   label: "Settings",   icon: Settings    },
] as const;

const SUPER_ADMIN_NAV = {
  id: "admins", label: "Admins", icon: ShieldCheck,
} as const;

export default function AdminDashboard() {
  const [tab, setTab]                 = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, loading, logout }    = useAuth();

  const navItems = admin?.role === "super_admin"
    ? [...BASE_NAV, SUPER_ADMIN_NAV]
    : BASE_NAV;

  const renderContent = () => {
    switch (tab) {
      case "dashboard":  return <AdminOverview  setTab={setTab} />;
      case "orders":     return <AdminOrders />;
      case "products":   return <AdminProducts />;
      case "customers":  return <AdminCustomers />;
      case "analytics":  return <AdminAnalytics />;
      case "settings":   return <AdminSettings />;
      case "admins":     return admin?.role === "super_admin" ? <AdminAdmins /> : null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-[#4A4238]/10 flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#4A4238]/10 flex items-center justify-between">
          <div>
            <YayaLogo className="h-8" />
            <p className="text-[#8a8378] text-xs mt-1">Admin Panel</p>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4 text-[#8a8378]" />
          </button>
        </div>

        {/* Current user info */}
        {!loading && admin && (
          <div className="px-4 py-3 border-b border-[#4A4238]/10 bg-[#FFFDF5]">
            <p className="text-[#4A4238] text-xs font-semibold truncate">{admin.full_name || admin.email}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              admin.role === "super_admin"
                ? "bg-[#F5C71A]/20 text-[#92400E]"
                : "bg-[#EFAFD0]/30 text-[#86198F]"
            }`}>
              {admin.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id as AdminTab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] transition-colors text-left ${
                tab === id
                  ? "bg-[#F5C71A]/15 text-[#4A4238] font-semibold"
                  : "text-[#8a8378] hover:bg-[#FFFDF5] hover:text-[#4A4238]"
              }`}
            >
              <Icon className={`w-4 h-4 ${tab === id ? "text-[#F5C71A]" : ""}`} />
              <span className="text-sm">{label}</span>
              {tab === id && <ChevronRight className="w-3.5 h-3.5 text-[#F5C71A] ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-[#4A4238]/10 space-y-3">
          <div className="flex items-center justify-center gap-1">
            <TeddyBear className="w-7 h-7" />
            <ChickA    className="w-6 h-6" />
            <ChickB    className="w-7 h-7" />
            <BearCub   className="w-6 h-6" />
          </div>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-[#EFAFD0]/30 text-[#4A4238] hover:bg-[#EFAFD0]/50 transition-colors text-sm font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            View Store
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#4A4238]/10 flex items-center gap-3 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-[#4A4238]" />
          </button>
          <YayaLogo className="h-7" />
          <span className="text-[#8a8378] text-xs ml-auto capitalize">{tab}</span>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

function AdminSettings() {
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [storeName, setStoreName]   = useState("Yaya Baby");
  const [whatsapp, setWhatsapp]     = useState("+20 123 456 7890");
  const [shipping, setShipping]     = useState("50");

  const handleSave = async () => {
    setSaving(true);
    // Settings can be persisted to a Supabase settings table when needed
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-[#4A4238] text-2xl font-bold mb-2">Settings</h1>
      <p className="text-[#8a8378] mb-6">Store configuration</p>
      <div className="bg-white rounded-[24px] p-6 shadow-sm space-y-4 max-w-lg">
        <div>
          <label className="text-[#4A4238] text-sm font-medium block mb-1">Store Name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm"
          />
        </div>
        <div>
          <label className="text-[#4A4238] text-sm font-medium block mb-1">WhatsApp Number</label>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm"
          />
        </div>
        <div>
          <label className="text-[#4A4238] text-sm font-medium block mb-1">Default Shipping Fee (EGP)</label>
          <input
            type="number"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#F5C71A] text-[#4A4238] rounded-full font-bold text-sm hover:bg-[#F5C71A]/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
