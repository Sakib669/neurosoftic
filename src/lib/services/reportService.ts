// lib/services/reportService.ts
import prisma from "@/lib/db";

// Sales summary: total revenue, orders count, average order value
export async function getSalesSummary() {
  const [totalRevenueAgg, orderCount, avgOrderAgg] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: { in: ["PAID", "PARTIALLY_PAID"] } },
    }),
    prisma.order.count({
      where: { paymentStatus: { in: ["PAID", "PARTIALLY_PAID"] } },
    }),
    prisma.order.aggregate({
      _avg: { total: true },
      where: { paymentStatus: { in: ["PAID", "PARTIALLY_PAID"] } },
    }),
  ]);

  return {
    totalRevenue: totalRevenueAgg._sum.total?.toNumber() || 0,
    orderCount,
    averageOrderValue: avgOrderAgg._avg.total?.toNumber() || 0,
  };
}

// Top selling products (by quantity sold)
export async function getTopProducts(limit = 5) {
  const topItems = await prisma.orderItem.groupBy({
    by: ["variantId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const variantIds = topItems.map((item) => item.variantId);

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: { select: { name: true } },
    },
  });

  const result = topItems.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    return {
      variantId: item.variantId,
      productName: variant?.product.name || "Unknown",
      quantitySold: item._sum.quantity || 0,
    };
  });

  return result;
}

// Order status breakdown
export async function getOrderStatusBreakdown() {
  const counts = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return counts.map((c) => ({
    status: c.status,
    count: c._count.status,
  }));
}