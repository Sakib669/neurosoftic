import { NextRequest, NextResponse } from "next/server";
import { adjustInventory } from "@/lib/services/inventoryService";
import { createAuditLog } from "@/lib/services/auditService"; // ✅ added
import { auth } from "../../../../../../../auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ inventoryId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"];
    if (!allowedRoles.includes(session.user.role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { inventoryId } = await params;
    const body = await req.json();
    const { quantityChange, reason } = body;
    if (typeof quantityChange !== "number")
      return NextResponse.json(
        { error: "Invalid quantityChange" },
        { status: 400 },
      );

    const result = await adjustInventory(
      inventoryId,
      quantityChange,
      reason || "Manual adjustment",
      session.user.id,
    );

    // ✅ Audit log
    await createAuditLog(
      session.user.id,
      "ADJUST_INVENTORY",
      "Inventory",
      inventoryId,
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
