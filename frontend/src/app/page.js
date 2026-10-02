import Link from "next/link";
import Image from "next/image";
import { products } from "@/mock/products";
import AddToCartButton from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/utils";

export default function Home() {
  return (
    <main className="container mx-auto max-w-7xl px-6 py-10 md:py-16">
      <section className="mb-14 border-b border-gray-200 pb-12 md:mb-16 md:pb-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-700">
          Unsere Auswahl
        </p>
        <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-950 md:text-6xl">
              Lieblingsstücke für jeden Tag.
            </h1>
            <p className="max-w-xl text-lg leading-7 text-gray-600">
              Entdecke sorgfältig ausgewählte Produkte und lege deine Favoriten direkt in den Warenkorb.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            Alle Produkte ansehen <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">MyShop Auswahl</p>
            <h2 className="text-2xl font-bold text-gray-950">Ausgewählte Produkte</h2>
          </div>
          <span className="text-sm text-gray-500">{products.length} Produkte</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-md border border-gray-200 bg-white transition hover:border-gray-300"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={600}
                className="h-64 w-full bg-gray-50 object-cover"
                priority={index === 0}
              />
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-950">{product.name}</h3>
                  <p className="shrink-0 font-semibold text-gray-800">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-block text-sm font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950"
                >
                  Produktdetails
                </Link>
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
