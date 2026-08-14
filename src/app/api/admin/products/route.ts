import { NextRequest, NextResponse } from "next/server";
import { createProductSchema } from "@/lib/validators/product";
import { createProduct } from "@/lib/services/productService";
import { createAuditLog } from "@/lib/services/auditService"; // ✅ added
import { auth } from "../../../../../auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createProductSchema.parse(body);
    const product = await createProduct(parsed);

    // ✅ Audit log
    await createAuditLog(
      session.user.id,
      "CREATE_PRODUCT",
      "Product",
      product.id,
    );

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
