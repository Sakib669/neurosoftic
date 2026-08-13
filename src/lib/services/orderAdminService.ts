// lib/services/orderAdminService.ts
import prisma from "@/lib/db";

// Get all orders for admin (with pagination placeholders)
export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      items: { select: { id: true } },
    },
    take: 100,
  });
}

// Get a single order by order number with full details
export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      shippingAddress: true,
      billingAddress: true,
      items: {
        include: {
          variant: {
            include: {
              product: { select: { name: true, media: { where: { primary: true }, take: 1 } } },
            },
          },
        },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
      payments: true,
      shipment: true,
    },
  });
}

// Update order status and create history entry
export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  actorId?: string,
  note?: string
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const fromStatus = order.status;

  return prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus as any },
    });

    // Create status history
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        fromStatus: fromStatus as any,
        toStatus: newStatus as any,
        note: note || `Status changed from ${fromStatus} to ${newStatus}`,
        actorId,
      },
    });

    // If cancelled/returned, release reserved stock
    if (newStatus === "CANCELLED" || newStatus === "RETURNED") {
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await tx.inventory.updateMany({
          where: { variantId: item.variantId, reserved: { gte: item.quantity } },
          data: { reserved: { decrement: item.quantity } },
        });
      }
    }

    // If delivered, reduce actual quantity and reserved
    if (newStatus === "DELIVERED") {
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        await tx.inventory.updateMany({
          where: { variantId: item.variantId, reserved: { gte: item.quantity } },
          data: {
            reserved: { decrement: item.quantity },
            quantity: { decrement: item.quantity },
          },
        });
      }
    }

    return { success: true };
  });
}