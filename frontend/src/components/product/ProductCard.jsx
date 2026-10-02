"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">{formatPrice(product.price)}</p>

      <div className="flex gap-2 mt-4">
        <Link
          href={`/products/${product.id}`}
          className="text-blue-600 underline"
        >
          Details ansehen
        </Link>

        <button
          onClick={() => addToCart(product)}
          className="bg-black text-white px-3 py-1 rounded"
        >
          In den Warenkorb
        </button>
      </div>
    </div>
  );
}
