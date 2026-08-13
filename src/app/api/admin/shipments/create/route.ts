import { NextRequest, NextResponse } from "next/server";
import { createShipmentForOrder } from "@/lib/services/courierService";
import { auth } from "../../../../../../auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"];
    if (!allowed.includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    const shipment = await createShipmentForOrder(orderId);
    return NextResponse.json(shipment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}