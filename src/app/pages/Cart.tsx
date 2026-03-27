"use client";
// ============================================================
// YAYA BABY – Cart Page
// ============================================================
import { Link } from "react-router";
import {
  ChevronLeft, Trash2, ShoppingBag, Tag,
  ChevronRight, ShieldCheck, Truck,
} from "lucide-react";
import { YayaLogo, TeddyBear, ChickB } from "../components/Mascots";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "@/store/CartContext";
import { BottomNav } from "./Home";
import type { AgeSize } from "@/app/types";

const SHIPPING_FEE = 50;
const FREE_SHIPPING_THRESHOLD = 500;

export default function Cart() {
  const { items, subtotal, removeItem, updateQty, clearCart } = useCart();
  const shipping    = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total       = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] pb-24">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#4A4238]" />
            </Link>
            <YayaLogo className="h-8" />
            <div className="w-10" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <ChickB className="w-24 h-24 mb-4 opacity-60" />
          <h2 className="text-[#4A4238] text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-[#8a8378] text-sm mb-6">Add some adorable items for your little one!</p>
          <Link
            to="/categories"
            className="bg-[#F5C71A] text-[#4A4238] px-6 py-3 rounded-full font-bold hover:bg-[#F5C71A]/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
        <BottomNav active="cart" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-36">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#4A4238]" />
          </Link>
          <div className="text-center">
            <YayaLogo className="h-8" />
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#8a8378] hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#F5C71A]" />
          <h1 className="text-[#4A4238] font-bold text-lg">My Cart</h1>
          <span className="text-[#8a8378] text-sm font-normal">({items.length} item{items.length !== 1 ? "s" : ""})</span>
        </div>

        {/* Free shipping progress */}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="bg-[#F5C71A]/10 border border-[#F5C71A]/30 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-[#F5C71A]" />
              <span className="text-[#4A4238] text-xs font-medium">
                Add {FREE_SHIPPING_THRESHOLD - subtotal} EGP more for free shipping!
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#F5C71A] rounded-full transition-all"
                style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {subtotal >= FREE_SHIPPING_THRESHOLD && (
          <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#22c55e]" />
            <span className="text-[#22c55e] text-xs font-medium">🎉 You unlocked free shipping!</span>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.product_id}__${item.size}`} className="bg-white rounded-[24px] p-4 shadow-sm">
              <div className="flex gap-3">
                <Link to={`/product/${item.product_id}`} className="flex-shrink-0 w-20 h-20 rounded-[16px] overflow-hidden bg-[#FFFDF5]">
                  <ImageWithFallback
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="text-[#4A4238] text-sm font-semibold mb-0.5 line-clamp-2 hover:text-[#F5C71A] transition-colors">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#FFFDF5] text-[#4A4238] text-[11px] font-medium px-2 py-0.5 rounded-full border border-[#4A4238]/10">
                      {item.size}
                    </span>
                    {item.color && (
                      <span className="text-[#8a8378] text-[11px]">{item.color}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5C71A] font-bold">{item.price * item.quantity} EGP</span>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.product_id, item.size as AgeSize, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-[#FFFDF5] text-[#4A4238] flex items-center justify-center hover:bg-[#F5C71A] transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="text-[#4A4238] font-bold w-4 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product_id, item.size as AgeSize, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 rounded-full bg-[#FFFDF5] text-[#4A4238] flex items-center justify-center hover:bg-[#F5C71A] transition-colors font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product_id, item.size as AgeSize)}
                  className="flex-shrink-0 p-1.5 text-[#8a8378] hover:text-red-400 transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          <h3 className="text-[#4A4238] font-semibold text-sm mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#F5C71A]" /> Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#4A4238]">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{subtotal} EGP</span>
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

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 text-[#8a8378] text-xs">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#F5C71A]" />
            <span>Fast delivery</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4A4238]/10 px-4 py-3 safe-area-bottom z-40">
        <div className="max-w-lg mx-auto">
          <Link
            to="/checkout"
            className="w-full bg-[#F5C71A] text-[#4A4238] py-4 rounded-full font-bold hover:bg-[#F5C71A]/90 transition-colors shadow-sm flex items-center justify-center gap-2 text-center"
          >
            Proceed to Checkout · {total} EGP
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <BottomNav active="cart" />
    </div>
  );
}
