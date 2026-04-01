"use client";
// ============================================================
// YAYA BABY – Auth Context
// Provides current admin user info to all child components
// ============================================================
import React, { createContext, useContext, useEffect, useState } from "react";
import type { AdminUser } from "@/app/types";

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  admin: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin]   = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        setAdmin(json.data ?? null);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider value={{ admin, loading, logout, refresh: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
