// lib/services/searchService.ts
import prisma from "@/lib/db";

export type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  altText: string | null;
  rank: number;
};

// Search products using PostgreSQL full-text search.
// Returns products ranked by relevance.
export async function searchProducts(query: string): Promise<SearchProduct[]> {
  const q = query.trim();
  if (!q) return [];

  // Use plainto_tsquery to parse plain text into a tsquery.
  // We search on name and description (and optionally short description).
  const results = await prisma.$queryRaw<any[]>`
    SELECT
      p.id,
      p.slug,
      p.name,
      p.description,
      p."shortDescription",
      p.status,
      ts_rank(
        to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p."shortDescription", '')),
        plainto_tsquery('english', ${q})
      ) AS rank,
      (
        SELECT v.price
        FROM "ProductVariant" v
        WHERE v."productId" = p.id
        ORDER BY v."isDefault" DESC, v."createdAt" ASC
        LIMIT 1
      ) AS price,
      (
        SELECT v."salePrice"
        FROM "ProductVariant" v
        WHERE v."productId" = p.id
        ORDER BY v."isDefault" DESC, v."createdAt" ASC
        LIMIT 1
      ) AS "salePrice",
      (
        SELECT m.url
        FROM "Media" m
        WHERE m."productId" = p.id AND m.primary = true
        LIMIT 1
      ) AS "imageUrl",
      (
        SELECT m."altText"
        FROM "Media" m
        WHERE m."productId" = p.id AND m.primary = true
        LIMIT 1
      ) AS "altText"
    FROM "Product" p
    WHERE p.status = 'ACTIVE'
      AND to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p."shortDescription", ''))
          @@ plainto_tsquery('english', ${q})
    ORDER BY rank DESC
    LIMIT 50;
  `;

  // Map raw results to SearchProduct type
  return results.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    price: Number(r.price ?? 0),
    salePrice: r.salePrice ? Number(r.salePrice) : null,
    imageUrl: r.imageUrl,
    altText: r.altText,
    rank: Number(r.rank ?? 0),
  }));
}
