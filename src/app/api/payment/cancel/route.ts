// app/api/payment/cancel/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Redirect to cart with a cancelled message
  return NextResponse.redirect(new URL("/cart?payment=cancelled", url.origin));
}