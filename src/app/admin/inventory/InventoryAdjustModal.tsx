// app/admin/inventory/InventoryAdjustModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InventoryAdjustModal({
  inventoryId,
  currentQuantity,
}: {
  inventoryId: string;
  currentQuantity: number;
}) {
  const [open, setOpen] = useState(false);
  const [quantityChange, setQuantityChange] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdjust() {
    if (quantityChange === 0) {
      toast.add({ title: "Enter a non-zero quantity change" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/${inventoryId}/adjust`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantityChange, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Adjustment failed");

      toast.add({ title: "Inventory adjusted" });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Use DialogTrigger without asChild, style it like a button */}
      <DialogTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
        Adjust
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock (Current: {currentQuantity})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity Change (+/-)</label>
            <Input
              type="number"
              value={quantityChange}
              onChange={(e) => setQuantityChange(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., damaged, restock, correction"
            />
          </div>
          <Button onClick={handleAdjust} disabled={loading} className="w-full">
            {loading ? "Adjusting..." : "Apply Adjustment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}