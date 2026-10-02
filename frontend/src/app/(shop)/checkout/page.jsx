"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const idempotencyKey = useRef(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="mb-3 font-serif text-4xl font-bold text-gray-950">Dein Warenkorb ist leer</h1>
        <p className="mb-7 text-gray-600">Lege zuerst Produkte in den Warenkorb, um zur Kasse zu gehen.</p>
        <Link href="/products" className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800">
          Produkte entdecken
        </Link>
      </main>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const details = Object.fromEntries(new FormData(event.currentTarget).entries());
    setIsSubmitting(true);
    setSubmitError("");

    try {
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          ...details,
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity || 1 })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Die Bestellung konnte nicht gestartet werden.");
      if (!result.checkoutUrl) throw new Error("Die sichere Zahlungsseite ist derzeit nicht verfügbar.");
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Die Bestellung konnte nicht gestartet werden.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">Sicher bezahlen</p>
        <h1 className="font-serif text-4xl font-bold text-gray-950">Lieferdaten</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section>
          <form onSubmit={handleSubmit} className="space-y-8">
            {submitError && (
              <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900">{submitError}</p>
            )}
            <fieldset className="space-y-5">
              <legend className="mb-1 text-lg font-semibold text-gray-950">Kontaktdaten</legend>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-800">Vor- und Nachname</label>
                <input id="fullName" name="fullName" autoComplete="name" required minLength={3} maxLength={120} className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">E-Mail-Adresse</label>
                  <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-800">Telefon</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" minLength={10} maxLength={20} required className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="mb-1 text-lg font-semibold text-gray-950">Lieferadresse in Deutschland</legend>
              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-800">Straße und Hausnummer</label>
                <input id="address" name="address" autoComplete="street-address" required minLength={5} maxLength={500} className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="postalCode" className="mb-2 block text-sm font-medium text-gray-800">Postleitzahl</label>
                  <input id="postalCode" name="postalCode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" title="Bitte eine fünfstellige Postleitzahl eingeben." required className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 sm:max-w-xs" />
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-800">Ort</label>
                  <input id="city" name="city" autoComplete="address-level2" required maxLength={100} className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
                </div>
              </div>
              <div>
                <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-800">Lieferhinweis <span className="font-normal text-gray-500">(optional)</span></label>
                <textarea id="note" name="note" rows={2} maxLength={240} className="w-full resize-y rounded-md border border-gray-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20" />
              </div>
            </fieldset>

            <p className="max-w-xl text-sm leading-6 text-gray-600">Die Zahlung erfolgt sicher über Stripe. Verfügbare Zahlungsmethoden werden im nächsten Schritt angezeigt.</p>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {isSubmitting ? "Weiterleitung zu Stripe …" : "Weiter zur sicheren Zahlung"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-md border border-gray-200 p-5">
          <h2 className="mb-5 text-lg font-semibold text-gray-950">Bestellübersicht</h2>
          <ul className="mb-5 space-y-4 border-b border-gray-200 pb-5">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-gray-700">{item.name} <span className="text-gray-500">× {item.quantity || 1}</span></span>
                <span className="shrink-0 font-medium text-gray-950">{formatPrice(item.price * (item.quantity || 1))}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-lg font-bold text-gray-950">
            <span>Zwischensumme</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-500">Demo-Preise. Versandkosten und Steuern müssen vor dem Verkaufsstart konfiguriert werden.</p>
          <Link href="/cart" className="mt-5 block text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-950">
            Zurück zum Warenkorb
          </Link>
        </aside>
      </div>
    </main>
  );
}
