// components/storefront/sections/CategoryGrid.tsx
import Link from "next/link";

type Category = { id: string; name: string; slug: string; image?: string | null };

export default function CategoryGrid({ title, categories }: { title?: string; categories: Category[] }) {
  return (
    <section className="mt-12">
      {title && <h2 className="text-2xl font-bold text-on-surface mb-6">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group block">
            <div className="aspect-square rounded-xl bg-surface-container hover:shadow-md transition overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-on-surface/60 group-hover:text-primary">{cat.name}</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-center text-sm text-on-surface">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}