// lib/services/homepageService.ts
import prisma from "@/lib/db";

// Fetch active homepage sections ordered by sortOrder
export async function getActiveHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

// Helper to get categories for category_grid
export async function getFeaturedCategories() {
  return prisma.category.findMany({
    where: { active: true },
    take: 6,
    orderBy: { sortOrder: "asc" },
  });
}

// Helper to get featured products for product_carousel
export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    take: limit,
    include: {
      media: { where: { primary: true }, take: 1 },
      variants: { orderBy: { price: "asc" }, take: 1 },
    },
  });
}