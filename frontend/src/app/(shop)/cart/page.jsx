"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);

  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const remove = useCartStore((s) => s.remove);

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-700">MyShop</p>
        <h1 className="mb-3 font-serif text-4xl font-bold text-gray-950">Ihr Warenkorb ist leer</h1>
        <p className="mb-7 max-w-md text-gray-600">Füge deine Favoriten hinzu. Sie warten hier auf dich.</p>
        <Link href="/products" className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800">
          Produkte entdecken
        </Link>
      </main>
    );
  }

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">Dein Einkauf</p>
          <h1 className="font-serif text-4xl font-bold text-gray-950">Warenkorb</h1>
        </div>
        <span className="text-sm text-gray-500">{totalQuantity} Artikel</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
              <Image src={item.image} alt={item.name} width={112} height={112} className="h-28 w-28 rounded-sm bg-gray-50 object-cover" />
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.id}`} className="font-semibold text-gray-950 hover:text-emerald-800">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-gray-600">Birim fiyat: {formatPrice(item.price)}</p>
                <button type="button" className="mt-3 text-sm text-gray-500 underline underline-offset-4 hover:text-red-700" onClick={() => remove(item.id)}>
                  Entfernen
                </button>
              </div>
              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <div className="inline-flex items-center rounded-md border border-gray-300">
                  <button type="button" className="h-10 w-10 text-lg hover:bg-gray-50" onClick={() => decrease(item.id)} aria-label={`${item.name} adedini azalt`}>
                    −
                  </button>
                  <span className="min-w-10 text-center text-sm" aria-label="Adet">{item.quantity || 1}</span>
                  <button type="button" className="h-10 w-10 text-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => increase(item.id)} disabled={(item.quantity || 1) >= 99} aria-label={`${item.name} adedini artır`}>
                    +
                  </button>
                </div>
                <p className="w-28 text-right font-semibold text-gray-950">{formatPrice(item.price * (item.quantity || 1))}</p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-md border border-gray-200 p-5">
          <h2 className="mb-5 text-lg font-semibold text-gray-950">Bestellübersicht</h2>
          <div className="flex justify-between border-b border-gray-200 pb-4 text-sm text-gray-600">
            <span>Zwischensumme</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between py-4 text-lg font-bold text-gray-950">
            <span>Gesamtsumme</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="mb-5 text-xs leading-5 text-gray-500">Versandkosten und Zahlungsmethoden werden im nächsten Schritt angezeigt.</p>
          <Link href="/checkout" className="block rounded-md bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800">
            Zur Kasse
          </Link>
          <Link href="/products" className="mt-4 block text-center text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-950">
            Weiter einkaufen
          </Link>
        </aside>
      </div>
    </main>
  );
}
