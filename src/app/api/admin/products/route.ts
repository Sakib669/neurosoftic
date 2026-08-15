// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createProductSchema } from "@/lib/validators/product";
import { createProduct } from "@/lib/services/productService";
import { createAuditLog } from "@/lib/services/auditService";
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
    console.log("Received body:", body);  // ✅ debug log

    const parsed = createProductSchema.parse(body);
    const product = await createProduct(parsed);

    await createAuditLog(session.user.id, "CREATE_PRODUCT", "Product", product.id);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);  // ✅ debug log
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 400 });
  }
}