// lib/providers/steadfast.ts
import { CourierProvider, CreateShipmentParams, TrackingInfo } from "./courierProvider";

export class SteadfastProvider extends CourierProvider {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    super();
    this.apiKey = process.env.STEADFAST_API_KEY || "";
    this.secretKey = process.env.STEADFAST_SECRET_KEY || "";
    this.baseUrl = process.env.STEADFAST_BASE_URL || "https://portal.packzy.com/api/v1";
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "Api-Key": this.apiKey,
      "Secret-Key": this.secretKey,
    };
  }

  async createShipment(params: CreateShipmentParams) {
    const payload = {
      invoice: params.orderNumber,
      recipient_name: params.recipientName,
      recipient_phone: params.recipientPhone,
      recipient_address: params.recipientAddress,
      recipient_city: params.recipientCity,
      recipient_zone: params.recipientZone,
      cod_amount: params.codAmount,
      amount: params.totalAmount,
      note: params.note || "",
    };

    const res = await fetch(`${this.baseUrl}/create_order`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      throw new Error(data.message || "Steadfast shipment creation failed");
    }

    return {
      consignmentId: data.data.consignment_id,
      trackingNumber: data.data.tracking_code,
      status: "pending",
    };
  }

  async getTracking(consignmentId: string): Promise<TrackingInfo> {
    const res = await fetch(`${this.baseUrl}/status_by_cid/${consignmentId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      throw new Error(data.message || "Tracking fetch failed");
    }

    return {
      status: data.data.status,
      updatedAt: data.data.updated_at,
      raw: data.data,
    };
  }

  async cancelShipment(consignmentId: string) {
    const res = await fetch(`${this.baseUrl}/cancel_order`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ consignment_id: consignmentId }),
    });
    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      throw new Error(data.message || "Cancellation failed");
    }
  }
}

export function getCourierProvider(): CourierProvider {
  return new SteadfastProvider();
}