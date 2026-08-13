// app/admin/orders/[orderNumber]/ShipmentButton.tsx
"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ShipmentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function createShipment() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shipments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create shipment");
      toast.add({ title: "Shipment created", description: `Tracking: ${data.trackingNumber}` });
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={createShipment} disabled={loading}>
      {loading ? "Creating..." : "Create Shipment (Steadfast)"}
    </Button>
  );
}