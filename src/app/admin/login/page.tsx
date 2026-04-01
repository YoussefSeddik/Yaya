"use client";
// ============================================================
// YAYA BABY – Admin Login Page (standalone Next.js page)
// ============================================================
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    // Step 1: sign in with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Step 2: verify the user is an admin
    const res = await fetch("/api/auth/login", { method: "POST" });

    if (!res.ok) {
      await supabase.auth.signOut();
      setError("Your account is not authorized to access the admin panel.");
      setLoading(false);
      return;
    }

    // Step 3: redirect to admin dashboard
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl font-black text-[#4A4238] tracking-tight">yaya</span>
            <span className="text-2xl">🐻</span>
          </div>
          <p className="text-[#8a8378] text-sm">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] shadow-sm p-8 space-y-5">
          <h1 className="text-[#4A4238] text-xl font-bold text-center">Sign In</h1>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-[14px] px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#4A4238] text-xs font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yayababy.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[14px] outline-none text-[#4A4238] text-sm transition-colors placeholder:text-[#8a8378]/60"
              />
            </div>

            <div>
              <label className="block text-[#4A4238] text-xs font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#FFFDF5] border-2 border-transparent focus:border-[#F5C71A] rounded-[14px] outline-none text-[#4A4238] text-sm transition-colors placeholder:text-[#8a8378]/60"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-[#F5C71A] text-[#4A4238] rounded-full font-bold text-sm hover:bg-[#F5C71A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[#8a8378] text-xs">
            Admin access only. Contact your super admin for credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
