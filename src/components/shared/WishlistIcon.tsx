// components/shared/WishlistIcon.tsx
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useGuestWishlist } from "@/lib/store/wishlist";
import { useEffect, useState } from "react";

export function WishlistIcon({ isLoggedIn }: { isLoggedIn: boolean }) {
  const guestItems = useGuestWishlist((state) => state.items);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/account/wishlist")
        .then((res) => res.json())
        .then((data) => setCount(Array.isArray(data) ? data.length : 0))
        .catch(() => setCount(0));
    } else {
      setCount(guestItems.length);
    }
  }, [isLoggedIn, guestItems]);

  return (
    <Link href="/wishlist" className="relative p-2">
      <Heart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-on-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
