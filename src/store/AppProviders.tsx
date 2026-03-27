"use client";
// ============================================================
// YAYA BABY – Combined App Providers
// ============================================================
import React from "react";
import { CartProvider }     from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
