// lib/providers/sslcommerz.ts
import {
  PaymentProvider,
  PaymentInitiateParams,
  PaymentVerifyResult,
} from "./paymentProvider";

export class SSLCommerzProvider extends PaymentProvider {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly baseUrl: string;

  constructor() {
    super();
    this.storeId = process.env.SSLCOMMERZ_STORE_ID!;
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD!;
    this.baseUrl =
      process.env.SSLCOMMERZ_SANDBOX === "true"
        ? "https://sandbox.sslcommerz.com"
        : "https://securepay.sslcommerz.com";
  }

  async initiatePayment(params: PaymentInitiateParams) {
    // Build payload as a plain object, then convert all values to strings when sending.
    const payload = {
      store_id: this.storeId,
      store_passwd: this.storePassword,
      total_amount: params.amount.toString(), // ✅ convert to string
      currency: params.currency,
      tran_id: params.orderNumber,
      success_url: params.successUrl,
      fail_url: params.failUrl,
      cancel_url: params.cancelUrl,
      cus_name: params.customerName,
      cus_email: params.customerEmail,
      cus_phone: params.customerPhone,
    };

    const res = await fetch(`${this.baseUrl}/gwprocess/v4/api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });

    const data = await res.json();

    if (data.status === "SUCCESS") {
      return {
        gatewayPageUrl: data.GatewayPageURL,
        transactionId: data.sessionkey,
      };
    }

    throw new Error(data.failedreason || "SSLCommerz initiation failed");
  }

  async verifyPayment(payload: any): Promise<PaymentVerifyResult> {
    return {
      success: payload.status === "VALID" || payload.status === "VALIDATED",
      transactionId: payload.tran_id,
      amount: payload.amount ? Number(payload.amount) : undefined,
      raw: payload,
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new SSLCommerzProvider();
}
