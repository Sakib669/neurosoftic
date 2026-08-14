// lib/providers/paymentProvider.ts
export interface PaymentInitiateParams {
  orderNumber: string;   // used as transaction ID
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
}

export interface PaymentInitiateResult {
  gatewayPageUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentVerifyResult {
  success: boolean;
  transactionId?: string;
  amount?: number;
  raw?: any;
}

export abstract class PaymentProvider {
  abstract initiatePayment(params: PaymentInitiateParams): Promise<PaymentInitiateResult>;
  abstract verifyPayment(payload: any): Promise<PaymentVerifyResult>;
}