// prisma/seed.ts
import "dotenv/config"; // Load .env for DATABASE_URL
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

// Create the adapter and pass it to PrismaClient
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ---- Default admin user ----
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { email: "admin@neurosoftic.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@neurosoftic.com",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      customer: { create: {} },
    },
  });

  // ---- Theme config ----
  const themeDefaults = [
    { key: "primary", value: "#000666" },
    { key: "primaryContainer", value: "#1a237e" },
    { key: "secondary", value: "#505f76" },
    { key: "background", value: "#fcf9f8" },
    { key: "surface", value: "#fcf9f8" },
    { key: "surfaceContainer", value: "#f0eded" },
    { key: "onSurface", value: "#1c1b1b" },
    { key: "onPrimary", value: "#ffffff" },
    { key: "headingFont", value: "Outfit" },
    { key: "bodyFont", value: "Inter" },
    { key: "borderRadius", value: "0.5rem" },
  ];

  for (const t of themeDefaults) {
    await prisma.themeConfig.upsert({
      where: { key: t.key },
      update: { value: t.value },
      create: { key: t.key, value: t.value },
    });
  }

  // ---- Categories ----
  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: { name: "Clothing", slug: "clothing", prefix: "12", sortOrder: 1 },
  });
  const footwear = await prisma.category.upsert({
    where: { slug: "footwear" },
    update: {},
    create: { name: "Footwear", slug: "footwear", prefix: "13", sortOrder: 2 },
  });
  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      prefix: "14",
      sortOrder: 3,
    },
  });

  // ---- Brand ----
  const brand = await prisma.brand.upsert({
    where: { slug: "neurosoftic" },
    update: {},
    create: { name: "Neurosoftic", slug: "neurosoftic" },
  });

  // ---- Attribute groups ----
  const sizeGroup = await prisma.attributeGroup.upsert({
    where: { code: "size" },
    update: {},
    create: { name: "Size", code: "size", sortOrder: 1 },
  });
  const colorGroup = await prisma.attributeGroup.upsert({
    where: { code: "color" },
    update: {},
    create: { name: "Color", code: "color", sortOrder: 2 },
  });

  // Helper to get or create attribute value
  async function getOrCreateAttributeValue(
    groupId: string,
    value: string,
    code: string,
  ) {
    const existing = await prisma.attributeValue.findFirst({
      where: { groupId, value },
    });
    if (existing) return existing;
    return prisma.attributeValue.create({
      data: { groupId, value, code },
    });
  }

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Black", "White", "Blue"];

  const sizeValues = [];
  for (const s of sizes) {
    sizeValues.push(
      await getOrCreateAttributeValue(sizeGroup.id, s, s.padStart(4, "0")),
    );
  }
  const colorValues = [];
  for (const c of colors) {
    colorValues.push(
      await getOrCreateAttributeValue(colorGroup.id, c, c.padStart(4, "0")),
    );
  }

  // ---- Create warehouse (find or create) ----
  let mainWarehouse = await prisma.warehouse.findFirst({
    where: { name: "Main Warehouse" },
  });
  if (!mainWarehouse) {
    mainWarehouse = await prisma.warehouse.create({
      data: { name: "Main Warehouse" },
    });
  }

  // ---- Create sample product ----
  const product = await prisma.product.upsert({
    where: { slug: "premium-cotton-t-shirt" },
    update: {},
    create: {
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-t-shirt",
      description: "A high-quality cotton t-shirt with a modern fit.",
      shortDescription: "Soft, breathable, and perfect for everyday wear.",
      brandId: brand.id,
      categoryId: clothing.id,
      status: "ACTIVE",
      media: {
        create: [
          {
            url: "https://via.placeholder.com/600x800?text=T-Shirt+Black",
            altText: "Black T-Shirt",
            primary: true,
            sortOrder: 1,
          },
          {
            url: "https://via.placeholder.com/600x800?text=T-Shirt+White",
            altText: "White T-Shirt",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // ---- Create variants ----
  let variantCount = 1;
  for (const size of sizeValues) {
    for (const color of colorValues) {
      const sku = `NS-${size.value}-${color.value}-${variantCount}`;
      const barcode = `12${size.code}${variantCount.toString().padStart(4, "0")}00`; // 12-digit placeholder
      const existingVariant = await prisma.productVariant.findUnique({
        where: { sku },
      });
      if (!existingVariant) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku,
            barcode,
            price: 49.99,
            salePrice: 39.99,
            costPrice: 20.0,
            weight: 0.3,
            isDefault: variantCount === 1,
            status: "ACTIVE",
            attributes: {
              create: [
                { attributeValueId: size.id },
                { attributeValueId: color.id },
              ],
            },
            inventories: {
              create: [
                {
                  warehouseId: mainWarehouse.id,
                  quantity: 100,
                  reserved: 0,
                  reorderLevel: 10,
                },
              ],
            },
          },
        });
        variantCount++;
      }
    }
  }

  // ---- Homepage sections ----
  const existingHero = await prisma.homepageSection.findFirst({
    where: { type: "hero" },
  });
  if (!existingHero) {
    await prisma.homepageSection.createMany({
      data: [
        {
          type: "hero",
          title: "Elevate Your Aesthetic",
          subtitle: "Curated pieces for the modern visionary.",
          config: { ctaLabel: "Shop Now", ctaUrl: "/products" },
          sortOrder: 1,
          active: true,
        },
        {
          type: "category_grid",
          title: "Shop by Category",
          config: {},
          sortOrder: 2,
          active: true,
        },
        {
          type: "product_carousel",
          title: "Featured Products",
          config: { query: "featured" },
          sortOrder: 3,
          active: true,
        },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
