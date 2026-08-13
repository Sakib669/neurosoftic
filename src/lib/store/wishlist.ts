// lib/store/wishlist.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestWishlistItem = {
  variantId: string;
  productId: string;
  name: string;
  variantName: string;
  price: number;
  salePrice?: number | null;
  image?: string;
  sku: string;
};

type GuestWishlistState = {
  items: GuestWishlistItem[];
  toggleItem: (item: GuestWishlistItem) => void;
  removeItem: (variantId: string) => void;
  hasItem: (variantId: string) => boolean;
};

export const useGuestWishlist = create<GuestWishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.variantId === item.variantId);
          if (exists) {
            return { items: state.items.filter((i) => i.variantId !== item.variantId) };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      hasItem: (variantId) => get().items.some((i) => i.variantId === variantId),
    }),
    { name: "neurosoftic-wishlist" }
  )
);