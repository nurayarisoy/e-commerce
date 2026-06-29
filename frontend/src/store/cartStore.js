"use client";

import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],

  // Accept quantity as second arg (default 1)
  addToCart: (product, qty = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, quantity: qty }],
      };
    }),

  increase: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),

  remove: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));

// Persist cart to localStorage and rehydrate on client
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("cart");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // setState directly so hooks/components re-render with restored cart
        useCartStore.setState({ cart: parsed });
      }
    }
  } catch (err) {
    // don't throw in client; just log for debugging
    // eslint-disable-next-line no-console
    console.error("Failed to rehydrate cart from localStorage", err);
  }

  // subscribe to changes and write to localStorage
  useCartStore.subscribe((state) => {
    try {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    } catch (err) {
      // ignore quota errors
    }
  });
}
