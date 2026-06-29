This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## GitHub

- Repository: [nurayarisoy/e-commerce](https://github.com/nurayarisoy/e-commerce)

## Projektbeschreibung (Deutsch)

Dieses Projekt ist ein einfacher E-Commerce-Frontend-Prototyp fuer den Verkauf von Teppichen.
Es enthaelt Produktseiten, Warenkorb-Flow, Checkout-Seiten sowie einen geschuetzten Admin-Bereich.

## Funktionen

- Produktliste und Produktdetailseiten
- Warenkorb mit Mengenverwaltung
- Checkout-Flow mit Bestellabschluss
- Geschuetzter Admin-Bereich fuer interne Verwaltung

## Lokale Entwicklung

Voraussetzungen:

- Node.js 18+
- npm

Start:

```bash
npm install
npm run dev
```

Danach ist die App unter `http://localhost:3000` erreichbar.

## Deployment

Empfohlenes Hosting: Vercel.

```bash
npm run build
npm start
```

Produktiv verwendete URL (Alias):

- `https://frontend-ten-blond-39.vercel.app`

## Admin-Zugang

- Admin-Login: `https://frontend-ten-blond-39.vercel.app/admin`
- Der Zugriff erfolgt ueber das in der Server-Umgebung gesetzte Passwort (z. B. `ADMIN_PASSWORD`).
- Niemals Passwoerter oder Secrets in `NEXT_PUBLIC_*` Variablen speichern.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
