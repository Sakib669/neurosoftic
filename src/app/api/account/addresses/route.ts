// app/api/account/addresses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addAddress, getUserAddresses } from "@/lib/services/customerService";
import { auth } from "../../../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await getUserAddresses(session.user.id);
  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const address = await addAddress(session.user.id, body);
    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}