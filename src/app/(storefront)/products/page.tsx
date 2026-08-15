// app/(storefront)/products/page.tsx
import prisma from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const sp = await searchParams;

  // Build the `where` clause for car listings
  const where: any = { status: "ACTIVE" };

  // Keyword search on name/description
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  // Category filter
  if (sp.category) {
    where.category = { slug: sp.category };
  }

  // Brand filter
  if (sp.brand) {
    where.brand = { slug: sp.brand };
  }

  // Price range filter on default variant price
  if (sp.minPrice || sp.maxPrice) {
    where.variants = {
      some: {
        isDefault: true,
        ...(sp.minPrice && { price: { gte: Number(sp.minPrice) } }),
        ...(sp.maxPrice && { price: { lte: Number(sp.maxPrice) } }),
      },
    };
  }

  // In-stock filter
  if (sp.inStock === "1") {
    where.variants = {
      some: {
        ...(where.variants?.some || {}),
        inventories: {
          some: { quantity: { gt: 0 } },
        },
      },
    };
  }

  // Dynamic attribute filters (Year, Mileage, Body Type, etc.)
  const attributeFilters: { valueId: string }[] = [];
  for (const [key, value] of Object.entries(sp)) {
    if (key.startsWith("attr_") && typeof value === "string") {
      attributeFilters.push({ valueId: value });
    }
  }
  if (attributeFilters.length > 0) {
    where.variants = {
      some: {
        ...(where.variants?.some || {}),
        attributes: {
          some: {
            attributeValueId: { in: attributeFilters.map((f) => f.valueId) },
          },
        },
      },
    };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sp.sort === "price-asc") {
    orderBy = { createdAt: "asc" };
  } else if (sp.sort === "price-desc") {
    orderBy = { createdAt: "desc" };
  } else if (sp.sort === "name-asc") {
    orderBy = { name: "asc" };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      media: { where: { primary: true }, take: 1 },
      variants: {
        where: { isDefault: true },
        take: 1,
        include: { inventories: true },
      },
      brand: true,
      category: true,
    },
    orderBy,
    take: 100,
  });

  // Map to product cards (cars)
  let productCards = products.map((p) => {
    const defaultVariant = p.variants[0];
    const inStock =
      defaultVariant?.inventories?.some((inv) => inv.quantity > 0) ?? false;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: defaultVariant ? Number(defaultVariant.price) : 0,
      salePrice: defaultVariant?.salePrice
        ? Number(defaultVariant.salePrice)
        : null,
      imageUrl: p.media[0]?.url || "/placeholder.png",
      altText: p.media[0]?.altText || p.name,
      inStock,
    };
  });

  // Sort in memory for price
  if (sp.sort === "price-asc") {
    productCards.sort(
      (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
    );
  } else if (sp.sort === "price-desc") {
    productCards.sort(
      (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
    );
  }

  // Fetch categories and brands for filters
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  // Fetch attribute groups for dynamic filters (Year, Mileage, Body Type, etc.)
  const attributeGroups = await prisma.attributeGroup.findMany({
    where: { active: true },
    include: {
      values: { where: { active: true }, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">
          {sp.q ? `Search results for "${sp.q}"` : "Browse Cars"}
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {productCards.length} car{productCards.length !== 1 && "s"} found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <form method="GET" action="/products" className="space-y-6">
            {sp.q && <input type="hidden" name="q" value={sp.q} />}

            {/* Category */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Body Type</h3>
              <div className="space-y-1">
                <Link
                  href="/products"
                  className="block text-sm hover:text-primary"
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}${sp.q ? `&q=${sp.q}` : ""}`}
                    className={`block text-sm hover:text-primary ${
                      sp.category === cat.slug ? "text-primary font-medium" : ""
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brand filter */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Brand</h3>
              <select
                name="brand"
                defaultValue={sp.brand || ""}
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Price</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  defaultValue={sp.minPrice}
                  className="w-1/2 rounded border border-outline-variant px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  defaultValue={sp.maxPrice}
                  className="w-1/2 rounded border border-outline-variant px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* In stock toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                value="1"
                defaultChecked={sp.inStock === "1"}
                className="rounded border-outline-variant"
              />
              <label className="text-sm">Available Only</label>
            </div>

            {/* Dynamic attribute filters (Year, Mileage, Fuel Type, etc.) */}
            {attributeGroups.map((group) => (
              <div key={group.id}>
                <h3 className="font-semibold mb-2 text-sm">{group.name}</h3>
                <select
                  name={`attr_${group.id}`}
                  defaultValue={(sp[`attr_${group.id}`] as string) || ""}
                  className="w-full rounded border border-outline-variant px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  {group.values.map((val) => (
                    <option key={val.id} value={val.id}>
                      {val.value}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="submit"
              className="w-full rounded bg-primary px-4 py-2 text-sm text-on-primary hover:bg-primary-container"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-2">
              <label className="text-sm">Sort by:</label>
              <form method="GET" action="/products">
                {sp.q && <input type="hidden" name="q" value={sp.q} />}
                {sp.category && (
                  <input type="hidden" name="category" value={sp.category} />
                )}
                {sp.brand && (
                  <input type="hidden" name="brand" value={sp.brand} />
                )}
                {sp.minPrice && (
                  <input type="hidden" name="minPrice" value={sp.minPrice} />
                )}
                {sp.maxPrice && (
                  <input type="hidden" name="maxPrice" value={sp.maxPrice} />
                )}
                {sp.inStock === "1" && (
                  <input type="hidden" name="inStock" value="1" />
                )}

                <select
                  name="sort"
                  defaultValue={sp.sort || ""}
                  className="rounded border border-outline-variant px-2 py-1 text-sm"
                >
                  <option value="">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <button type="submit" className="sr-only">
                  Apply sort
                </button>
              </form>
            </div>
          </div>

          {productCards.length === 0 ? (
            <p className="text-on-surface-variant">
              No cars found. Try adjusting your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productCards.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  salePrice={product.salePrice}
                  imageUrl={product.imageUrl}
                  altText={product.altText}
                  badge={!product.inStock ? "Sold" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}