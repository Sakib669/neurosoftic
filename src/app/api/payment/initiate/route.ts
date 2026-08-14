// app/api/payment/initiate/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { initiatePayment } from "@/lib/services/paymentService";
import { auth } from "../../../../../auth";

export async function POST(req: NextRequest) {
  try {
    // Check user is logged in
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse order number from request body
    const { orderNumber } = await req.json();
    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
    }

    // Fetch the order and ensure it belongs to the logged-in user
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { customer: true },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Initiate SSLCommerz payment
    const result = await initiatePayment(
      order.orderNumber,
      Number(order.total),
      {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
      }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Payment initiation failed:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 400 });
  }
}