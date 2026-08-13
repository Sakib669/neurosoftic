// app/(storefront)/cart/page.tsx
"use client";

import { useCart } from "@/lib/store/cart";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="text-on-surface-variant">
          Your cart is empty. <Link href="/products" className="text-primary hover:underline">Continue shopping</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4 rounded-lg border border-outline-variant p-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-surface-container">
                  <img src={item.image || "/placeholder.png"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-on-surface">{item.name}</h3>
                  <p className="text-sm text-on-surface-variant">{item.variantName}</p>
                  <p className="text-sm font-semibold">${(item.salePrice ?? item.price).toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-sm text-error hover:underline"
                  >
                    Remove
                  </button>
                  <div className="flex items-center rounded border border-outline-variant">
                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-2 py-1">−</button>
                    <span className="px-3">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-2 py-1">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-outline-variant p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-semibold text-on-surface">${getSubtotal().toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full rounded-lg bg-primary py-2 text-on-primary hover:bg-primary-container">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}