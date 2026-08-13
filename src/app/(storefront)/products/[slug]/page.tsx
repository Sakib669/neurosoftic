// app/(storefront)/products/[slug]/page.tsx
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  // In Next.js 16, params is a Promise
  params: Promise<{ slug: string }>;
}) {
  // Await params to get the slug
  const { slug } = await params;

  // Use findFirst because we also filter by status (not a unique field)
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
      variants: {
        include: {
          attributes: {
            include: { attributeValue: { include: { group: true } } },
          },
          inventories: true, // plural relation
        },
        orderBy: { createdAt: "asc" },
      },
      brand: true,
      category: true,
    },
  });

  if (!product) notFound();

  // Get all attribute groups and values for the variant selector
  const attributeGroups = new Map<
    string,
    { name: string; values: { id: string; value: string }[] }
  >();

  for (const variant of product.variants) {
    for (const attr of variant.attributes) {
      const group = attr.attributeValue.group;
      if (!attributeGroups.has(group.id)) {
        attributeGroups.set(group.id, { name: group.name, values: [] });
      }
      const groupEntry = attributeGroups.get(group.id)!;
      if (!groupEntry.values.some((v) => v.id === attr.attributeValue.id)) {
        groupEntry.values.push({
          id: attr.attributeValue.id,
          value: attr.attributeValue.value,
        });
      }
    }
  }

  const groups = Array.from(attributeGroups.values());

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        media: product.media.map((m) => ({
          url: m.url,
          altText: m.altText || product.name,
        })),
        basePrice: Number(product.variants[0]?.price || 0),
        salePrice: product.variants[0]?.salePrice
          ? Number(product.variants[0].salePrice)
          : null,
        variants: product.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          price: Number(v.price),
          salePrice: v.salePrice ? Number(v.salePrice) : null,
          attributes: v.attributes.map((a) => ({
            groupId: a.attributeValue.groupId,
            valueId: a.attributeValue.id,
            value: a.attributeValue.value,
          })),
          stock:
            v.inventories?.reduce(
              (sum: number, inv: { quantity: number }) => sum + inv.quantity,
              0,
            ) || 0,
        })),
        attributeGroups: groups,
      }}
    />
  );
}
