// lib/services/productService.ts
import prisma from "@/lib/db";
import { generateBarcode } from "../barcode";
import type { CreateProductInput } from "../validators/product";

// Create a product with default variant and inventory, auto-generating barcode
export async function createProduct(data: CreateProductInput) {
  // Check existing slug and SKU
  const existingSlug = await prisma.product.findUnique({
    where: { slug: data.slug },
  });
  if (existingSlug) throw new Error("Slug already in use");

  const existingSku = await prisma.productVariant.findUnique({
    where: { sku: data.sku },
  });
  if (existingSku) throw new Error("SKU already in use");

  // Find category to get prefix
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  const categoryPrefix = category?.prefix || "00";

  // Generate barcode if not provided
  const barcode =
    data.barcode || (await generateBarcode(categoryPrefix, "0000"));

  // Find or create default warehouse
  let warehouse = await prisma.warehouse.findFirst({
    where: { name: "Main Warehouse" },
  });
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: { name: "Main Warehouse" },
    });
  }

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
            barcode,
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

// Update product basic information
export async function updateProduct(
  productId: string,
  data: Partial<CreateProductInput> & { mediaUrl?: string },
) {
  // Check slug uniqueness if slug changed
  if (data.slug) {
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing && existing.id !== productId) {
      throw new Error("Slug already in use");
    }
  }

  // Update product basic fields
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      brandId: data.brandId,
      categoryId: data.categoryId,
      status: data.status,
    },
  });

  // If mediaUrl provided, update or create primary media
  if (data.mediaUrl) {
    const existingPrimary = await prisma.media.findFirst({
      where: { productId, primary: true },
    });
    if (existingPrimary) {
      await prisma.media.update({
        where: { id: existingPrimary.id },
        data: { url: data.mediaUrl },
      });
    } else {
      await prisma.media.create({
        data: {
          productId,
          url: data.mediaUrl,
          altText: data.name || "",
          primary: true,
          sortOrder: 1,
        },
      });
    }
  }

  return updatedProduct;
}

// Update default variant price and quantity
export async function updateDefaultVariant(
  productId: string,
  data: { price: number; salePrice?: number; quantity?: number; sku?: string },
) {
  const defaultVariant = await prisma.productVariant.findFirst({
    where: { productId, isDefault: true },
  });
  if (!defaultVariant) throw new Error("Default variant not found");

  const updateData: any = {
    price: data.price,
    salePrice: data.salePrice,
    sku: data.sku,
  };

  await prisma.productVariant.update({
    where: { id: defaultVariant.id },
    data: updateData,
  });

  if (data.quantity !== undefined) {
    // Find inventory for the default variant and update quantity
    const inventory = await prisma.inventory.findFirst({
      where: { variantId: defaultVariant.id },
    });
    if (inventory) {
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: { quantity: data.quantity },
      });
    } else {
      // Create inventory if missing
      const warehouse = await prisma.warehouse.findFirst({
        where: { name: "Main Warehouse" },
      });
      if (!warehouse) throw new Error("Warehouse not found");
      await prisma.inventory.create({
        data: {
          variantId: defaultVariant.id,
          warehouseId: warehouse.id,
          quantity: data.quantity,
          reserved: 0,
          reorderLevel: 5,
        },
      });
    }
  }

  return { success: true };
}
