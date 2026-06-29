import { products } from "@/mock/products";
import AddToCartButton from "@/components/product/AddToCartButton";
import Image from "next/image";
import ProductGallery from "@/components/product/ProductGallery";

export default async function ProductDetail({ params }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === Number(resolvedParams.id));

  if (!product) {
    return <p>Ürün bulunamadı</p>;
  }

  const price = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(product.price);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          {product.images && product.images.length > 0 ? (
            <ProductGallery images={product.images} />
          ) : product.image ? (
            // use Next/Image for single fallback image
            <div className="relative w-full h-72">
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded"
              />
            </div>
          ) : (
            <div className="w-full h-72 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              Resim yok
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl mt-4">{price}</p>
          <p className="mt-6 text-gray-700">{product.description ?? "Ürün açıklaması yok."}</p>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
