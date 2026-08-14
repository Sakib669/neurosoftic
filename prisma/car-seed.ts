// prisma/car-seed.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ---------- 1. Create categories ----------
  const categorySlugs = ["sedan", "suv", "truck", "coupe", "hatchback"];
  for (const slug of categorySlugs) {
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        prefix: (Math.floor(Math.random() * 90) + 10).toString(), // 2-digit prefix
        sortOrder: categorySlugs.indexOf(slug) + 1,
      },
    });
  }

  // ---------- 2. Create brands ----------
  const brandNames = ["Toyota", "BMW", "Mercedes-Benz", "Honda", "Ford", "Tesla", "Audi", "Lexus"];
  for (const name of brandNames) {
    await prisma.brand.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
  }

  // ---------- 3. Create attribute groups & values ----------
  const attrGroups = [
    { name: "Year", code: "year", values: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"] },
    { name: "Mileage", code: "mileage", values: ["0-10k", "10k-30k", "30k-60k", "60k-100k", "100k+"] },
    { name: "Fuel Type", code: "fuel_type", values: ["Gasoline", "Diesel", "Hybrid", "Electric"] },
    { name: "Transmission", code: "transmission", values: ["Automatic", "Manual", "CVT"] },
    { name: "Body Type", code: "body_type", values: ["Sedan", "SUV", "Coupe", "Hatchback", "Truck"] },
    { name: "Drive Type", code: "drive_type", values: ["FWD", "RWD", "AWD", "4WD"] },
    { name: "Color", code: "color", values: ["Black", "White", "Silver", "Gray", "Blue", "Red"] },
  ];

  const attrGroupMap: Record<string, any> = {};
  const attrValueMap: Record<string, any> = {};

  for (const group of attrGroups) {
    const createdGroup = await prisma.attributeGroup.upsert({
      where: { code: group.code },
      update: { name: group.name },
      create: { name: group.name, code: group.code, sortOrder: attrGroups.indexOf(group) + 1 },
    });
    attrGroupMap[group.code] = createdGroup;

    for (const val of group.values) {
      const code = val.padStart(4, "0").slice(0, 4); // normalize
      const value = await prisma.attributeValue.upsert({
        where: { id: `${createdGroup.id}-${val}` }, // id must be unique; this won't work because id is cuid; better use findFirst + create
        update: {},
        create: { groupId: createdGroup.id, value: val, code },
      }).catch(async () => {
        return prisma.attributeValue.findFirst({ where: { groupId: createdGroup.id, value: val } })!;
      });
      // Better: use findFirst then create
      let finalValue = await prisma.attributeValue.findFirst({
        where: { groupId: createdGroup.id, value: val },
      });
      if (!finalValue) {
        finalValue = await prisma.attributeValue.create({
          data: { groupId: createdGroup.id, value: val, code },
        });
      }
      attrValueMap[`${group.code}:${val}`] = finalValue;
    }
  }

  // ---------- 4. Create car products ----------
  const cars = [
    {
      name: "2022 Toyota Camry XSE",
      slug: "2022-toyota-camry-xse",
      brand: "Toyota",
      category: "Sedan",
      price: 28999,
      salePrice: 27999,
      year: "2022",
      mileage: "10k-30k",
      fuelType: "Gasoline",
      transmission: "Automatic",
      bodyType: "Sedan",
      driveType: "FWD",
      color: "Black",
      vin: "4T1K61AK1KU123456",
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
    },
    {
      name: "2021 BMW X5 xDrive40i",
      slug: "2021-bmw-x5-xdrive40i",
      brand: "BMW",
      category: "SUV",
      price: 52900,
      salePrice: 51900,
      year: "2021",
      mileage: "20k-40k",
      fuelType: "Gasoline",
      transmission: "Automatic",
      bodyType: "SUV",
      driveType: "AWD",
      color: "White",
      vin: "5UXCR6C07M9E12345",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    },
    // ... add as many cars as you need
  ];

  // Find or create default warehouse
  let warehouse = await prisma.warehouse.findFirst({ where: { name: "Main Warehouse" } });
  if (!warehouse) {
    warehouse = await prisma.warehouse.create({ data: { name: "Main Warehouse" } });
  }

  for (const car of cars) {
    // Find category and brand IDs
    const category = await prisma.category.findUnique({ where: { slug: car.category.toLowerCase() } });
    const brand = await prisma.brand.findUnique({ where: { slug: car.brand.toLowerCase().replace(/\s+/g, "-") } });
    if (!category || !brand) {
      console.error(`Missing category or brand for ${car.name}`);
      continue;
    }

    // Create product if not exists
    const product = await prisma.product.upsert({
      where: { slug: car.slug },
      update: {},
      create: {
        name: car.name,
        slug: car.slug,
        description: `${car.year} ${car.brand} ${car.bodyType} with ${car.mileage} miles.`,
        shortDescription: `${car.year} ${car.brand} ${car.bodyType}`,
        brandId: brand.id,
        categoryId: category.id,
        status: "ACTIVE",
        media: {
          create: [
            {
              url: car.imageUrl,
              altText: car.name,
              primary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    });

    // Create variant if not exists (using VIN as SKU)
    const existingVariant = await prisma.productVariant.findUnique({ where: { sku: car.vin } });
    if (!existingVariant) {
      // Get attribute value IDs
      const attrValueIds = [
        attrValueMap[`year:${car.year}`]?.id,
        attrValueMap[`mileage:${car.mileage}`]?.id,
        attrValueMap[`fuel_type:${car.fuelType}`]?.id,
        attrValueMap[`transmission:${car.transmission}`]?.id,
        attrValueMap[`body_type:${car.bodyType}`]?.id,
        attrValueMap[`drive_type:${car.driveType}`]?.id,
        attrValueMap[`color:${car.color}`]?.id,
      ].filter(Boolean) as string[];

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: car.vin,
          price: car.price,
          salePrice: car.salePrice,
          isDefault: true,
          status: "ACTIVE",
          attributes: {
            create: attrValueIds.map((id) => ({ attributeValueId: id })),
          },
          inventories: {
            create: [
              {
                warehouseId: warehouse.id,
                quantity: 1,
                reserved: 0,
                reorderLevel: 0,
              },
            ],
          },
        },
      });
    }
  }

  console.log("Car seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });