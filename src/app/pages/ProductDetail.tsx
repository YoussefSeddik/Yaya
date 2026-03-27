"use client";
// ============================================================
// YAYA BABY – Product Detail Page
// ============================================================
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ChevronLeft, Heart, Share2, MessageCircle,
  ShoppingCart, CheckCircle, Package, Leaf, Droplets,
  ChevronRight,
} from "lucide-react";
import { YayaLogo, TeddyBear, ChickA, ChickB, BearCub } from "../components/Mascots";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart }     from "@/store/CartContext";
import { useWishlist } from "@/store/WishlistContext";
import { getProductById } from "@/services/products.service";
import type { Product, AgeSize } from "@/app/types";

const MASCOT_BY_SIZE: Record<string, React.ComponentType<{ className?: string }>> = {
  "0-3M": TeddyBear, "3-6M": ChickA, "6-12M": ChickB, "12-18M": BearCub, "18-24M": BearCub,
};

// Toast notification helper
function AddedToast({ name, onClose }: { name: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-28 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="bg-[#4A4238] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium animate-in slide-in-from-bottom-4 fade-in duration-300">
        <CheckCircle className="w-4 h-4 text-[#F5C71A]" />
        {name} added to cart!
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct]             = useState<Product | null>(null);
  const [loading, setLoading]             = useState(true);
  const [selectedSize, setSelectedSize]   = useState<AgeSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentImg, setCurrentImg]       = useState(0);
  const [showToast, setShowToast]         = useState(false);
  const [toastMsg, setToastMsg]           = useState("");

  const { addItem }                        = useCart();
  const { toggleItem, isWished }           = useWishlist();

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id]);

  async function loadProduct(productId: string) {
    setLoading(true);
    const res = await getProductById(productId);
    if (res.data) {
      setProduct(res.data);
      setSelectedSize(res.data.sizes[0] ?? null);
      setSelectedColor(res.data.colors[0] ?? null);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <TeddyBear className="w-16 h-16 animate-bounce" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center gap-4 px-6">
        <ChickB className="w-20 h-20 opacity-50" />
        <p className="text-[#4A4238] font-medium">Product not found</p>
        <Link to="/" className="text-[#F5C71A] font-medium">← Back to Home</Link>
      </div>
    );
  }

  const images  = product.images?.length ? product.images : [product.image_url];
  const Mascot  = MASCOT_BY_SIZE[product.sizes[0]] ?? TeddyBear;
  const wished  = isWished(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor ?? undefined);
    setToastMsg(product.name);
    setShowToast(true);
  };

  const handleWhatsApp = () => {
    const msg = `Hi! I'd like to order:\n*${product.name}*\nSize: ${selectedSize}\nColor: ${selectedColor ?? "N/A"}\nPrice: ${product.price} EGP\n\nPlease confirm availability 🙏`;
    window.open(`https://wa.me/201234567890?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-36">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#4A4238]" />
          </Link>
          <YayaLogo className="h-8" />
          <div className="flex items-center gap-1">
            <button
              className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href });
                }
              }}
            >
              <Share2 className="w-5 h-5 text-[#4A4238]" />
            </button>
            <button
              onClick={() => toggleItem(product)}
              className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors"
            >
              <Heart className={`w-5 h-5 ${wished ? "fill-[#EFAFD0] text-[#EFAFD0]" : "text-[#4A4238]"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <section className="relative bg-white">
        <div className="aspect-square overflow-hidden">
          <ImageWithFallback
            src={images[currentImg]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Mascot badge */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
          <Mascot className="w-8 h-8" />
        </div>
        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 py-3 bg-white">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImg(idx)}
                className={`w-12 h-12 rounded-[12px] overflow-hidden border-2 transition-all ${
                  idx === currentImg ? "border-[#F5C71A]" : "border-transparent opacity-60"
                }`}
              >
                <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Product Info */}
      <section className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          {/* Name & Price */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-3">
              <h1 className="text-[#4A4238] text-xl font-bold leading-tight mb-1">{product.name}</h1>
              <p className="text-[#8a8378] text-sm">{product.category} · {product.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-[#F5C71A] text-2xl font-bold">{product.price} EGP</p>
              {product.stock > 0 ? (
                <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full">
                  {product.stock < 5 ? `Only ${product.stock} left!` : "In Stock"}
                </span>
              ) : (
                <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
              )}
            </div>
          </div>

          <p className="text-[#4A4238]/70 text-sm leading-relaxed mb-4">{product.description}</p>

          {/* Size Selector */}
          <div className="mb-4">
            <label className="text-[#4A4238] text-sm font-semibold mb-2 block">
              Age / Size <span className="font-normal text-[#8a8378]">(select one)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "bg-[#F5C71A] border-[#F5C71A] text-[#4A4238]"
                      : "bg-white border-[#4A4238]/20 text-[#4A4238] hover:border-[#F5C71A]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="mb-4">
              <label className="text-[#4A4238] text-sm font-semibold mb-2 block">
                Color <span className="font-normal text-[#8a8378]">— {selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                      selectedColor === color
                        ? "border-[#F5C71A] text-[#4A4238] font-medium bg-[#F5C71A]/10"
                        : "border-[#4A4238]/15 text-[#8a8378] hover:border-[#F5C71A]/50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm">
          <h3 className="text-[#4A4238] font-semibold text-sm mb-3">Product Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F5C71A]/15 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#F5C71A]" />
              </div>
              <span className="text-[#4A4238] text-sm">{product.material ?? "100% GOTS Organic Cotton"}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#EFAFD0]/30 rounded-full flex items-center justify-center">
                <Droplets className="w-4 h-4 text-[#EFAFD0]" />
              </div>
              <span className="text-[#4A4238] text-sm">Hand wash · Dry flat · Low iron</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F5C71A]/15 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-[#F5C71A]" />
              </div>
              <span className="text-[#4A4238] text-sm">Free shipping over 500 EGP</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb / Related */}
        <div className="flex items-center gap-2 text-sm text-[#8a8378]">
          <Link to="/" className="hover:text-[#F5C71A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/categories" className="hover:text-[#F5C71A] transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#4A4238] truncate max-w-[120px]">{product.name}</span>
        </div>
      </section>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4A4238]/10 px-4 py-3 safe-area-bottom z-40">
        <div className="max-w-md mx-auto space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || product.stock === 0}
            className="w-full bg-[#F5C71A] text-[#4A4238] py-4 rounded-full font-bold hover:bg-[#F5C71A]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart · {product.price} EGP
          </button>
          <button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white py-3.5 rounded-full font-bold hover:bg-[#25D366]/90 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Order via WhatsApp
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && <AddedToast name={toastMsg} onClose={() => setShowToast(false)} />}
    </div>
  );
}
