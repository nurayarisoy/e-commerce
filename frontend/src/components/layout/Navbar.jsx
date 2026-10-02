"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cart = useCartStore((s) => s.cart);
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav aria-label="Hauptnavigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-950">
          MyShop
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link className="transition hover:text-emerald-800" href="/products">Produkte</Link>
          <Link
            href="/cart"
            aria-label={`Warenkorb${total > 0 ? `, ${total} Artikel` : ""}`}
            className="relative inline-flex items-center transition hover:text-emerald-800"
          >
            Warenkorb
            {total > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-5 -top-3 rounded-full bg-emerald-700 px-1.5 text-xs leading-5 text-white"
              >
                {total}
              </span>
            )}
          </Link>
          <Link className="transition hover:text-emerald-800" href="/register">Registrieren</Link>
        </div>
        <button
          type="button"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          {open ? "Schließen" : "Menü"}
        </button>
      {open && (
        <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-medium text-gray-800">
            <Link href="/products" onClick={() => setOpen(false)}>Produkte</Link>
            <Link href="/cart" onClick={() => setOpen(false)}>Warenkorb{total > 0 && ` (${total})`}</Link>
            <Link href="/register" onClick={() => setOpen(false)}>Registrieren</Link>
          </div>
        </div>
      )}
      </nav>
    </header>
  );
}
