import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  updateDefaultVariant,
} from "@/lib/services/productService";
import { createAuditLog } from "@/lib/services/auditService"; // ✅ added
import { auth } from "../../../../../../auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"];
    if (!allowed.includes(session.user.role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { productId } = await params;
    const body = await req.json();

    await updateProduct(productId, body);
    if (
      body.price !== undefined ||
      body.quantity !== undefined ||
      body.sku !== undefined
    ) {
      await updateDefaultVariant(productId, {
        price: body.price,
        salePrice: body.salePrice,
        quantity: body.quantity,
        sku: body.sku,
      });
    }

    // ✅ Audit log
    await createAuditLog(
      session.user.id,
      "UPDATE_PRODUCT",
      "Product",
      productId,
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
