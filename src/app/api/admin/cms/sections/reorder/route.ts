// app/api/admin/cms/sections/reorder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { reorderHomepageSections } from "@/lib/services/cmsService";
import { auth } from "../../../../../../../auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER"];
    if (!allowed.includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    await reorderHomepageSections(orderedIds);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}