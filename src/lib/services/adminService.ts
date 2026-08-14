// lib/services/adminService.ts
import prisma from "@/lib/db";

// Get all users with their role and basic info
export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Update a user's role
export async function updateUserRole(userId: string, newRole: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
  });
}

// Get KPIs for dashboard
export async function getDashboardStats() {
  const [totalRevenue, totalOrders, inventoryValue, lowStockCount] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.order.count(),
      prisma.inventory.aggregate({
        _sum: { quantity: true },
      }),
      prisma.inventory.count({
        where: { quantity: { lte: prisma.inventory.fields.reorderLevel } },
      }),
    ]);

  // Calculate inventory value (simplified: using cost price of variants)
  const inventoryValueData = await prisma.productVariant.aggregate({
    _sum: { costPrice: true },
  });

  return {
    totalRevenue: totalRevenue._sum.total?.toNumber() || 0,
    totalOrders,
    inventoryValue: inventoryValueData._sum.costPrice?.toNumber() || 0,
    lowStockCount,
  };
}

// Get recent orders for dashboard table
export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      customer: { select: { name: true, email: true } }, // ✅ correct relation
    },
  });
}

// Get low stock products
export async function getLowStockProducts(limit = 5) {
  const inventories = await prisma.inventory.findMany({
    where: { quantity: { lte: prisma.inventory.fields.reorderLevel } },
    take: limit,
    include: {
      variant: {
        include: {
          product: {
            select: {
              name: true,
              media: { where: { primary: true }, take: 1 },
            },
          },
        },
      },
    },
  });
  return inventories;
}
