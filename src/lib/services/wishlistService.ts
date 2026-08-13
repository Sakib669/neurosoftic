// lib/services/wishlistService.ts
import prisma from "@/lib/db";

export async function getWishlistItems(userId: string) {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  if (!customer) return [];

  return prisma.wishlistItem.findMany({
    where: { customerId: customer.id },
    include: {
      variant: {
        include: {
          product: { include: { media: { where: { primary: true }, take: 1 } } },
          attributes: { include: { attributeValue: true } },
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });
}

export async function addToWishlist(userId: string, variantId: string) {
  const customer = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!customer) throw new Error("Customer profile not found");

  await prisma.wishlistItem.upsert({
    where: {
      customerId_variantId: {
        customerId: customer.id,
        variantId,
      },
    },
    update: {},
    create: {
      customerId: customer.id,
      variantId,
    },
  });
}

export async function removeFromWishlist(userId: string, variantId: string) {
  const customer = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!customer) throw new Error("Customer profile not found");

  await prisma.wishlistItem.deleteMany({
    where: {
      customerId: customer.id,
      variantId,
    },
  });
}

export async function isInWishlist(userId: string, variantId: string) {
  const customer = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!customer) return false;

  const item = await prisma.wishlistItem.findUnique({
    where: {
      customerId_variantId: {
        customerId: customer.id,
        variantId,
      },
    },
  });
  return !!item;
}