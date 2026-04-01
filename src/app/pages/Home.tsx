"use client";
// ============================================================
// YAYA BABY – Home / Storefront Page
// ============================================================
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ShoppingCart, Heart, User, Home as HomeIcon, Grid3x3,
  Search, X, ChevronRight, Flame,
} from "lucide-react";
import { YayaLogo, ChickA, TeddyBear, ChickB, BearCub } from "../components/Mascots";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart }     from "@/store/CartContext";
import { useWishlist } from "@/store/WishlistContext";
import { getProducts } from "@/services/products.service";
import type { Product, AgeSize } from "@/app/types";

// ── Brand constants ───────────────────────────────────────────
const brandImage = "/assets/brand-hero.png";

const AGE_CATEGORIES: { label: string; size?: AgeSize; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "0–3M",  size: "0-3M",  icon: TeddyBear },
  { label: "3–6M",  size: "3-6M",  icon: ChickA   },
  { label: "6–12M", size: "6-12M", icon: ChickB   },
  { label: "12–18M",size: "12-18M",icon: BearCub  },
];



// ── Bottom Nav Items ──────────────────────────────────────────
function BottomNav({ active }: { active: "home" | "categories" | "cart" | "wishlist" | "account" }) {
  const { itemCount }  = useCart();
  const { count }      = useWishlist();

  const items = [
    { id: "home",       to: "/",           icon: HomeIcon,    label: "Home" },
    { id: "categories", to: "/categories", icon: Grid3x3,     label: "Categories" },
    { id: "cart",       to: "/cart",       icon: ShoppingCart,label: "Cart",    badge: itemCount },
    { id: "wishlist",   to: "/wishlist",   icon: Heart,       label: "Saved",   badge: count },
    { id: "account",    to: "/account",    icon: User,        label: "Account" },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#4A4238]/10 safe-area-bottom z-50">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 min-w-[60px] py-1 transition-colors ${
                isActive ? "text-[#F5C71A]" : "text-[#8a8378]"
              }`}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-[#F5C71A]/15" : ""
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {(item as { badge?: number }).badge ? (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#EFAFD0] text-[#4A4238] text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {(item as { badge?: number }).badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const { addItem }      = useCart();
  const { toggleItem, isWished } = useWishlist();
  const wished = isWished(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0] ?? "0-3M");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const MascotMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "0-3M": TeddyBear, "3-6M": ChickA, "6-12M": ChickB, "12-18M": BearCub, "18-24M": BearCub,
  };
  const Mascot = MascotMap[product.sizes[0]] ?? TeddyBear;
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#FFFDF5]">
          <ImageWithFallback
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <span className="bg-[#F5C71A] text-[#4A4238] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5" /> New
              </span>
            )}
            {isLowStock && (
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {product.stock} left!
              </span>
            )}
          </div>
          {/* Mascot badge */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Mascot className="w-6 h-6" />
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wished ? "fill-[#EFAFD0] text-[#EFAFD0]" : "text-[#4A4238]"
              }`}
            />
          </button>
        </div>
        {/* Info */}
        <div className="p-3">
          <h4 className="text-[#4A4238] text-sm font-medium mb-1 line-clamp-2 leading-tight">{product.name}</h4>
          <p className="text-[#8a8378] text-xs mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#F5C71A] font-bold">{product.price} EGP</span>
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 bg-[#F5C71A] rounded-full flex items-center justify-center hover:bg-[#F5C71A]/80 transition-colors shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 text-[#4A4238]" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [showSearch, setShowSearch]     = useState(false);
  const [selectedSize, setSelectedSize] = useState<AgeSize | undefined>();
  const { itemCount }  = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]);

  async function loadProducts() {
    setLoading(true);
    const res = await getProducts({
      size:     selectedSize,
      is_active: true,
    });
    setProducts(res.data);
    setLoading(false);
  }

  const filtered = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-24">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center justify-between px-4 py-3">
          <YayaLogo className="h-9" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors"
              aria-label="Search"
            >
              {showSearch ? <X className="w-5 h-5 text-[#4A4238]" /> : <Search className="w-5 h-5 text-[#4A4238]" />}
            </button>
            <Link to="/wishlist" className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors relative" aria-label="Wishlist">
              <Heart className="w-5 h-5 text-[#4A4238]" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#EFAFD0] text-[#4A4238] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 hover:bg-[#FFFDF5] rounded-full transition-colors relative" aria-label="Cart">
              <ShoppingCart className="w-5 h-5 text-[#4A4238]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F5C71A] text-[#4A4238] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8378]" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search onesies, sets, rompers…"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF5] border-2 border-[#F5C71A]/40 focus:border-[#F5C71A] rounded-full outline-none text-[#4A4238] text-sm transition-colors"
              />
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Banner ── */}
      <section className="px-4 pt-4 pb-2">
        <div
          className="relative h-56 rounded-[28px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #F5C71A 0%, #EFAFD0 100%)",
          }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${brandImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Mascots floating */}
          <div className="absolute top-4 right-4 flex gap-1 opacity-80">
            <ChickA className="w-10 h-10" />
            <TeddyBear className="w-12 h-12" />
            <ChickB className="w-10 h-10" />
            <BearCub className="w-10 h-10" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A4238]/30 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-white/90 text-xs font-medium mb-1 uppercase tracking-widest">New Arrivals ✨</p>
            <h2 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Nunito', system-ui" }}>
              Made with love<br />for babies 💛
            </h2>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 bg-white text-[#4A4238] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#FFFDF5] transition-colors shadow-sm"
            >
              Shop Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Age Category Bubbles ── */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#4A4238] font-semibold text-sm">Shop by Age</h3>
          <Link to="/categories" className="text-[#F5C71A] text-xs font-medium flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {AGE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedSize === cat.size;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedSize(isActive ? undefined : cat.size)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 min-w-[70px]"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? "border-[#F5C71A] bg-[#F5C71A]/15 scale-105"
                      : "border-[#4A4238]/15 bg-white hover:border-[#F5C71A]/50"
                  }`}
                >
                  <Icon className="w-9 h-9" />
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-[#F5C71A]" : "text-[#4A4238]"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>



      {/* ── Products Grid ── */}
      <section className="px-4 pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#4A4238] font-semibold text-sm">
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            <span className="text-[#8a8378] font-normal ml-1.5">({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-[24px] overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#FFFDF5]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#FFFDF5] rounded-full w-3/4" />
                  <div className="h-3 bg-[#FFFDF5] rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ChickB className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="text-[#8a8378]">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Brand Story Banner ── */}
      <section className="px-4 pt-6 pb-2">
        <div className="bg-[#EFAFD0]/20 rounded-[28px] p-5 flex items-center gap-4">
          <div className="flex-shrink-0">
            <TeddyBear className="w-16 h-16" />
          </div>
          <div>
            <p className="text-[#4A4238] font-bold text-sm mb-1">100% GOTS Organic Cotton</p>
            <p className="text-[#8a8378] text-xs leading-relaxed">
              Hand wash · Dry flat · Low iron<br />
              Safe for delicate baby skin 💛
            </p>
          </div>
        </div>
      </section>

      <BottomNav active="home" />
    </div>
  );
}

// Export BottomNav for use in other pages
export { BottomNav };
