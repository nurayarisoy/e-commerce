// components/layout/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          MyShop
        </Link>

        <div className="flex gap-6">
          <Link href="/products">Ürünler</Link>
          <Link href="/cart">Sepet</Link>
          <Link href="/login">Giriş</Link>
        </div>
      </div>
    </nav>
  );
}
