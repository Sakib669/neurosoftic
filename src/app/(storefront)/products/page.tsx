// app/(storefront)/products/page.tsx
import { ProductCard } from "@/components/storefront/ProductCard";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; q?: string };
}) {
  // Build where clause for filtering active products
  const where: any = { status: "ACTIVE" };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  // Determine sorting
  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    // We'll sort by the default variant's price (or min price). This is simplified.
    orderBy = { variants: { _count: "asc" } }; // Placeholder; we'll improve later.
  } else if (searchParams.sort === "price-desc") {
    orderBy = { variants: { _count: "desc" } };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      media: { where: { primary: true }, take: 1 },
      variants: { orderBy: { price: "asc" }, take: 1 },
      brand: true,
      category: true,
    },
    orderBy,
    take: 20,
  });

  // Transform to simple props for ProductCard
  const productCards = products.map((p) => {
    const defaultVariant = p.variants[0];
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: defaultVariant ? Number(defaultVariant.price) : 0,
      salePrice: defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null,
      imageUrl: p.media[0]?.url || "/placeholder.png",
      altText: p.media[0]?.altText || p.name,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-on-surface">
          {searchParams.q ? `Search results for "${searchParams.q}"` : "All Products"}
        </h1>
        <select className="rounded border border-outline-variant px-3 py-2 text-sm">
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {productCards.length === 0 ? (
        <p className="text-on-surface-variant">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCards.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}