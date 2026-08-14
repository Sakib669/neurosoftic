// components/shared/CartView.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";

export function CartView() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQuantity, getSubtotal } = useCart();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-on-surface hover:text-primary"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-on-primary">
            {totalItems}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-lg border border-outline-variant bg-surface shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-outline-variant p-4">
            <h3 className="font-semibold">Shopping Cart ({totalItems})</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-on-surface-variant hover:text-error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-on-surface-variant">
                Your cart is empty.
              </p>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-surface-container">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {item.variantName}
                    </p>
                    <p className="text-xs font-semibold">
                      $
                      {((item.salePrice ?? item.price) * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-on-surface-variant hover:text-error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-outline-variant p-4 space-y-3">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block w-full"
              >
                <Button className="w-full">View Cart</Button>
              </Link>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full"
              >
                <Button variant="outline" className="w-full">
                  Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
