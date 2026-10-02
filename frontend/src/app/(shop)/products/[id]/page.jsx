import { products } from "@/mock/products";
import AddToCartButton from "@/components/product/AddToCartButton";
import Image from "next/image";
import ProductGallery from "@/components/product/ProductGallery";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function ProductDetail({ params }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === Number(resolvedParams.id));

  if (!product) {
    return <p>Produkt nicht gefunden.</p>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:py-12">
      <nav aria-label="Sayfa yolu" className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-emerald-800">Startseite</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <Link href="/products" className="hover:text-emerald-800">Produkte</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          {product.images && product.images.length > 0 ? (
            <ProductGallery images={product.images} productName={product.name} />
          ) : product.image ? (
            <div className="relative aspect-square w-full bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="rounded-sm object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-sm bg-gray-100 text-gray-500">
              Kein Bild verfügbar
            </div>
          )}
        </div>

        <section className="flex flex-col items-start py-2 md:py-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-700">MyShop Auswahl</p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-gray-950 md:text-5xl">{product.name}</h1>
          <p className="mt-5 text-2xl font-semibold text-gray-950">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-xl leading-7 text-gray-600">{product.description ?? "Noch keine Produktbeschreibung vorhanden."}</p>

          <div className="mt-8 w-full border-y border-gray-200 py-6">
            <AddToCartButton product={product} />
          </div>
          <p className="mt-5 text-sm leading-6 text-gray-500">Du kannst deine Produkt- und Warenkorbangaben vor der Bestellung jederzeit ändern.</p>
        </section>
      </div>
    </main>
  );
}
