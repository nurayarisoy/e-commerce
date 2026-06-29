"use client"; // ⚠️ Bunu en üstte ekle

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((s) => s.cart);
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const [pulse, setPulse] = useState(false);

  // pulse the badge briefly when total increases
  const prevTotalRef = useRef(total);
  useEffect(() => {
    const prev = prevTotalRef.current;
    if (total > prev) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 420);
      return () => clearTimeout(t);
    }
    prevTotalRef.current = total;
  }, [total]);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          MyShop
        </Link>
        <div className="md:flex hidden items-center gap-6">
          <Link href="/products">Products</Link>
          <Link href="/cart" className="relative inline-flex items-center">
            <span>Cart</span>
            {total > 0 && (
              <span
                className={`absolute -top-2 -right-4 bg-red-600 text-white rounded-full px-2 text-xs transform transition-transform ${
                  pulse ? "scale-125" : "scale-100"
                }`}
              >
                {total}
              </span>
            )}
          </Link>
          <Link href="/auth/login">Login</Link>
        </div>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-2">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart {total > 0 && `(${total})`}</Link>
          <Link href="/auth/login">Login</Link>
        </div>
      )}
    </nav>
  );
}
