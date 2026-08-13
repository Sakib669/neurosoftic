// lib/providers/courierProvider.ts
export interface CreateShipmentParams {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  recipientZone: string;
  totalAmount: number;
  codAmount: number; // cash on delivery amount (if COD)
  note?: string;
}

export interface ShipmentResult {
  consignmentId: string;
  trackingNumber: string;
  status: string;
}

export interface TrackingInfo {
  status: string;
  updatedAt?: string;
  raw?: any;
}

export abstract class CourierProvider {
  abstract createShipment(params: CreateShipmentParams): Promise<ShipmentResult>;
  abstract getTracking(consignmentId: string): Promise<TrackingInfo>;
  abstract cancelShipment(consignmentId: string): Promise<void>;
}