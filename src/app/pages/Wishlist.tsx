"use client";
// ============================================================
// YAYA BABY – Wishlist Page
// ============================================================
import { Link } from "react-router";
import { ChevronLeft, Heart, ShoppingCart, X } from "lucide-react";
import { YayaLogo, BearCub, TeddyBear } from "../components/Mascots";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useWishlist } from "@/store/WishlistContext";
import { useCart }     from "@/store/CartContext";
import { MOCK_PRODUCTS } from "../data/mockData";
import { BottomNav } from "./Home";
import type { AgeSize } from "@/app/types";

export default function Wishlist() {
  const { items, removeItem, clearAll } = useWishlist();
  const { addItem }                      = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] pb-24">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="p-2 hover:bg-[#FFFDF5] rounded-full">
              <ChevronLeft className="w-5 h-5 text-[#4A4238]" />
            </Link>
            <YayaLogo className="h-8" />
            <div className="w-10" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <BearCub className="w-24 h-24 mb-4 opacity-60" />
          <h2 className="text-[#4A4238] text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-[#8a8378] text-sm mb-6">Save items you love and come back to them later 💛</p>
          <Link
            to="/categories"
            className="bg-[#EFAFD0] text-[#4A4238] px-6 py-3 rounded-full font-bold hover:bg-[#EFAFD0]/80 transition-colors"
          >
            Browse Products
          </Link>
        </div>
        <BottomNav active="wishlist" />
      </div>
    );
  }

  const handleAddToCart = (productId: string, size: AgeSize) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (product) addItem(product, size);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-24">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="p-2 hover:bg-[#FFFDF5] rounded-full">
            <ChevronLeft className="w-5 h-5 text-[#4A4238]" />
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#EFAFD0] fill-[#EFAFD0]" />
            <YayaLogo className="h-8" />
          </div>
          {items.length > 0 && (
            <button onClick={clearAll} className="text-xs text-[#8a8378] hover:text-red-400 transition-colors">
              Clear all
            </button>
          )}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-[#EFAFD0] fill-[#EFAFD0]" />
          <h1 className="text-[#4A4238] font-bold text-lg">Saved Items</h1>
          <span className="text-[#8a8378] text-sm font-normal">({items.length})</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <Link key={item.product_id} to={`/product/${item.product_id}`} className="group block">
              <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
                <div className="relative aspect-square overflow-hidden bg-[#FFFDF5]">
                  <ImageWithFallback
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(item.product_id); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-[#8a8378]" />
                  </button>
                  {/* Heart badge */}
                  <div className="absolute top-2 left-2 w-6 h-6 bg-[#EFAFD0] rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-[#4A4238] text-sm font-medium mb-0.5 line-clamp-2 leading-tight">{item.name}</h4>
                  <p className="text-[#8a8378] text-[11px] mb-2">{item.sizes.join(" · ")}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5C71A] font-bold text-sm">{item.price} EGP</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item.product_id, item.sizes[0] ?? "0-3M");
                      }}
                      className="w-7 h-7 bg-[#F5C71A] rounded-full flex items-center justify-center hover:bg-[#F5C71A]/80 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-[#4A4238]" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-[#F5C71A] font-medium text-sm hover:text-[#F5C71A]/80 transition-colors"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>

      <BottomNav active="wishlist" />
    </div>
  );
}
