"use client";
// ============================================================
// YAYA BABY – Combined App Providers
// ============================================================
import React from "react";
import { CartProvider }     from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { AuthProvider }     from "./AuthContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
