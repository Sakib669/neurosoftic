// app/(storefront)/search/page.tsx
import { searchProducts } from "@/lib/services/searchService";
import { ProductCard } from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {query ? `Search Results for "${query}"` : "Search"}
      </h1>
      <p className="text-sm text-on-surface-variant mb-6">
        {results.length} product{results.length !== 1 && "s"} found
      </p>

      {results.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          No products found. Try different keywords.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              imageUrl={product.imageUrl || "/placeholder.png"}
              altText={product.altText || product.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
