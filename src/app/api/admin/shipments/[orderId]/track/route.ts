import { NextRequest, NextResponse } from "next/server";
import { getCourierProvider } from "@/lib/providers/steadfast";
import { getShipmentByOrder, updateShipmentStatus } from "@/lib/services/courierService";
import { auth } from "../../../../../../../auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await params;
    const shipment = await getShipmentByOrder(orderId);
    if (!shipment?.consignmentId) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });

    const courier = getCourierProvider();
    const tracking = await courier.getTracking(shipment.consignmentId);
    await updateShipmentStatus(orderId, tracking.status);

    return NextResponse.json(tracking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}