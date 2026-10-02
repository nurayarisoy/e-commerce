import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { products } from "@/mock/products";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const maxQuantity = 99;

function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Die Anfrage ist ungültig.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return badRequest("Die Bestelldaten sind ungültig.");
  }

  const idempotencyKey = request.headers.get("idempotency-key") || "";
  if (!/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return badRequest("Die Anfrage-ID ist ungültig.");

  const customer = {
    fullName: stringValue(body.fullName),
    email: stringValue(body.email).toLowerCase(),
    phone: stringValue(body.phone),
    address: stringValue(body.address),
    city: stringValue(body.city),
    postalCode: stringValue(body.postalCode),
    note: stringValue(body.note),
  };

  if (customer.fullName.length < 3 || customer.fullName.length > 120) return badRequest("Bitte gib deinen Vor- und Nachnamen ein.");
  if (customer.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return badRequest("Bitte gib eine gültige E-Mail-Adresse ein.");
  if (!/^[0-9+() -]{10,20}$/.test(customer.phone)) return badRequest("Bitte überprüfe deine Telefonnummer.");
  if (customer.address.length < 5 || customer.address.length > 500) return badRequest("Bitte gib Straße und Hausnummer ein.");
  if (!customer.city || customer.city.length > 100) return badRequest("Bitte gib deinen Wohnort ein.");
  if (!/^\d{5}$/.test(customer.postalCode)) return badRequest("Bitte gib eine fünfstellige Postleitzahl ein.");
  if (customer.note.length > 240) return badRequest("Der Lieferhinweis darf höchstens 240 Zeichen lang sein.");
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
    return badRequest("Dein Warenkorb ist ungültig.");
  }

  const quantities = new Map();
  for (const item of body.items) {
    const productId = Number(item?.id);
    const quantity = Number(item?.quantity);
    if (!Number.isSafeInteger(productId) || !Number.isSafeInteger(quantity) || quantity < 1) {
      return badRequest("Eine Produktmenge ist ungültig.");
    }
    const nextQuantity = (quantities.get(productId) ?? 0) + quantity;
    if (nextQuantity > maxQuantity) return badRequest("Pro Produkt sind höchstens 99 Stück bestellbar.");
    quantities.set(productId, nextQuantity);
  }

  const productById = new Map(products.map((product) => [product.id, product]));
  const orderItems = [];
  for (const [productId, quantity] of quantities) {
    const product = productById.get(productId);
    if (!product) return badRequest("Ein Produkt in deinem Warenkorb ist nicht mehr verfügbar.");
    const unitPriceCents = Math.round(product.price * 100);
    orderItems.push({
      productId,
      productName: product.name,
      unitPriceCents,
      quantity,
      lineTotalCents: unitPriceCents * quantity,
    });
  }

  const subtotalCents = orderItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
  if (!Number.isSafeInteger(subtotalCents)) return badRequest("Die Bestellsumme ist ungültig.");

  const stripe = getStripe();
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");
  const shippingRateId = process.env.STRIPE_SHIPPING_RATE_ID;
  const automaticTaxEnabled = process.env.STRIPE_AUTOMATIC_TAX_ENABLED === "true";
  let siteOrigin;
  try {
    siteOrigin = new URL(siteUrl);
  } catch {
    siteOrigin = null;
  }
  if (
    process.env.CHECKOUT_ENABLED !== "true" ||
    !stripe ||
    !process.env.DATABASE_URL ||
    !shippingRateId ||
    !siteOrigin ||
    !["http:", "https:"].includes(siteOrigin.protocol) ||
    (process.env.NODE_ENV === "production" && siteOrigin.protocol !== "https:")
  ) {
    return NextResponse.json({ error: "Der Verkauf ist noch nicht freigeschaltet. Zahlungs-, Versand- und Steuereinstellungen müssen zuerst eingerichtet werden." }, { status: 503 });
  }

  try {
    const existingOrder = await prisma.order.findUnique({ where: { idempotencyKey } });
    if (existingOrder) {
      if (existingOrder.email !== customer.email || !existingOrder.stripeSessionId) {
        return NextResponse.json({ error: "Diese Anfrage wurde bereits verarbeitet." }, { status: 409 });
      }
      const existingSession = await stripe.checkout.sessions.retrieve(existingOrder.stripeSessionId);
      if (existingSession.status === "open" && existingSession.url) {
        return NextResponse.json({ orderNumber: existingOrder.orderNumber, checkoutUrl: existingSession.url });
      }
      return NextResponse.json({ error: "Diese Zahlungssitzung ist nicht mehr verfügbar." }, { status: 409 });
    }
  } catch {
    return NextResponse.json({ error: "Der Bezahlvorgang ist derzeit nicht verfügbar." }, { status: 503 });
  }

  const orderNumber = `MS-DE-${randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;
  let session;
  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        locale: "de",
        customer_email: customer.email,
        client_reference_id: orderNumber,
        metadata: { orderNumber },
        phone_number_collection: { enabled: true },
        shipping_address_collection: { allowed_countries: ["DE"] },
        shipping_options: [{ shipping_rate: shippingRateId }],
        automatic_tax: { enabled: automaticTaxEnabled },
        line_items: orderItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "eur",
            unit_amount: item.unitPriceCents,
            product_data: { name: item.productName },
          },
        })),
        success_url: `${siteUrl}/checkout/erfolg?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart`,
      },
      { idempotencyKey }
    );
    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
  } catch {
    return NextResponse.json({ error: "Die sichere Zahlungsseite konnte nicht gestartet werden." }, { status: 503 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        idempotencyKey,
        stripeSessionId: session.id,
        ...customer,
        country: "DE",
        subtotalCents,
        shippingCents: session.total_details?.amount_shipping ?? 0,
        taxCents: session.total_details?.amount_tax ?? 0,
        totalCents: session.amount_total ?? subtotalCents,
        items: { create: orderItems },
      },
    });
    return NextResponse.json({ orderNumber: order.orderNumber, checkoutUrl: session.url }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      try {
        const existingOrder = await prisma.order.findUnique({ where: { idempotencyKey } });
        if (existingOrder?.email === customer.email && existingOrder.stripeSessionId) {
          const existingSession = await stripe.checkout.sessions.retrieve(existingOrder.stripeSessionId);
          if (existingSession.status === "open" && existingSession.url) {
            return NextResponse.json({ orderNumber: existingOrder.orderNumber, checkoutUrl: existingSession.url });
          }
        }
      } catch {
        return NextResponse.json({ error: "Die Bestellung konnte nicht gespeichert werden." }, { status: 503 });
      }
    }

    try {
      await stripe.checkout.sessions.expire(session.id);
    } catch {
      return NextResponse.json({ error: "Die Bestellung konnte nicht gespeichert werden." }, { status: 503 });
    }
    return NextResponse.json({ error: "Die Bestellung konnte nicht gespeichert werden." }, { status: 503 });
  }
}