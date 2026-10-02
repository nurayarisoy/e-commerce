import Link from "next/link";
import Image from "next/image";
import { products } from "@/mock/products";
import AddToCartButton from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/utils";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">MyShop Auswahl</p>
          <h1 className="font-serif text-4xl font-bold text-gray-950">Alle Produkte</h1>
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
                <h2 className="text-lg font-semibold text-gray-950">{product.name}</h2>
                <p className="shrink-0 font-semibold text-gray-800">{formatPrice(product.price)}</p>
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
    </main>
  );
}
