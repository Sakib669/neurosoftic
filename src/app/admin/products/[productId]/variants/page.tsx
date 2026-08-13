import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import VariantManager from "./VariantManager";

export default async function AdminProductVariantsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        include: {
          attributes: { include: { attributeValue: { include: { group: true } } } },
          inventories: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!product) notFound();

  // Get all attribute groups and values for selection
  const attributeGroups = await prisma.attributeGroup.findMany({
    where: { active: true },
    include: { values: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Variants for: {product.name}</h1>
      <p className="text-sm text-on-surface-variant mb-6">Manage SKUs, pricing, and stock.</p>
      <VariantManager
        productId={product.id}
        initialVariants={product.variants}
        attributeGroups={attributeGroups}
      />
    </div>
  );
}