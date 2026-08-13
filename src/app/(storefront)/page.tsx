// app/(storefront)/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-100 rounded-xl overflow-hidden bg-surface-container">
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-primary/40 flex items-center justify-center">
          <div className="text-center text-on-primary">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Elevate Your Aesthetic
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">
              Curated pieces for the modern visionary.
            </p>
            <Link
              href="/products"
              className="inline-block bg-on-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface-container transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Clothing", "Footwear", "Accessories", "Beauty", "Electronics", "Home"].map(
            (cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat.toLowerCase()}`}
                className="group block"
              >
                <div className="aspect-square rounded-xl bg-surface-container hover:shadow-md transition flex items-center justify-center">
                  <span className="text-on-surface/60 group-hover:text-primary">
                    {cat}
                  </span>
                </div>
                <p className="mt-2 text-center text-sm text-on-surface">{cat}</p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Featured Products (placeholder) */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* We'll replace with actual product cards later */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-outline-variant overflow-hidden">
              <div className="aspect-square bg-surface-container" />
              <div className="p-4">
                <h3 className="font-medium">Product {i}</h3>
                <p className="text-sm text-on-surface-variant">$99.00</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}