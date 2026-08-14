import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, updateUserRole } from "@/lib/services/adminService";
import { createAuditLog } from "@/lib/services/auditService";  // ✅ added
import { auth } from "../../../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId, role } = await req.json();
    if (!userId || !role) return NextResponse.json({ error: "userId and role required" }, { status: 400 });

    await updateUserRole(userId, role);

    // ✅ Audit log
    await createAuditLog(session.user.id, "UPDATE_USER_ROLE", "User", userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}