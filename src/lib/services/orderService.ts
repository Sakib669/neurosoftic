// lib/services/orderService.ts
import prisma from "@/lib/db";
import type { CheckoutInput } from "@/lib/validators/order";

// Define a type for the order item data to avoid implicit any
type OrderItemInput = {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  barcode?: string | null;
  price: number;
  quantity: number;
  total: number;
};

export async function createOrder(userId: string, data: CheckoutInput) {
  // 1. Create shipping address
  const address = await prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.addressLine1,
      line2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: false,
    },
  });

  // 2. Fetch variants to build snapshot and compute totals
  const variantIds = data.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: true,
      attributes: { include: { attributeValue: true } },
    },
  });

  if (variants.length !== data.items.length) {
    throw new Error("Some products are no longer available.");
  }

  // Explicitly typed array
  const orderItemsData: OrderItemInput[] = [];
  let subtotal = 0;

  for (const item of data.items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant) throw new Error("Variant not found");

    const price = Number(variant.salePrice ?? variant.price);
    const total = price * item.quantity;
    subtotal += total;

    const variantName = variant.attributes
      .map((a) => a.attributeValue.value)
      .join(" / ");

    orderItemsData.push({
      variantId: variant.id,
      productName: variant.product.name,
      variantName: variantName || "Default",
      sku: variant.sku,
      barcode: variant.barcode,
      price,
      quantity: item.quantity,
      total,
    });
  }

  // 3. Calculate shipping and tax (simplified)
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // 4. Generate order number
  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${new Date().getFullYear()}-${(orderCount + 1)
    .toString()
    .padStart(4, "0")}`;

  // 5. Create order, items, status history, and update inventory atomically
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: data.paymentMethod === "cod" ? "CONFIRMED" : "PENDING_PAYMENT",
        paymentStatus: "UNPAID",
        subtotal,
        discount: 0,
        shipping,
        tax,
        total,
        shippingAddressId: address.id,
        notes: data.notes,
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            fromStatus: "DRAFT",
            toStatus:
              data.paymentMethod === "cod" ? "CONFIRMED" : "PENDING_PAYMENT",
            note: "Order placed",
          },
        },
      },
    });

    // Reserve stock
    for (const item of data.items) {
      await tx.inventory.updateMany({
        where: {
          variantId: item.variantId,
          quantity: { gte: item.quantity },
        },
        data: {
          reserved: { increment: item.quantity },
        },
      });
    }

    return createdOrder;
  });

  return { orderNumber: order.orderNumber, orderId: order.id };
}