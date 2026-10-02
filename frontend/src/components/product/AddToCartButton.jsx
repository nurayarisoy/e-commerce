"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export default function AddToCartButton({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (qty < 1) return;
    setAdding(true);
    try {
      addToCart(product, qty);
      // prepare undo function: remove 'qty' from cart (or remove item)
      const undo = () => {
        const s = useCartStore.getState();
        const existing = s.cart.find((i) => i.id === product.id);
        if (!existing) return;
        const remaining = existing.quantity - qty;
        if (remaining > 0) {
          useCartStore.setState({
            cart: s.cart.map((it) =>
              it.id === product.id ? { ...it, quantity: remaining } : it
            ),
          });
        } else {
          useCartStore.setState({ cart: s.cart.filter((it) => it.id !== product.id) });
        }
      };

      // show a toast with undo
      useUIStore.getState().showToast(`${product.name} wurde ${qty}× in den Warenkorb gelegt.`, { undo });
      setDone(true);
      setTimeout(() => setDone(false), 1200);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded">
        <button
          className="px-3"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Menge verringern"
        >
          -
        </button>
        <input
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value || 1))))}
          className="w-14 text-center p-1"
        />
        <button
          className="px-3 disabled:opacity-40"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          disabled={qty >= 99}
          aria-label="Menge erhöhen"
        >
          +
        </button>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        onClick={handleAdd}
        disabled={adding}
      >
        {adding ? "Wird hinzugefügt …" : done ? "Hinzugefügt" : `In den Warenkorb (${qty})`}
      </button>
    </div>
  );
}
