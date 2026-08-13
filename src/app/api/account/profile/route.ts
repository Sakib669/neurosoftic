// app/api/account/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateUserProfile, changePassword } from "@/lib/services/customerService";
import { auth } from "../../../../../auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (body.currentPassword) {
      // Password change flow
      await changePassword(session.user.id, body.currentPassword, body.newPassword);
      return NextResponse.json({ success: true });
    }

    // Profile update
    const { name, phone, email } = body;
    await updateUserProfile(session.user.id, { name, phone, email });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}