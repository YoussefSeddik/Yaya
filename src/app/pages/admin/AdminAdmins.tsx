"use client";
// ============================================================
// YAYA BABY – Admin Users Management (super_admin only)
// ============================================================
import { useEffect, useState } from "react";
import {
  UserPlus, Trash2, Edit2, ShieldCheck, Shield,
  X, Check, Eye, EyeOff,
} from "lucide-react";
import type { AdminUser, AdminRole } from "@/app/types";
import { useAuth } from "@/store/AuthContext";

const ROLE_BADGE: Record<AdminRole, { label: string; bg: string; text: string }> = {
  super_admin: { label: "Super Admin", bg: "#FEF3C7", text: "#92400E" },
  admin:       { label: "Admin",       bg: "#EDE9FE", text: "#5B21B6" },
};

const EMPTY_FORM = {
  full_name: "",
  email: "",
  password: "",
  role: "admin" as AdminRole,
};

export default function AdminAdmins() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins]     = useState<AdminUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<AdminUser | null>(null);
  const [form, setForm]         = useState({ ...EMPTY_FORM });
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [showPw, setShowPw]     = useState(false);

  useEffect(() => { loadAdmins(); }, []);

  async function loadAdmins() {
    setLoading(true);
    const res = await fetch("/api/admins");
    if (res.ok) {
      const json = await res.json();
      setAdmins(json.data ?? []);
    }
    setLoading(false);
  }

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setShowForm(true);
  };

  const openEdit = (a: AdminUser) => {
    setEditing(a);
    setForm({ full_name: a.full_name, email: a.email, password: "", role: a.role });
    setError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setError("");
    if (!form.full_name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    if (!editing && !form.password) {
      setError("Password is required for new admins.");
      return;
    }

    setSaving(true);

    if (editing) {
      const body: Record<string, unknown> = { full_name: form.full_name, role: form.role };
      const res = await fetch(`/api/admins/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to update admin.");
        setSaving(false);
        return;
      }
    } else {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to create admin.");
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setShowForm(false);
    loadAdmins();
  };

  const handleToggleActive = async (a: AdminUser) => {
    await fetch(`/api/admins/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !a.is_active }),
    });
    loadAdmins();
  };

  const handleDelete = async (a: AdminUser) => {
    if (!confirm(`Delete admin "${a.full_name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admins/${a.id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Failed to delete admin.");
      return;
    }
    loadAdmins();
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#4A4238] text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#F5C71A]" /> Admin Users
          </h1>
          <p className="text-[#8a8378] text-sm">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F5C71A] text-[#4A4238] rounded-full text-sm font-semibold hover:bg-[#F5C71A]/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="h-14 bg-[#FFFDF5] rounded-[14px] animate-pulse" />
            ))}
          </div>
        ) : admins.length === 0 ? (
          <div className="py-16 text-center text-[#8a8378] text-sm">No admins yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#FFFDF5]">
              <tr>
                {["Name", "Email", "Role", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left text-[#4A4238] px-5 py-3 text-xs font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const badge = ROLE_BADGE[a.role];
                const isSelf = a.id === currentAdmin?.id;
                return (
                  <tr
                    key={a.id}
                    className="border-t border-[#4A4238]/5 hover:bg-[#FFFDF5]/70 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F5C71A]/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-[#F5C71A]" />
                        </div>
                        <span className="text-[#4A4238] font-medium text-xs">
                          {a.full_name}
                          {isSelf && <span className="ml-1 text-[#8a8378]">(you)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#8a8378] text-xs">{a.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          a.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {a.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#8a8378] text-xs">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {!isSelf && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(a)}
                            className="p-1.5 bg-[#FFFDF5] rounded-[8px] hover:bg-[#F5C71A]/20 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#4A4238]" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(a)}
                            className="p-1.5 bg-[#FFFDF5] rounded-[8px] hover:bg-[#FFFDF5] transition-colors"
                            title={a.is_active ? "Deactivate" : "Activate"}
                          >
                            {a.is_active
                              ? <EyeOff className="w-3.5 h-3.5 text-[#8a8378]" />
                              : <Eye    className="w-3.5 h-3.5 text-green-500" />
                            }
                          </button>
                          <button
                            onClick={() => handleDelete(a)}
                            className="p-1.5 bg-[#FFFDF5] rounded-[8px] hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#4A4238]/10">
              <h3 className="text-[#4A4238] font-bold">
                {editing ? "Edit Admin" : "Add Admin"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-[#8a8378]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-[12px] px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Full Name *</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Sara Mahmoud"
                  className="w-full px-3 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm"
                />
              </div>

              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="sara@yayababy.com"
                  disabled={!!editing}
                  className="w-full px-3 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm disabled:opacity-50"
                />
              </div>

              {!editing && (
                <div>
                  <label className="text-[#4A4238] text-xs font-medium mb-1 block">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Min 8 characters"
                      className="w-full px-3 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPw
                        ? <EyeOff className="w-4 h-4 text-[#8a8378]" />
                        : <Eye    className="w-4 h-4 text-[#8a8378]" />
                      }
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#4A4238] text-xs font-medium mb-1 block">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AdminRole }))}
                  className="w-full px-3 py-2.5 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[12px] outline-none text-[#4A4238] text-sm appearance-none"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-[#F5C71A] text-[#4A4238] rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#F5C71A]/90 transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? "Saving…" : editing ? "Update Admin" : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
