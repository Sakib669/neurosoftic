// app/api/admin/products/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateProduct, updateDefaultVariant } from "@/lib/services/productService";
import { auth } from "../../../../../../auth";

export async function PATCH(
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

    // Validate basic inputs (simplified, no zod here; we assume client sends correct shape)
    await updateProduct(productId, body);
    if (body.price !== undefined || body.quantity !== undefined || body.sku !== undefined) {
      await updateDefaultVariant(productId, {
        price: body.price,
        salePrice: body.salePrice,
        quantity: body.quantity,
        sku: body.sku,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}