
// app/account/addresses/AddressList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function AddressList({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function deleteAddress(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.add({ title: "Address deleted" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  async function setDefault(id: string) {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.add({ title: "Default address set" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  async function addAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      line1: formData.get("line1"),
      line2: formData.get("line2"),
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
    };
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add address");
      toast.add({ title: "Address added" });
      setShowForm(false);
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Address"}
      </Button>

      {showForm && (
        <form onSubmit={addAddress} className="space-y-4 rounded-lg border border-outline-variant p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="fullName" placeholder="Full Name" required />
            <Input name="phone" placeholder="Phone" required />
            <Input name="line1" placeholder="Address Line 1" required className="sm:col-span-2" />
            <Input name="line2" placeholder="Line 2 (optional)" className="sm:col-span-2" />
            <Input name="city" placeholder="City" required />
            <Input name="state" placeholder="State" />
            <Input name="postalCode" placeholder="Postal Code" required />
            <Input name="country" placeholder="Country" required />
          </div>
          <Button type="submit" disabled={loading}>Save Address</Button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className={`rounded-lg border p-4 ${address.isDefault ? "border-primary bg-primary/5" : "border-outline-variant"}`}>
            {address.isDefault && (
              <span className="mb-2 inline-block rounded bg-primary px-2 py-1 text-xs text-on-primary">Default</span>
            )}
            <p className="font-medium">{address.fullName}</p>
            <p className="text-sm text-on-surface-variant">{address.line1}</p>
            {address.line2 && <p className="text-sm text-on-surface-variant">{address.line2}</p>}
            <p className="text-sm text-on-surface-variant">{address.city}, {address.state} {address.postalCode}</p>
            <p className="text-sm text-on-surface-variant">{address.country}</p>
            <p className="text-sm text-on-surface-variant">{address.phone}</p>
            <div className="mt-3 flex gap-2">
              {!address.isDefault && (
                <Button variant="outline" size="sm" onClick={() => setDefault(address.id)}>Set Default</Button>
              )}
              <Button variant="outline" size="sm" onClick={() => deleteAddress(address.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}