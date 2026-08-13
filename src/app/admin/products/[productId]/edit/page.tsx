// app/admin/products/[productId]/edit/page.tsx
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: { where: { isDefault: true }, take: 1, include: { inventories: true } },
      media: { where: { primary: true }, take: 1 },
    },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  const defaultVariant = product.variants[0];
  const primaryMedia = product.media[0];

  const initialData = {
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    shortDescription: product.shortDescription || "",
    brandId: product.brandId,
    categoryId: product.categoryId,
    price: defaultVariant ? Number(defaultVariant.price) : 0,
    salePrice: defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : undefined,
    quantity: defaultVariant?.inventories?.[0]?.quantity ?? 0,
    sku: defaultVariant?.sku || "",
    status: product.status,
    mediaUrl: primaryMedia?.url || "",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <EditProductForm
        productId={product.id}
        initialData={initialData}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}