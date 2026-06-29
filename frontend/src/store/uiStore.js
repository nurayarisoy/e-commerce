"use client";

import { create } from "zustand";

export const useUIStore = create((set) => ({
  toasts: [],
  showToast: (message, opts = {}) =>
    set((state) => {
      const id = Date.now() + Math.random();
      const t = { id, message, ...opts };
      return { toasts: [...state.toasts, t] };
    }),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export default useUIStore;
