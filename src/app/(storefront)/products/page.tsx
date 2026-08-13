// app/(storefront)/products/page.tsx
import prisma from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic"; // Ensure fresh data on each request

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

  // Build the `where` clause for products
  const where: any = { status: "ACTIVE" };

  // Keyword search on name/description
  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  // Category filter (by slug)
  if (sp.category) {
    where.category = { slug: sp.category };
  }

  // Brand filter (by slug)
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

  // In-stock filter: at least one variant with inventory > 0
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

  // Dynamic attribute filters (e.g., attr_{groupId}=valueId)
  // We'll handle by adding a variant filter for each selected attribute value.
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
    orderBy = { variants: { _count: "asc" } }; // Not real price sort; we'll improve later.
    // Better: use orderBy on the variant price via some relation is complex.
    // For now, we'll sort in memory after fetch.
  } else if (sp.sort === "price-desc") {
    orderBy = { variants: { _count: "desc" } };
  } else if (sp.sort === "name-asc") {
    orderBy = { name: "asc" };
  }

  // Fetch products with needed includes
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

  // Post-process products to extract price and availability
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

  // If sorting by price, sort productCards in memory
  if (sp.sort === "price-asc") {
    productCards.sort(
      (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
    );
  } else if (sp.sort === "price-desc") {
    productCards.sort(
      (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
    );
  }

  // Fetch categories and brands for filter sidebar
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  // Fetch attribute groups and values for dynamic filters (limited to active groups)
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
          {sp.q ? `Search results for "${sp.q}"` : "All Products"}
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {productCards.length} product{productCards.length !== 1 && "s"} found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <form method="GET" action="/products" className="space-y-6">
            {/* Keyword hidden input */}
            {sp.q && <input type="hidden" name="q" value={sp.q} />}

            {/* Category */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Category</h3>
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
                    className={`block text-sm hover:text-primary ${sp.category === cat.slug ? "text-primary font-medium" : ""}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Brand</h3>
              <select
                name="brand"
                className="w-full rounded border border-outline-variant px-3 py-2 text-sm"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option
                    key={b.id}
                    value={b.slug}
                    selected={sp.brand === b.slug}
                  >
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
              <label className="text-sm">In Stock Only</label>
            </div>

            {/* Dynamic attribute filters */}
            {attributeGroups.map((group) => (
              <div key={group.id}>
                <h3 className="font-semibold mb-2 text-sm">{group.name}</h3>
                <select
                  name={`attr_${group.id}`}
                  className="w-full rounded border border-outline-variant px-3 py-2 text-sm"
                  defaultValue={(sp[`attr_${group.id}`] as string) || ""}
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
              <select
                name="sort"
                className="rounded border border-outline-variant px-2 py-1 text-sm"
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", e.target.value);
                  window.location.href = url.toString();
                }}
                defaultValue={sp.sort || ""}
              >
                <option value="">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {productCards.length === 0 ? (
            <p className="text-on-surface-variant">
              No products found. Try adjusting your filters.
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
                  badge={!product.inStock ? "Out of Stock" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
