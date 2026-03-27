"use client";
// ============================================================
// YAYA BABY – Account / Profile Page
// ============================================================
import { Link } from "react-router";
import {
  User, Package, Heart, MapPin, Bell, HelpCircle,
  ChevronRight, LogIn, Phone, Mail, Shield, Star,
  ExternalLink,
} from "lucide-react";
import { YayaLogo, TeddyBear, ChickA, ChickB, BearCub } from "../components/Mascots";
import { useCart }     from "@/store/CartContext";
import { useWishlist } from "@/store/WishlistContext";
import { BottomNav }   from "./Home";

const MENU_ITEMS = [
  { icon: Package,     label: "My Orders",           sublabel: "Track and manage orders", to: "/orders", color: "#F5C71A" },
  { icon: Heart,       label: "Saved Items",          sublabel: "Your wishlist",            to: "/wishlist", color: "#EFAFD0" },
  { icon: MapPin,      label: "Delivery Addresses",   sublabel: "Manage addresses",         to: "/addresses", color: "#F5C71A" },
  { icon: Bell,        label: "Notifications",        sublabel: "Order updates & offers",   to: "/notifications", color: "#EFAFD0" },
  { icon: HelpCircle,  label: "Help & Support",       sublabel: "Chat with us on WhatsApp", to: "https://wa.me/201234567890", external: true, color: "#25D366" },
  { icon: Shield,      label: "Privacy & Policy",     sublabel: "How we handle your data",  to: "/privacy", color: "#4A4238" },
] as const;

const BRAND_INFO = [
  { icon: Star,   text: "100% GOTS Organic Cotton – safe for newborns" },
  { icon: Shield, text: "Certified GOTS – eco-friendly & chemical-free" },
  { icon: Phone,  text: "+2 0123 456 7890" },
  { icon: Mail,   text: "@yayababy on Instagram & TikTok" },
];

export default function Account() {
  const { itemCount }    = useCart();
  const { count }        = useWishlist();

  // Guest state (no auth implemented yet – placeholder UI)
  const isGuest = true;

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-10" />
          <YayaLogo className="h-8" />
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          {isGuest ? (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-[#FFFDF5] rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-[#8a8378]" />
              </div>
              <h2 className="text-[#4A4238] font-bold text-lg mb-1">Hello, Guest!</h2>
              <p className="text-[#8a8378] text-sm mb-4">Sign in to track orders and save your details</p>
              <button className="w-full bg-[#F5C71A] text-[#4A4238] py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#F5C71A]/90 transition-colors">
                <LogIn className="w-4 h-4" />
                Sign In / Sign Up
              </button>
              <p className="text-[#8a8378] text-xs mt-3">
                Or order directly via{" "}
                <a href="https://wa.me/201234567890" className="text-[#25D366] font-medium">WhatsApp</a>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F5C71A]/20 rounded-full flex items-center justify-center">
                <TeddyBear className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-[#4A4238] font-bold text-lg">Sara Ahmed</h2>
                <p className="text-[#8a8378] text-sm">sara@example.com</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/cart" className="bg-white rounded-[24px] p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#F5C71A]/15 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-[#F5C71A]" />
            </div>
            <div>
              <p className="text-[#4A4238] font-bold text-xl">{itemCount}</p>
              <p className="text-[#8a8378] text-xs">Cart Items</p>
            </div>
          </Link>
          <Link to="/wishlist" className="bg-white rounded-[24px] p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#EFAFD0]/30 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#EFAFD0]" />
            </div>
            <div>
              <p className="text-[#4A4238] font-bold text-xl">{count}</p>
              <p className="text-[#8a8378] text-xs">Saved Items</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-[28px] overflow-hidden shadow-sm">
          {MENU_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === MENU_ITEMS.length - 1;
            const Inner = (
              <div className={`flex items-center gap-3 px-5 py-4 hover:bg-[#FFFDF5] transition-colors ${!isLast ? "border-b border-[#4A4238]/5" : ""}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#4A4238] text-sm font-medium">{item.label}</p>
                  <p className="text-[#8a8378] text-xs">{item.sublabel}</p>
                </div>
                {(item as { external?: boolean }).external ? (
                  <ExternalLink className="w-4 h-4 text-[#8a8378]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8a8378]" />
                )}
              </div>
            );
            if ((item as { external?: boolean }).external) {
              return (
                <a key={item.label} href={item.to} target="_blank" rel="noopener noreferrer">
                  {Inner}
                </a>
              );
            }
            return <Link key={item.label} to={item.to}>{Inner}</Link>;
          })}
        </div>

        {/* Brand Info Card */}
        <div className="bg-gradient-to-br from-[#F5C71A]/10 to-[#EFAFD0]/10 rounded-[28px] p-5 border border-[#F5C71A]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              <ChickA className="w-8 h-8" />
              <TeddyBear className="w-8 h-8 -ml-1" />
              <ChickB className="w-8 h-8 -ml-1" />
              <BearCub className="w-8 h-8 -ml-1" />
            </div>
            <div>
              <p className="text-[#4A4238] font-bold text-sm">Yaya Baby</p>
              <p className="text-[#8a8378] text-xs">made with love for babies 💛</p>
            </div>
          </div>
          <div className="space-y-2">
            {BRAND_INFO.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-[#4A4238]">
                <Icon className="w-3.5 h-3.5 text-[#F5C71A] flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="account" />
    </div>
  );
}
