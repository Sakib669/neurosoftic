// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createProductSchema } from "@/lib/validators/product";
import { createProduct } from "@/lib/services/productService";
import { auth } from "../../../../../auth";

export async function POST(req: NextRequest) {
  try {
    // Check auth and role (must be admin or catalog manager)
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse and validate body
    const body = await req.json();
    const parsed = createProductSchema.parse(body);

    // Call service
    const product = await createProduct(parsed);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Create product failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 400 },
    );
  }
}
