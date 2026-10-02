import Link from "next/link";
import ClearCartOnComplete from "@/components/checkout/ClearCartOnComplete";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

function Message({ title, children }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-gray-950">{title}</h1>
      <p className="mt-4 max-w-xl leading-7 text-gray-600">{children}</p>
      <Link href="/products" className="mt-7 rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800">
        Weiter einkaufen
      </Link>
    </main>
  );
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();
  if (!stripe || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return <Message title="Bestellung nicht gefunden">Der Zahlungsstatus konnte nicht abgerufen werden.</Message>;
  }

  let session;
  let order;
  let lookupFailed = false;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
    order = await prisma.order.findUnique({ where: { stripeSessionId: session.id } });
  } catch {
    lookupFailed = true;
  }

  if (lookupFailed) {
    return <Message title="Bestellung wird geprüft">Der Zahlungsstatus ist noch nicht verfügbar. Bitte lade die Seite in Kürze erneut.</Message>;
  }
  if (!order || session.client_reference_id !== order.orderNumber || session.status !== "complete") {
    return <Message title="Bestellung nicht gefunden">Der Zahlungsstatus konnte nicht abgerufen werden.</Message>;
  }

  const paid = session.payment_status === "paid";
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
      <ClearCartOnComplete active />
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-700">MyShop</p>
      <h1 className="font-serif text-4xl font-bold text-gray-950">{paid ? "Vielen Dank für deine Bestellung" : "Deine Zahlung wird verarbeitet"}</h1>
      <p className="mt-4 leading-7 text-gray-600">
        Bestellnummer: <span className="font-semibold text-gray-950">{order.orderNumber}</span>
      </p>
      <p className="mt-2 leading-7 text-gray-600">
        {paid
          ? "Deine Zahlung wurde bestätigt. Wir bereiten deine Bestellung vor."
          : "Dein Checkout ist abgeschlossen. Die Bank bestätigt die Zahlung; wir aktualisieren den Bestellstatus automatisch."}
      </p>
      <p className="mt-4 text-lg font-semibold text-gray-950">{formatPrice(order.totalCents / 100)}</p>
      <Link href="/products" className="mt-7 rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800">
        Weiter einkaufen
      </Link>
    </main>
  );
}