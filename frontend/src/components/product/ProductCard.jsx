"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">₺{product.price}</p>

      <div className="flex gap-2 mt-4">
        {/* 🔗 DETAY SAYFASI */}
        <Link
          href={`/products/${product.id}`}
          className="text-blue-600 underline"
        >
          Detayları Gör
        </Link>

        {/* 🛒 SEPETE EKLE */}
        <button
          onClick={() => addToCart(product)}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
