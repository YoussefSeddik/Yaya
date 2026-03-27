"use client";
// ============================================================
// YAYA BABY – Admin Products Management
// ============================================================
import { useEffect, useState } from "react";
import {
  Search, Plus, Edit2, Trash2, Eye, EyeOff,
  Package, AlertCircle, X, Check,
} from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/products.service";
import type { Product, ProductCategory, AgeSize } from "@/app/types";

const CATEGORIES: ProductCategory[] = ["Onesies", "Sets", "Rompers", "Sleepwear", "Outerwear", "Accessories"];
const SIZES: AgeSize[] = ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"];

const EMPTY_FORM = {
  name: "", name_ar: "", description: "", price: 0, cost: 0,
  category: "Onesies" as ProductCategory, image_url: "", stock: 0, sku: "",
  is_active: true, is_featured: false, sizes: [] as AgeSize[],
  colors: [] as string[], material: "100% GOTS Organic Cotton",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Product | null>(null);
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [saving, setSaving]     = useState(false);
  const [colorsInput, setColorsInput] = useState("");

  useEffect(() => { loadProducts(); }, [search]);

  async function loadProducts() {
    setLoading(true);
    const res = await getProducts({ search: search || undefined }, 1, 50);
    setProducts(res.data);
    setTotal(res.total);
    setLoading(false);
  }

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setColorsInput("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, name_ar: p.name_ar ?? "", description: p.description ?? "",
      price: p.price, cost: p.cost, category: p.category, image_url: p.image_url,
      stock: p.stock, sku: p.sku, is_active: p.is_active, is_featured: p.is_featured ?? false,
      sizes: p.sizes, colors: p.colors, material: p.material ?? "100% GOTS Organic Cotton",
    });
    setColorsInput(p.colors.join(", "));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.sku || form.price <= 0) return;
    setSaving(true);
    const payload = { ...form, colors: colorsInput.split(",").map((c) => c.trim()).filter(Boolean) };
    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await createProduct(payload as Omit<Product, "id" | "created_at" | "updated_at">);
    }
    setSaving(false);
    setShowForm(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  const handleToggleActive = async (p: Product) => {
    await updateProduct(p.id, { is_active: !p.is_active });
    loadProducts();
  };

  const toggleSize = (size: AgeSize) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#4A4238] text-2xl font-bold">Products</h1>
          <p className="text-[#8a8378] text-sm">{total} products</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F5C71A] text-[#4A4238] rounded-full text-sm font-semibold hover:bg-[#F5C71A]/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8378]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#4A4238]/10 focus:border-[#F5C71A] rounded-[14px] outline-none text-[#4A4238] text-sm transition-colors max-w-xs"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((n) => <div key={n} className="bg-white rounded-[20px] animate-pulse h-48" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-[#FFFDF5]">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className={`w-full h-full object-cover ${!product.is_active ? "opacity-50 grayscale" : ""}`}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/assets/brand-hero.png"; }}
                />
                {/* Stock warning */}
                {product.stock < 5 && product.stock > 0 && (
                  <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertCircle className="w-2.5 h-2.5" /> Low
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Out
                  </div>
                )}
                {!product.is_active && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-[#4A4238]/70 text-white text-xs font-bold px-3 py-1 rounded-full">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-[#4A4238] text-xs font-semibold line-clamp-1 mb-0.5">{product.name}</p>
                <p className="text-[#8a8378] text-[11px] mb-1">{product.category} · {product.sku}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#F5C71A] font-bold text-xs">{product.price} EGP</span>
                  <span className={`text-[11px] font-medium ${product.stock < 5 ? "text-red-500" : "text-[#22c55e]"}`}>
                    Stock: {product.stock}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#FFFDF5] rounded-[10px] text-[#4A4238] text-xs font-medium hover:bg-[#F5C71A]/20 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(product)}
                    className="p-1.5 bg-[#FFFDF5] rounded-[10px] hover:bg-[#FFFDF5] transition-colors"
                    title={product.is_active ? "Hide" : "Show"}
                  >
                    {product.is_active
                      ? <Eye className="w-3.5 h-3.5 text-[#22c55e]" />
                      : <EyeOff className="w-3.5 h-3.5 text-[#8a8378]" />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 bg-[#FFFDF5] rounded-[10px] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#4A4238]/10 sticky top-0 bg-white rounded-t-[28px]">
              <h3 className="text-[#4A4238] font-bold">{editing ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-[#8a8378]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">Name *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Product name" className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" />
                </div>
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">Arabic Name</label>
                  <input value={form.name_ar} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                    placeholder="اسم المنتج" className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" dir="rtl" />
                </div>
              </div>
              {/* SKU & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">SKU *</label>
                  <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                    placeholder="YYA-ONE-001" className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm font-mono" />
                </div>
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
                    className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm appearance-none">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {/* Price, Cost, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">Price (EGP) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" />
                </div>
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">Cost (EGP) *</label>
                  <input type="number" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" />
                </div>
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" />
                </div>
              </div>
              {/* Image URL */}
              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/…" className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" />
              </div>
              {/* Description */}
              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Product description…" className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm resize-none" />
              </div>
              {/* Sizes */}
              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-2 block">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button key={size} type="button" onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        form.sizes.includes(size) ? "bg-[#F5C71A] border-[#F5C71A] text-[#4A4238]" : "border-[#4A4238]/20 text-[#4A4238]"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              {/* Colors */}
              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Colors (comma-separated)</label>
                <input value={colorsInput} onChange={(e) => setColorsInput(e.target.value)}
                  placeholder="White, Cream, Blush Pink" className="w-full px-3 py-2 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm" />
              </div>
              {/* Toggles */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? "bg-[#F5C71A]" : "bg-[#e0e0e0]"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-[#4A4238] text-xs font-medium">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, is_featured: !f.is_featured }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? "bg-[#EFAFD0]" : "bg-[#e0e0e0]"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-[#4A4238] text-xs font-medium">Featured</span>
                </label>
              </div>
              {/* Profit preview */}
              {form.price > 0 && form.cost > 0 && (
                <div className="bg-[#FFFDF5] rounded-[12px] px-3 py-2 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-[#F5C71A]" />
                  <span className="text-[#8a8378] text-xs">
                    Profit: <span className="text-[#22c55e] font-semibold">{form.price - form.cost} EGP</span>
                    ({Math.round(((form.price - form.cost) / form.price) * 100)}% margin)
                  </span>
                </div>
              )}
              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.sku || form.price <= 0}
                className="w-full py-3 bg-[#F5C71A] text-[#4A4238] rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#F5C71A]/90 transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving…" : editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
