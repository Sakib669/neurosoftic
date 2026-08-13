// components/shared/CartIcon.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart";

export function CartIcon() {
  // Get total quantity from cart store
  const totalItems = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Link href="/cart" className="relative p-2">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-on-primary">
          {totalItems}
        </span>
      )}
    </Link>
  );
}