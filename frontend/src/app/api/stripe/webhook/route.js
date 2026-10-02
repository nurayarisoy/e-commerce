import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook-Konfiguration fehlt." }, { status: 503 });
  }
  if (!signature) return NextResponse.json({ error: "Stripe-Signatur fehlt." }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Stripe-Signatur ungültig." }, { status: 400 });
  }

  const session = event.data.object;
  let status;
  if (event.type === "checkout.session.completed" && session.payment_status === "paid") {
    status = "PAID";
  } else if (event.type === "checkout.session.async_payment_succeeded") {
    status = "PAID";
  } else if (
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.expired"
  ) {
    status = "CANCELLED";
  } else {
    return NextResponse.json({ received: true });
  }

  try {
    const order = await prisma.order.findUnique({ where: { stripeSessionId: session.id } });
    if (!order) return NextResponse.json({ error: "Bestellung noch nicht verfügbar." }, { status: 503 });
    await prisma.order.update({ where: { id: order.id }, data: { status } });
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Bestellstatus konnte nicht aktualisiert werden." }, { status: 503 });
  }
}