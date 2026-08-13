// app/(storefront)/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.add({ title: "Your cart is empty" });
      return;
    }

    setLoading(true);

    // Build request payload from form and cart items
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2"),
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
      paymentMethod: formData.get("paymentMethod"),
      notes: formData.get("notes"),
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      toast.add({ title: "Order placed successfully!" });
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}`);
    } catch (error: any) {
      toast.add({
        title: "Checkout failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  // ... rest of the component (same UI as before, but with loading state)
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* same UI, but the form onSubmit calls handleSubmit */}
      <form onSubmit={handleSubmit}>
        {/* ... form fields ... */}
      </form>
      {/* order summary ... */}
    </div>
  );
}