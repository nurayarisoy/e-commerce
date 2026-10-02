# MyShop

Deutscher E-Commerce-Prototyp mit Next.js App Router, React, Tailwind CSS, Zustand, Prisma, PostgreSQL und Stripe Checkout.

## Funktionen

- Deutsche Produktoberflächen und Preise in EUR
- Warenkorb mit serverseitiger Preisberechnung aus dem Produktkatalog
- Bestellungen mit Status `PENDING_PAYMENT` in PostgreSQL
- Gehosteter Stripe Checkout; der Zahlungsstatus wird ausschließlich per signiertem Webhook aktualisiert
- Dynamische Zahlungsmethoden über das Stripe-Dashboard

Die Produktnamen und Preise in `src/mock/products.js` sind Beispieldaten. Vor dem Verkauf müssen echte Produkte und EUR-Preise hinterlegt werden.

## Lokale Einrichtung

Voraussetzungen: Node.js 20.9+, PostgreSQL und ein Stripe-Konto.

```bash
npm install
cp .env.example .env
```

Trage in `.env` die PostgreSQL-Verbindung, `SITE_URL` und Stripe-Testschlüssel ein. Danach:

```bash
npm run db:generate
npm run db:push
npm run dev
```

Die Anwendung läuft unter `http://localhost:3000`.

Für lokale Webhooks kann die Stripe CLI verwendet werden:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Den ausgegebenen `whsec_...`-Wert als `STRIPE_WEBHOOK_SECRET` eintragen. Schlüssel niemals in `NEXT_PUBLIC_*` Variablen speichern.

Checkout ist standardmäßig deaktiviert. Lege im Stripe-Dashboard einen Versandtarif für Deutschland an und trage dessen ID als `STRIPE_SHIPPING_RATE_ID` ein. Wenn Stripe Tax für dein Unternehmen eingerichtet ist, kann es mit `STRIPE_AUTOMATIC_TAX_ENABLED=true` aktiviert werden. Setze `CHECKOUT_ENABLED=true` erst, wenn Datenbank, Stripe-Testkonto, Versand und Steuerregeln geprüft sind.

## Zahlungsmethoden

Stripe Checkout verwendet die dynamische Zahlungsmethodenauswahl. Aktiviere im Stripe-Dashboard die für dein Unternehmen verfügbaren Methoden, zum Beispiel Karte, PayPal, Klarna und SEPA-Lastschrift. Verfügbarkeit hängt von Stripe-Konto, Kundschaft, Währung und Transaktion ab. Checkout ist auf Lieferadressen in Deutschland und EUR eingestellt.

Der Webhook-Endpunkt ist `POST /api/stripe/webhook`. Bestellungen bleiben `PENDING_PAYMENT`, bis Stripe einen verifizierten Erfolgs-Webhook sendet. SEPA-Zahlungen können verzögert bestätigt werden. Karten, PayPal, Klarna und SEPA-Lastschrift müssen im Stripe-Dashboard aktiviert sein und hängen von der Berechtigung des Stripe-Kontos ab.

## Vor dem Livegang

Versandkosten, Umsatzsteuer/Stripe Tax, echte Produktpreise, Impressum, Datenschutz, AGB und Widerruf müssen passend zum Unternehmen konfiguriert und rechtlich geprüft werden. Der Prototyp berechnet aktuell weder Versandkosten noch Steuern.

```bash
npm run build
npm start
```
