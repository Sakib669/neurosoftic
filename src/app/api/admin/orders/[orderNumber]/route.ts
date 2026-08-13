// app/api/admin/orders/[orderNumber]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateOrderStatus } from "@/lib/services/orderAdminService";
import { auth } from "../../../../../../auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const allowedRoles = [
      "SUPER_ADMIN",
      "ADMIN",
      "ORDER_MANAGER",
      "CUSTOMER_SUPPORT",
    ];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderNumber } = await params;
    const body = await req.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await updateOrderStatus(order.id, status, session.user.id, note);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update order status failed:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
