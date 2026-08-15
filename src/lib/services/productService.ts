// lib/services/productService.ts
import prisma from "@/lib/db";
import { generateBarcode } from "@/lib/barcode";
import type { CreateProductInput } from "@/lib/validators/product";

// Helper to get or create attribute value
async function getOrCreateAttributeValue(groupCode: string, groupName: string, value: string) {
  let group = await prisma.attributeGroup.findUnique({ where: { code: groupCode } });
  if (!group) {
    group = await prisma.attributeGroup.create({
      data: { name: groupName, code: groupCode, sortOrder: 1 },
    });
  }
  let attrValue = await prisma.attributeValue.findFirst({
    where: { groupId: group.id, value },
  });
  if (!attrValue) {
    attrValue = await prisma.attributeValue.create({
      data: { groupId: group.id, value, code: value.padStart(4, "0").slice(0, 4) },
    });
  }
  return attrValue;
}

export async function createProduct(data: CreateProductInput) {
  // Check existing slug/SKU
  const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existingSlug) throw new Error("Slug already in use");

  const existingSku = await prisma.productVariant.findUnique({ where: { sku: data.sku } });
  if (existingSku) throw new Error("SKU already in use");

  // Find category to get prefix
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  const categoryPrefix = category?.prefix || "00";

  // Generate barcode if not provided
  const barcode = data.barcode || await generateBarcode(categoryPrefix, "0000");

  // Find or create default warehouse
  let warehouse = await prisma.warehouse.findFirst({ where: { name: "Main Warehouse" } });
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({ data: { name: "Main Warehouse" } });
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
        ? { create: [{ url: data.mediaUrl, altText: data.name, primary: true, sortOrder: 1 }] }
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

  const variant = product.variants[0];

  // Attach car attributes if provided
  const carAttributes = [
    { code: "year", name: "Year", value: data.year },
    { code: "mileage", name: "Mileage", value: data.mileage },
    { code: "body_type", name: "Body Type", value: data.bodyType },
    { code: "fuel_type", name: "Fuel Type", value: data.fuelType },
    { code: "transmission", name: "Transmission", value: data.transmission },
    { code: "drive_type", name: "Drive Type", value: data.driveType },
    { code: "color", name: "Color", value: data.color },
  ].filter((attr) => attr.value);

  for (const attr of carAttributes) {
    const attrValue = await getOrCreateAttributeValue(attr.code, attr.name, attr.value!);
    await prisma.variantAttribute.create({
      data: {
        variantId: variant.id,
        attributeValueId: attrValue.id,
      },
    });
  }

  return product;
}

// ... keep updateProduct and updateDefaultVariant from before