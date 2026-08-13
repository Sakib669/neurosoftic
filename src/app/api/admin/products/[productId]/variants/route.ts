import { NextRequest, NextResponse } from "next/server";
import { getProductVariants, createVariant } from "@/lib/services/variantService";
import { auth } from "../../../../../../../auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productId } = await params;
  const variants = await getProductVariants(productId);
  return NextResponse.json(variants);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"];
    if (!allowed.includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { productId } = await params;
    const body = await req.json();
    const variant = await createVariant(productId, body);
    return NextResponse.json(variant, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}