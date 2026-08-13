"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useGuestWishlist } from "@/lib/store/wishlist";
import { useEffect, useState } from "react";

export function WishlistIcon() {
  const guestItems = useGuestWishlist((state) => state.items);
  const [count, setCount] = useState(0);

  // For guest, count from local store; for logged in, we'll later fetch count from API.
  // For now, we'll show guest count only.
  useEffect(() => {
    setCount(guestItems.length);
  }, [guestItems]);

  return (
    <Link href="/wishlist" className="relative">
      <Heart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-on-primary">
          {count}
        </span>
      )}
    </Link>
  );
}