import Link from "next/link";
import Image from "next/image";
import { products } from "@/mock/products";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-10">
      {/* Hero Alanı */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">MyShop’a Hoşgeldiniz</h1>
        <p className="text-gray-600 mb-6">
          En kaliteli ürünleri en uygun fiyatlarla sunuyoruz.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Ürünleri Gör
        </Link>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Öne Çıkan Ürünler</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={600}
                className="w-full h-64 object-cover"
                priority={false}
              />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.price)}</p>
                <Link
                  href={`/products/${product.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Detayları Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
