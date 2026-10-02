import Link from "next/link";

export default function Footer() {
	return (
		<footer className="mt-16 border-t border-gray-200 bg-white">
			<div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<Link href="/" className="text-xl font-bold tracking-tight text-gray-950">MyShop</Link>
					  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Entdecke sorgfältig ausgewählte Produkte.</p>
				</div>
				<nav aria-label="Fußnavigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-700">
					<Link href="/products" className="hover:text-emerald-800">Produkte</Link>
					<Link href="/cart" className="hover:text-emerald-800">Warenkorb</Link>
					<Link href="/register" className="hover:text-emerald-800">Registrieren</Link>
				</nav>
			</div>
			<div className="border-t border-gray-100">
				<p className="mx-auto max-w-7xl px-6 py-4 text-xs text-gray-500">© {new Date().getFullYear()} MyShop</p>
			</div>
		</footer>
	);
}
