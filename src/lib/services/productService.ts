// lib/services/productService.ts (add update functions)

import prisma from "../db";
import { CreateProductInput } from "../validators/product";

export async function updateProduct(
  productId: string,
  data: Partial<CreateProductInput> & { mediaUrl?: string }
) {
  // Check slug uniqueness if slug changed
  if (data.slug) {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
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
  data: { price: number; salePrice?: number; quantity?: number; sku?: string }
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
      const warehouse = await prisma.warehouse.findFirst({ where: { name: "Main Warehouse" } });
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