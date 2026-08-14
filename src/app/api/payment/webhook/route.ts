// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import { handlePaymentSuccess } from "@/lib/services/paymentService";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verify payment via SSLCommerz (simplified)
    // In production, you should verify the signature sent by SSLCommerz.
    // For now, we trust the payload and handle accordingly.
    await handlePaymentSuccess(payload);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}