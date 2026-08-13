// lib/services/productService.ts
import prisma from "@/lib/db";
import type { CreateProductInput } from "@/lib/validators/product";

export async function createProduct(data: CreateProductInput) {
  // Check for existing slug or SKU
  const existingSlug = await prisma.product.findUnique({
    where: { slug: data.slug },
  });
  if (existingSlug) throw new Error("Slug already in use");

  const existingSku = await prisma.productVariant.findUnique({
    where: { sku: data.sku },
  });
  if (existingSku) throw new Error("SKU already in use");

  // Find or create default warehouse
  let warehouse = await prisma.warehouse.findFirst({
    where: { name: "Main Warehouse" },
  });
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: { name: "Main Warehouse" },
    });
  }

  // Create product with default variant and inventory
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      brandId: data.brandId,
      categoryId: data.categoryId,
      status: data.status,
      media: data.mediaUrl
        ? {
            create: [
              {
                url: data.mediaUrl,
                altText: data.name,
                primary: true,
                sortOrder: 1,
              },
            ],
          }
        : undefined,
      variants: {
        create: [
          {
            sku: data.sku,
            barcode: data.barcode,
            price: data.price,
            salePrice: data.salePrice,
            costPrice: data.costPrice,
            isDefault: true,
            status: data.status,
            inventories: {
              create: [
                {
                  warehouseId: warehouse.id,
                  quantity: data.quantity,
                  reserved: 0,
                  reorderLevel: 5,
                },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  });

  return product;
}
