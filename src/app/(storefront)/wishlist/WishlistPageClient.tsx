// app/(storefront)/wishlist/WishlistPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGuestWishlist } from "@/lib/store/wishlist";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart";

type WishlistItem = {
  variantId: string;
  productId: string;
  name: string;
  variantName: string;
  price: number;
  salePrice?: number | null;
  image?: string;
  sku: string;
};

export default function WishlistPageClient({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const guestWishlist = useGuestWishlist();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/account/wishlist")
        .then((res) => res.json())
        .then((data) => {
          // Defensive mapping – handle both flat and nested shapes
          const mapped = data.map((item: any) => {
            const variant = item.variant; // may be undefined
            return {
              variantId: item.variantId || variant?.id,
              productId: item.productId || variant?.productId,
              name: item.name || variant?.product?.name || "Unknown",
              variantName:
                item.variantName ||
                variant?.attributes
                  ?.map((a: any) => a.attributeValue?.value)
                  .join(" / ") ||
                "",
              price: Number(item.price ?? variant?.price ?? 0),
              salePrice:
                (item.salePrice ?? variant?.salePrice)
                  ? Number(item.salePrice ?? variant?.salePrice)
                  : null,
              image: item.image || variant?.product?.media?.[0]?.url || "",
              sku: item.sku || variant?.sku || "",
            };
          });
          setItems(mapped);
        })
        .catch((err) => {
          console.error("Failed to load wishlist:", err);
          toast.add({ title: "Error", description: "Failed to load wishlist" });
        })
        .finally(() => setLoading(false));
    } else {
      // Guest: map local store items to the same WishlistItem shape
      const mapped = guestWishlist.items.map((item) => ({
        variantId: item.variantId,
        productId: item.productId,
        name: item.name,
        variantName: item.variantName,
        price: item.price,
        salePrice: item.salePrice,
        image: item.image,
        sku: item.sku,
      }));
      setItems(mapped);
      setLoading(false);
    }
  }, [isLoggedIn, guestWishlist.items]);

  async function removeItem(variantId: string) {
    if (isLoggedIn) {
      try {
        const res = await fetch("/api/account/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId }),
        });
        if (!res.ok) throw new Error("Failed to remove");
        setItems((prev) => prev.filter((i) => i.variantId !== variantId));
        toast.add({ title: "Removed from wishlist" });
      } catch (error: any) {
        toast.add({ title: "Error", description: error.message });
      }
    } else {
      guestWishlist.removeItem(variantId);
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
      toast.add({ title: "Removed from wishlist" });
    }
  }

  function handleAddToCart(item: WishlistItem) {
    addItem({
      variantId: item.variantId,
      productId: item.productId,
      name: item.name,
      variantName: item.variantName,
      price: item.price,
      salePrice: item.salePrice,
      quantity: 1,
      image: item.image,
      sku: item.sku,
    });
    toast.add({ title: "Added to cart" });
  }

  if (loading) {
    return <p className="text-on-surface-variant">Loading wishlist...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="mx-auto h-12 w-12 text-on-surface-variant" />
        <p className="mt-4 text-on-surface-variant">Your wishlist is empty.</p>
        <Link
          href="/products"
          className="mt-2 inline-block text-primary hover:underline"
        >
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.variantId}
          className="rounded-lg border border-outline-variant overflow-hidden group"
        >
          <div className="relative aspect-[4/5] bg-surface-container">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            )}
            <button
              onClick={() => removeItem(item.variantId)}
              className="absolute top-3 right-3 rounded-full bg-surface/80 p-2 text-on-surface-variant hover:text-error transition"
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-medium text-on-surface truncate">
              {item.name}
            </h3>
            <p className="text-sm text-on-surface-variant">
              {item.variantName}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  ${(item.salePrice ?? item.price).toFixed(2)}
                </span>
                {item.salePrice && (
                  <span className="text-sm text-on-surface-variant line-through">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddToCart(item)}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
