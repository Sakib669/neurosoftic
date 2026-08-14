// app/api/payment/fail/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Redirect to cart with a failure message
  return NextResponse.redirect(new URL("/cart?payment=failed", url.origin));
}