// components/product/ProductCard.jsx
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        className="rounded"
      />

      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.price} ₺</p>
    </div>
  );
}
