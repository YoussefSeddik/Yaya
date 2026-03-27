"use client";
// ============================================================
// YAYA BABY – Wishlist Context (Global State)
// ============================================================
import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { WishlistItem, Product } from "@/app/types";

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "TOGGLE"; item: WishlistItem }
  | { type: "REMOVE"; product_id: string }
  | { type: "CLEAR" };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.items.some((i) => i.product_id === action.item.product_id);
      return exists
        ? { items: state.items.filter((i) => i.product_id !== action.item.product_id) }
        : { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.product_id !== action.product_id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items:       WishlistItem[];
  toggleItem:  (product: Product) => void;
  removeItem:  (product_id: string) => void;
  isWished:    (product_id: string) => boolean;
  clearAll:    () => void;
  count:       number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  const toggleItem = useCallback((product: Product) => {
    dispatch({
      type: "TOGGLE",
      item: {
        product_id: product.id,
        name:       product.name,
        price:      product.price,
        image_url:  product.image_url,
        sizes:      product.sizes,
        added_at:   new Date().toISOString(),
      },
    });
  }, []);

  const removeItem = useCallback((product_id: string) => {
    dispatch({ type: "REMOVE", product_id });
  }, []);

  const isWished = useCallback(
    (product_id: string) => state.items.some((i) => i.product_id === product_id),
    [state.items]
  );

  const clearAll = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <WishlistContext.Provider
      value={{ items: state.items, toggleItem, removeItem, isWished, clearAll, count: state.items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
