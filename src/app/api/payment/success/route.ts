// app/api/payment/success/route.ts
import { NextResponse } from "next/server";
import { handlePaymentSuccess } from "@/lib/services/paymentService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const payload = Object.fromEntries(url.searchParams.entries());

    // Update order payment status
    await handlePaymentSuccess(payload);

    // Redirect to order history page
    return NextResponse.redirect(new URL("/account/orders", url.origin));
  } catch (error: any) {
    console.error("Payment success handling failed:", error);
    return NextResponse.redirect(new URL("/cart?payment=error", new URL(req.url).origin));
  }
}