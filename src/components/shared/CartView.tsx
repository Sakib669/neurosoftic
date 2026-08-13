// components/shared/CartIcon.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart";

export function CartIcon() {
  const totalItems = useCart((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-on-primary">
          {totalItems}
        </span>
      )}
    </Link>
  );
}