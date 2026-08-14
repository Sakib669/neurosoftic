// app/api/payment/success/route.ts
import { NextResponse } from "next/server";
import { handlePaymentSuccess } from "@/lib/services/paymentService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const payload = Object.fromEntries(url.searchParams.entries());
    await handlePaymentSuccess(payload);
    return NextResponse.redirect(new URL("/account/orders", url.origin), 303);
  } catch (error: any) {
    console.error("Payment success handling failed:", error);
    return NextResponse.redirect(new URL("/cart?payment=error", new URL(req.url).origin), 303);
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let payload: any;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const text = await req.text();
      payload = Object.fromEntries(new URLSearchParams(text).entries());
    }

    await handlePaymentSuccess(payload);
    return NextResponse.redirect(new URL("/account/orders", url.origin), 303);
  } catch (error: any) {
    console.error("Payment success POST handling failed:", error);
    return NextResponse.redirect(new URL("/cart?payment=error", new URL(req.url).origin), 303);
  }
}