// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validators/order";
import { createOrder } from "@/lib/services/orderService";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await req.json();
    const parsed = checkoutSchema.parse(body);

    // 3. Call service to create order
    const result = await createOrder(session.user.id, parsed);

    // 4. Return success response
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 400 }
    );
  }
}