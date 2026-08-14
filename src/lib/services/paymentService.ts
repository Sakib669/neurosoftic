
// lib/services/paymentService.ts
import prisma from "@/lib/db";
import { getPaymentProvider } from "@/lib/providers/sslcommerz";

export async function initiatePayment(
  orderNumber: string,
  total: number,
  customer: { name?: string | null; email?: string | null; phone?: string | null }
) {
  const provider = getPaymentProvider();

  return provider.initiatePayment({
    orderNumber,
    amount: total,
    currency: "BDT",
    customerName: customer.name || "Customer",
    customerEmail: customer.email || "customer@example.com",
    customerPhone: customer.phone || "0000000000",
    successUrl: process.env.SSLCOMMERZ_SUCCESS_URL!,
    failUrl: process.env.SSLCOMMERZ_FAIL_URL!,
    cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL!,
  });
}

export async function handlePaymentSuccess(payload: any) {
  const orderNumber = payload.tran_id;
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) throw new Error("Order not found");

  if (payload.status === "VALID" || payload.status === "VALIDATED") {
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "sslcommerz",
          transactionId: payload.tran_id,
          amount: Number(payload.amount),
          status: "PAID",
          method: payload.card_type || "online",
          metadata: payload,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: "PENDING_PAYMENT",
          toStatus: "CONFIRMED",
          note: "Payment successful",
        },
      }),
    ]);
    return { success: true };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "UNPAID", status: "PAYMENT_FAILED" },
  });
  return { success: false, error: "Payment failed" };
}