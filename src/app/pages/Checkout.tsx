"use client";
// ============================================================
// YAYA BABY – Checkout Page
// ============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ChevronLeft, MessageCircle, CreditCard, Banknote,
  CheckCircle, MapPin, Phone, User, Truck,
} from "lucide-react";
import { YayaLogo, TeddyBear } from "../components/Mascots";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "@/store/CartContext";
import { createOrder } from "@/services/orders.service";
import { EGYPT_GOVERNORATES, CAIRO_AREAS, ALEXANDRIA_AREAS, GIZA_AREAS } from "../data/mockData";
import type { PaymentMethod } from "@/app/types";

const AREA_MAP: Record<string, string[]> = {
  Cairo: CAIRO_AREAS,
  Alexandria: ALEXANDRIA_AREAS,
  Giza: GIZA_AREAS,
};

const SHIPPING_FEE = 50;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form state
  const [name, setName]               = useState("");
  const [phone, setPhone]             = useState("");
  const [street, setStreet]           = useState("");
  const [governorate, setGovernorate] = useState("");
  const [area, setArea]               = useState("");
  const [payment, setPayment]         = useState<PaymentMethod>("cod");
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const shipping = subtotal >= 500 ? 0 : SHIPPING_FEE;
  const total    = subtotal + shipping;
  const areas    = AREA_MAP[governorate] ?? [];

  const isValid = name.trim().length > 0 && phone.trim().length >= 10 && governorate.length > 0;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    const res = await createOrder(
      items,
      { name: name.trim(), phone: phone.trim(), address_street: street, address_area: area, address_governorate: governorate },
      payment,
      "website",
      shipping
    );
    setLoading(false);
    if (res.data) {
      setOrderNumber(res.data.order_number);
      setSuccess(true);
      clearCart();
    }
  };

  const handleWhatsApp = () => {
    const lines = items.map(
      (i) => `• ${i.name} (${i.size}${i.color ? `, ${i.color}` : ""}) ×${i.quantity} = ${i.price * i.quantity} EGP`
    );
    const msg = [
      `New Yaya Order 💛`,
      ``,
      `Customer: ${name}`,
      `Phone: ${phone}`,
      `Address: ${street ? street + ", " : ""}${area ? area + ", " : ""}${governorate}`,
      ``,
      `Items:`,
      ...lines,
      ``,
      `Subtotal: ${subtotal} EGP`,
      `Shipping: ${shipping === 0 ? "FREE" : shipping + " EGP"}`,
      `Total: ${total} EGP`,
      `Payment: ${payment === "cod" ? "Cash on Delivery" : payment}`,
    ].join("\n");
    window.open(`https://wa.me/201234567890?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // ── Success Screen ─────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-[#22c55e]/15 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-[#22c55e]" />
        </div>
        <h1 className="text-[#4A4238] text-2xl font-bold mb-2">Order Placed! 🎉</h1>
        <p className="text-[#8a8378] text-sm mb-1">Order #{orderNumber}</p>
        <p className="text-[#8a8378] text-sm mb-6">We'll confirm via WhatsApp shortly. Thank you!</p>
        <div className="flex gap-3">
          <TeddyBear className="w-12 h-12" />
          <div>
            <p className="text-[#4A4238] text-sm font-medium">Made with love for babies 💛</p>
            <p className="text-[#8a8378] text-xs">— Yaya Baby Team</p>
          </div>
        </div>
        <Link
          to="/"
          className="mt-8 bg-[#F5C71A] text-[#4A4238] px-8 py-3 rounded-full font-bold hover:bg-[#F5C71A]/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center gap-4 px-6">
        <TeddyBear className="w-20 h-20 opacity-50" />
        <p className="text-[#4A4238] font-medium">Your cart is empty</p>
        <Link to="/" className="text-[#F5C71A] font-medium">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-36">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/cart" className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#4A4238]" />
          </Link>
          <YayaLogo className="h-8" />
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <h1 className="text-[#4A4238] font-bold text-lg">Checkout</h1>

        {/* Cart Summary */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm">
          <p className="text-[#4A4238] font-semibold text-sm mb-3">Order Items ({items.length})</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.product_id}__${item.size}`} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-[12px] overflow-hidden bg-[#FFFDF5] flex-shrink-0">
                  <ImageWithFallback src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#4A4238] text-xs font-medium truncate">{item.name}</p>
                  <p className="text-[#8a8378] text-[11px]">{item.size}{item.color ? ` · ${item.color}` : ""} × {item.quantity}</p>
                </div>
                <p className="text-[#F5C71A] text-sm font-bold">{item.price * item.quantity} EGP</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Form */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          <h2 className="text-[#4A4238] font-semibold text-sm mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#F5C71A]" /> Delivery Information
          </h2>
          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-[#4A4238] text-xs font-medium mb-1 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8a8378]" /> Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sara Ahmed"
                className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[16px] outline-none text-[#4A4238] text-sm transition-colors"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="text-[#4A4238] text-xs font-medium mb-1 block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8a8378]" /> Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 1xx xxx xxxx"
                className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[16px] outline-none text-[#4A4238] text-sm transition-colors"
              />
            </div>
            {/* Street */}
            <div>
              <label className="text-[#4A4238] text-xs font-medium mb-1 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8a8378]" /> Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 15 El-Nasr St"
                className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[16px] outline-none text-[#4A4238] text-sm transition-colors"
              />
            </div>
            {/* Governorate */}
            <div>
              <label className="text-[#4A4238] text-xs font-medium mb-1 block">Governorate *</label>
              <select
                value={governorate}
                onChange={(e) => { setGovernorate(e.target.value); setArea(""); }}
                className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[16px] outline-none text-[#4A4238] text-sm transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Governorate</option>
                {EGYPT_GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {/* Area */}
            {areas.length > 0 && (
              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Area / District</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[16px] outline-none text-[#4A4238] text-sm transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select Area</option>
                  {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          <h2 className="text-[#4A4238] font-semibold text-sm mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#F5C71A]" /> Payment Method
          </h2>
          <div className="space-y-2">
            {[
              { value: "cod"      as PaymentMethod, label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
              { value: "instapay" as PaymentMethod, label: "InstaPay",          icon: CreditCard, desc: "Instant bank transfer" },
              { value: "transfer" as PaymentMethod, label: "Bank Transfer",     icon: CreditCard, desc: "Transfer before shipping" },
            ].map(({ value, label, icon: Icon, desc }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-3 rounded-[16px] cursor-pointer border-2 transition-all ${
                  payment === value ? "border-[#F5C71A] bg-[#F5C71A]/5" : "border-transparent bg-[#FFFDF5]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={payment === value}
                  onChange={() => setPayment(value)}
                  className="sr-only"
                />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${payment === value ? "bg-[#F5C71A]" : "bg-white"}`}>
                  <Icon className={`w-4 h-4 ${payment === value ? "text-[#4A4238]" : "text-[#8a8378]"}`} />
                </div>
                <div>
                  <p className="text-[#4A4238] text-sm font-medium">{label}</p>
                  <p className="text-[#8a8378] text-xs">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#4A4238]">
              <span>Subtotal</span><span>{subtotal} EGP</span>
            </div>
            <div className="flex justify-between text-[#4A4238]">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-[#22c55e] font-medium" : ""}>{shipping === 0 ? "FREE" : `${shipping} EGP`}</span>
            </div>
            <div className="border-t border-[#4A4238]/10 pt-2 flex justify-between">
              <span className="text-[#4A4238] font-bold">Total</span>
              <span className="text-[#F5C71A] font-bold text-lg">{total} EGP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4A4238]/10 px-4 py-3 safe-area-bottom z-40">
        <div className="max-w-lg mx-auto space-y-2">
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full bg-[#F5C71A] text-[#4A4238] py-4 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5C71A]/90 transition-colors"
          >
            {loading ? "Placing Order…" : `Confirm Order · ${total} EGP`}
          </button>
          <button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#25D366]/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Send via WhatsApp Instead
          </button>
        </div>
      </div>
    </div>
  );
}
