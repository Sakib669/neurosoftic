// app/api/account/addresses/[addressId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateAddress, deleteAddress } from "@/lib/services/customerService";
import { auth } from "../../../../../../auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addressId } = await params;
    const body = await req.json();
    const updated = await updateAddress(addressId, session.user.id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addressId } = await params;
    await deleteAddress(addressId, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}