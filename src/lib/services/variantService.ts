// lib/services/variantService.ts
import prisma from "@/lib/db";

// Get all variants for a product
export async function getProductVariants(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    include: {
      attributes: { include: { attributeValue: { include: { group: true } } } },
      inventories: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

// Create a variant with attributes and inventory
export async function createVariant(
  productId: string,
  data: {
    sku: string;
    barcode?: string;
    price: number;
    salePrice?: number;
    costPrice?: number;
    quantity: number;
    attributeValueIds?: string[];
    isDefault?: boolean;
    status?: string;
  }
) {
  // Check SKU unique
  const existing = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
  if (existing) throw new Error("SKU already exists");

  // Find or create default warehouse
  let warehouse = await prisma.warehouse.findFirst({ where: { name: "Main Warehouse" } });
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({ data: { name: "Main Warehouse" } });
  }

  // Prepare attributes connect
  const attributesConnect = data.attributeValueIds?.map((id) => ({
    attributeValueId: id,
  }));

  return prisma.productVariant.create({
    data: {
      productId,
      sku: data.sku,
      barcode: data.barcode,
      price: data.price,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      isDefault: data.isDefault ?? false,
      status: (data.status as any) || "ACTIVE",
      attributes: attributesConnect ? { create: attributesConnect } : undefined,
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
    include: {
      attributes: { include: { attributeValue: { include: { group: true } } } },
      inventories: true,
    },
  });
}

// Update a variant
export async function updateVariant(
  variantId: string,
  data: {
    sku?: string;
    barcode?: string;
    price?: number;
    salePrice?: number;
    costPrice?: number;
    quantity?: number;
    isDefault?: boolean;
    status?: string;
  }
) {
  // If quantity provided, update inventory
  if (data.quantity !== undefined) {
    const inventory = await prisma.inventory.findFirst({
      where: { variantId },
    });
    if (inventory) {
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: { quantity: data.quantity },
      });
    } else {
      // create inventory
      let warehouse = await prisma.warehouse.findFirst({ where: { name: "Main Warehouse" } });
      if (!warehouse) throw new Error("Warehouse not found");
      await prisma.inventory.create({
        data: {
          variantId,
          warehouseId: warehouse.id,
          quantity: data.quantity,
          reserved: 0,
          reorderLevel: 5,
        },
      });
    }
  }

  // Update variant fields
  return prisma.productVariant.update({
    where: { id: variantId },
    data: {
      sku: data.sku,
      barcode: data.barcode,
      price: data.price,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      isDefault: data.isDefault,
      status: data.status as any,
    },
  });
}

// Delete a variant
export async function deleteVariant(variantId: string) {
  // Ensure not the only variant? optional check
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: { include: { variants: true } } },
  });
  if (!variant) throw new Error("Variant not found");
  if (variant.product.variants.length === 1) {
    throw new Error("Cannot delete the only variant");
  }

  return prisma.productVariant.delete({ where: { id: variantId } });
}