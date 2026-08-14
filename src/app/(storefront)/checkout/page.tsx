// app/(storefront)/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { toast } from "@/components/ui/toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.add({ title: "Your cart is empty" });
      return;
    }
    setLoading(true);

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
      paymentMethod,
      notes: formData.get("notes"),
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    try {
      // 1. Create order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      // 2. If online payment, initiate gateway
      if (paymentMethod === "online") {
        const payRes = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNumber: data.orderNumber }),
        });
        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.error || "Payment initiation failed");

        if (payData.gatewayPageUrl) {
          clearCart();
          window.location.href = payData.gatewayPageUrl;
          return;
        } else {
          throw new Error("No gateway URL returned");
        }
      }

      // 3. COD: clear cart and go to confirmation
      clearCart();
      toast.add({ title: "Order placed successfully" });
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}`);
    } catch (error: any) {
      toast.add({ title: "Checkout failed", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-outline-variant p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" required className="w-full rounded border border-outline-variant px-3 py-2" />
              <input name="phone" placeholder="Phone" required className="w-full rounded border border-outline-variant px-3 py-2" />
              <input name="email" type="email" placeholder="Email" required className="w-full rounded border border-outline-variant px-3 py-2 sm:col-span-2" />
              <input name="addressLine1" placeholder="Address Line 1" required className="w-full rounded border border-outline-variant px-3 py-2 sm:col-span-2" />
              <input name="addressLine2" placeholder="Address Line 2 (optional)" className="w-full rounded border border-outline-variant px-3 py-2 sm:col-span-2" />
              <input name="city" placeholder="City" required className="w-full rounded border border-outline-variant px-3 py-2" />
              <input name="state" placeholder="State/Province" className="w-full rounded border border-outline-variant px-3 py-2" />
              <input name="postalCode" placeholder="Postal Code" required className="w-full rounded border border-outline-variant px-3 py-2" />
              <input name="country" placeholder="Country" required className="w-full rounded border border-outline-variant px-3 py-2" />
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment (SSLCommerz)
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-on-primary hover:bg-primary-container disabled:opacity-50"
          >
            {loading ? "Processing..." : paymentMethod === "online" ? "Pay Now" : "Place Order"}
          </button>
        </form>

        <div className="rounded-lg border border-outline-variant p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>${((item.salePrice ?? item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-outline-variant pt-2 flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}