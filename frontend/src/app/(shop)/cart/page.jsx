"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);

  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const remove = useCartStore((s) => s.remove);

  if (cart.length === 0) {
    return <p>Sepet boş</p>;
  }

  const totalPrice = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <Link
                href={`/products/${item.id}`}
                className="font-medium hover:underline"
              >
                {item.name}
              </Link>
              <div className="text-sm text-gray-600">₺{item.price}</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-2 bg-gray-200 rounded"
                onClick={() => decrease(item.id)}
                aria-label="Azalt"
              >
                -
              </button>
              <span>Adet: {item.quantity}</span>
              <button
                className="px-2 bg-gray-200 rounded"
                onClick={() => increase(item.id)}
                aria-label="Arttır"
              >
                +
              </button>

              <button
                className="ml-4 px-2 py-1 bg-red-600 text-white rounded"
                onClick={() => remove(item.id)}
              >
                Kaldır
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <div className="text-lg font-medium">Toplam: ₺{new Intl.NumberFormat("tr-TR").format(totalPrice)}</div>
      </div>
    </div>
  );
}
