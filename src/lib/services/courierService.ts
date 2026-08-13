// lib/services/courierService.ts
import prisma from "@/lib/db";
import { getCourierProvider } from "@/lib/providers/steadfast";

export async function createShipmentForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      shippingAddress: true,
      customer: true,
      items: true,
    },
  });
  if (!order) throw new Error("Order not found");

  // Find or create courier provider entry
  let provider = await prisma.courierProvider.findFirst({
    where: { code: "steadfast" },
  });
  if (!provider) {
    provider = await prisma.courierProvider.create({
      data: { name: "Steadfast", code: "steadfast", active: true },
    });
  }

  const courier = getCourierProvider();
  const result = await courier.createShipment({
    orderNumber: order.orderNumber,
    recipientName: order.shippingAddress.fullName,
    recipientPhone: order.shippingAddress.phone,
    recipientAddress: `${order.shippingAddress.line1} ${order.shippingAddress.line2 || ""}`,
    recipientCity: order.shippingAddress.city,
    recipientZone: order.shippingAddress.state || order.shippingAddress.city,
    totalAmount: Number(order.total),
    codAmount: order.paymentStatus === "UNPAID" ? Number(order.total) : 0,
    note: "Shipment created",
  });

  // Create or update shipment record
  const shipment = await prisma.shipment.upsert({
    where: { orderId },
    update: {
      courierProviderId: provider.id,
      consignmentId: result.consignmentId,
      trackingNumber: result.trackingNumber,
      status: result.status,
    },
    create: {
      orderId,
      courierProviderId: provider.id,
      consignmentId: result.consignmentId,
      trackingNumber: result.trackingNumber,
      status: result.status,
    },
  });

  // Update order status if not already shipped
  if (!["SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status)) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "READY_FOR_PICKUP" },
    });
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        fromStatus: order.status,
        toStatus: "READY_FOR_PICKUP",
        note: "Shipment created with Steadfast",
      },
    });
  }

  return shipment;
}

export async function getShipmentByOrder(orderId: string) {
  return prisma.shipment.findUnique({
    where: { orderId },
    include: { courierProvider: true },
  });
}

export async function updateShipmentStatus(orderId: string, status: string) {
  const shipment = await prisma.shipment.findUnique({ where: { orderId } });
  if (!shipment) throw new Error("Shipment not found");

  return prisma.shipment.update({
    where: { orderId },
    data: { status },
  });
}