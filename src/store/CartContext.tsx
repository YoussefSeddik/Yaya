"use client";
// ============================================================
// YAYA BABY – Cart Context (Global State)
// ============================================================
import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { CartItem, AgeSize, Product } from "@/app/types";

// ── State & Actions ───────────────────────────────────────────
interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM";    item: CartItem }
  | { type: "REMOVE_ITEM"; product_id: string; size: AgeSize }
  | { type: "UPDATE_QTY";  product_id: string; size: AgeSize; quantity: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = (i: CartItem) => `${i.product_id}__${i.size}`;
      const exists = state.items.find((i) => key(i) === key(action.item));
      if (exists) {
        return {
          items: state.items.map((i) =>
            key(i) === key(action.item)
              ? { ...i, quantity: Math.min(i.quantity + action.item.quantity, i.stock) }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => !(i.product_id === action.product_id && i.size === action.size)
        ),
      };
    case "UPDATE_QTY":
      return {
        items: state.items
          .map((i) =>
            i.product_id === action.product_id && i.size === action.size
              ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.stock)) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────
interface CartContextValue {
  items:       CartItem[];
  itemCount:   number;
  subtotal:    number;
  addItem:     (product: Product, size: AgeSize, color?: string, qty?: number) => void;
  removeItem:  (product_id: string, size: AgeSize) => void;
  updateQty:   (product_id: string, size: AgeSize, quantity: number) => void;
  clearCart:   () => void;
  hasItem:     (product_id: string, size?: AgeSize) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = useCallback(
    (product: Product, size: AgeSize, color?: string, qty = 1) => {
      dispatch({
        type: "ADD_ITEM",
        item: {
          product_id: product.id,
          name:       product.name,
          price:      product.price,
          image_url:  product.image_url,
          size,
          color,
          quantity:   qty,
          stock:      product.stock,
        },
      });
    },
    []
  );

  const removeItem = useCallback((product_id: string, size: AgeSize) => {
    dispatch({ type: "REMOVE_ITEM", product_id, size });
  }, []);

  const updateQty = useCallback((product_id: string, size: AgeSize, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", product_id, size, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const hasItem = useCallback(
    (product_id: string, size?: AgeSize) =>
      state.items.some(
        (i) => i.product_id === product_id && (size === undefined || i.size === size)
      ),
    [state.items]
  );

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal  = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, itemCount, subtotal, addItem, removeItem, updateQty, clearCart, hasItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
