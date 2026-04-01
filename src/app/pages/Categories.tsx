"use client";
// ============================================================
// YAYA BABY – Categories / Shop Page
// ============================================================
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Search, SlidersHorizontal, X, ChevronDown,
  ShoppingCart, Heart,
} from "lucide-react";
import { YayaLogo, TeddyBear, ChickA, ChickB, BearCub } from "../components/Mascots";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart }     from "@/store/CartContext";
import { useWishlist } from "@/store/WishlistContext";
import { getProducts } from "@/services/products.service";
import { BottomNav }   from "./Home";
import type { Product, AgeSize, ProductCategory } from "@/app/types";

const AGE_FILTERS: { label: string; size: AgeSize }[] = [
  { label: "0–3M",  size: "0-3M"  },
  { label: "3–6M",  size: "3-6M"  },
  { label: "6–12M", size: "6-12M" },
  { label: "12–18M",size: "12-18M"},
  { label: "18–24M",size: "18-24M"},
];

const CAT_FILTERS: ProductCategory[] = ["Onesies", "Sets", "Rompers", "Sleepwear", "Outerwear", "Accessories"];
const SORT_OPTIONS = ["Featured", "Price: Low–High", "Price: High–Low", "Newest"];

const MASCOT_BY_SIZE: Record<string, React.ComponentType<{ className?: string }>> = {
  "0-3M": TeddyBear, "3-6M": ChickA, "6-12M": ChickB, "12-18M": BearCub, "18-24M": BearCub,
};

export default function Categories() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [selectedSizes, setSelectedSizes]   = useState<AgeSize[]>([]);
  const [selectedCats, setSelectedCats]     = useState<ProductCategory[]>([]);
  const [sortBy, setSortBy]             = useState("Featured");
  const [showFilters, setShowFilters]   = useState(false);
  const [maxPrice, setMaxPrice]         = useState(1000);
  const [showTabs, setShowTabs]         = useState(true);
  const [lastScrollY, setLastScrollY]   = useState(0);

  const { addItem }                         = useCart();
  const { toggleItem, isWished }            = useWishlist();

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowTabs(false);
      } else {
        // Scrolling up
        setShowTabs(true);
      }
      
      scrollTimeout = setTimeout(() => {
        setLastScrollY(currentScrollY);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  async function loadProducts() {
    setLoading(true);
    const res = await getProducts({ is_active: true }, 1, 50);
    setProducts(res.data);
    setLoading(false);
  }

  const filtered = products
    .filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedSizes.length && !selectedSizes.some((s) => p.sizes.includes(s))) return false;
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low–High") return a.price - b.price;
      if (sortBy === "Price: High–Low") return b.price - a.price;
      if (sortBy === "Newest") return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  const toggleSize = (s: AgeSize) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleCat = (c: ProductCategory) =>
    setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const clearFilters = () => { setSelectedSizes([]); setSelectedCats([]); setMaxPrice(1000); setSearch(""); };
  const hasFilters = selectedSizes.length > 0 || selectedCats.length > 0 || maxPrice < 1000 || search.length > 0;

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#4A4238]/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/" className="flex-shrink-0">
            <YayaLogo className="h-8" />
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8378]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-full outline-none text-[#4A4238] text-sm transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#8a8378]" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-shrink-0 p-2.5 rounded-full transition-colors relative ${
              showFilters ? "bg-[#F5C71A] text-[#4A4238]" : "bg-[#FFFDF5] text-[#4A4238]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {hasFilters && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#EFAFD0] rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* ── Category Tabs ── */}
      <div className={`sticky top-14 z-40 bg-white border-b border-[#4A4238]/10 px-4 py-2 transition-all duration-300 overflow-hidden ${
        showTabs ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCats([])}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedCats.length === 0
                ? "bg-[#F5C71A] text-[#4A4238]"
                : "bg-white text-[#8a8378] border border-[#4A4238]/10 hover:bg-[#FFFDF5]"
            }`}
          >
            All
          </button>
          {["Onesies", "Sets", "Rompers", "Sleepwear"].map((cat) => {
            const isActive = selectedCats.includes(cat as ProductCategory);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCats(isActive ? [] : [cat as ProductCategory])}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#EFAFD0] text-[#4A4238]"
                    : "bg-white text-[#8a8378] border border-[#4A4238]/10 hover:bg-[#FFFDF5]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-[#4A4238]/10 px-4 py-4 space-y-4">
          {/* Age Filters */}
          <div>
            <p className="text-[#4A4238] text-xs font-semibold uppercase tracking-wide mb-2">Age / Size</p>
            <div className="flex flex-wrap gap-2">
              {AGE_FILTERS.map(({ label, size }) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    selectedSizes.includes(size)
                      ? "bg-[#F5C71A] border-[#F5C71A] text-[#4A4238]"
                      : "border-[#4A4238]/20 text-[#4A4238]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* Category Filters */}
          <div>
            <p className="text-[#4A4238] text-xs font-semibold uppercase tracking-wide mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CAT_FILTERS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    selectedCats.includes(cat)
                      ? "bg-[#EFAFD0] border-[#EFAFD0] text-[#4A4238]"
                      : "border-[#4A4238]/20 text-[#4A4238]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {/* Price */}
          <div>
            <p className="text-[#4A4238] text-xs font-semibold uppercase tracking-wide mb-2">
              Max Price: <span className="text-[#F5C71A]">{maxPrice} EGP</span>
            </p>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#F5C71A]"
            />
          </div>
          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-[#8a8378] underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Sort & Count bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#4A4238]/5">
        <p className="text-[#8a8378] text-xs">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-1 text-xs text-[#4A4238] font-medium">
          <span className="text-[#8a8378]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent outline-none text-[#4A4238] font-medium cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="w-3 h-3 text-[#8a8378]" />
        </div>
      </div>

      {/* Grid */}
      <section className="px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4,5,6].map((n) => (
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
            <p className="text-[#4A4238] font-medium mb-1">No products found</p>
            <p className="text-[#8a8378] text-sm">Try adjusting your filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-[#F5C71A] font-medium text-sm">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => {
              const Mascot = MASCOT_BY_SIZE[product.sizes[0]] ?? TeddyBear;
              const wished = isWished(product.id);
              return (
                <Link key={product.id} to={`/product/${product.id}`} className="group block">
                  <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
                    <div className="relative aspect-square overflow-hidden bg-[#FFFDF5]">
                      <ImageWithFallback
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Mascot className="w-6 h-6" />
                      </div>
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2 left-2 bg-red-100 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {product.stock} left
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product); }}
                        className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart className={`w-3.5 h-3.5 ${wished ? "fill-[#EFAFD0] text-[#EFAFD0]" : "text-[#4A4238]"}`} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="text-[#4A4238] text-sm font-medium mb-0.5 line-clamp-2 leading-tight">{product.name}</h4>
                      <p className="text-[#8a8378] text-[11px] mb-2">{product.sizes.join(" · ")}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#F5C71A] font-bold text-sm">{product.price} EGP</span>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product, product.sizes[0] ?? "0-3M"); }}
                          className="w-7 h-7 bg-[#F5C71A] rounded-full flex items-center justify-center hover:bg-[#F5C71A]/80 transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-[#4A4238]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <BottomNav active="categories" />
    </div>
  );
}
