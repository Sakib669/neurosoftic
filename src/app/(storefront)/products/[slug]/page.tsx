// app/(storefront)/products/[slug]/page.tsx
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { auth } from "../../../../../auth";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
      variants: {
        include: {
          attributes: {
            include: { attributeValue: { include: { group: true } } },
          },
          inventories: true,
        },
        orderBy: { createdAt: "asc" },
      },
      brand: true,
      category: true,
    },
  });

  if (!product) notFound();

  // Build attribute groups for variant selection (still needed for fallback)
  const attributeGroups = new Map<
    string,
    { id: string; name: string; values: { id: string; value: string }[] }
  >();

  for (const variant of product.variants) {
    for (const attr of variant.attributes) {
      const group = attr.attributeValue.group;
      if (!attributeGroups.has(group.id)) {
        attributeGroups.set(group.id, {
          id: group.id,
          name: group.name,
          values: [],
        });
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
      isLoggedIn={isLoggedIn}
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        brandName: product.brand.name,            // ✅ added
        categoryName: product.category.name,      // ✅ added
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
            groupName: a.attributeValue.group.name,   // ✅ added
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