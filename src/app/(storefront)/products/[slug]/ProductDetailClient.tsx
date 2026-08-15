// app/(storefront)/products/[slug]/ProductDetailClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/lib/store/cart";
import { useGuestWishlist } from "@/lib/store/wishlist";
import { toast } from "@/components/ui/toast";
import { Heart, Phone, Car } from "lucide-react";

type Media = { url: string; altText: string };
type Variant = {
  id: string;
  sku: string;
  price: number;
  salePrice: number | null;
  attributes: {
    groupId: string;
    valueId: string;
    value: string;
    groupName: string;
  }[];
  stock: number;
};
type AttributeGroup = {
  id: string;
  name: string;
  values: { id: string; value: string }[];
};

type ProductDetailClientProps = {
  isLoggedIn: boolean;
  product: {
    id: string;
    name: string;
    description: string | null;
    shortDescription: string | null;
    brandName: string;
    categoryName: string;
    media: Media[];
    basePrice: number;
    salePrice: number | null;
    variants: Variant[];
    attributeGroups: AttributeGroup[];
  };
};

export default function ProductDetailClient({
  isLoggedIn,
  product,
}: ProductDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [wishlistActive, setWishlistActive] = useState(false);
  const { addItem } = useCart();
  const guestWishlist = useGuestWishlist();

  // Since cars usually have one variant, auto-select it
  useEffect(() => {
    if (product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    return product.variants.find((v) => v.id === selectedVariantId) || null;
  }, [selectedVariantId, product.variants]);

  // Wishlist active state for guest
  useEffect(() => {
    if (!isLoggedIn && selectedVariant) {
      setWishlistActive(guestWishlist.hasItem(selectedVariant.id));
    } else {
      setWishlistActive(false);
    }
  }, [selectedVariant, isLoggedIn, guestWishlist]);

  const currentPrice =
    selectedVariant?.salePrice ?? selectedVariant?.price ?? product.basePrice;
  const currentSalePrice = selectedVariant?.salePrice ?? null;
  const stock = selectedVariant?.stock ?? 0;
  const isAvailable = stock > 0;

  function handleBuyNow() {
    if (!selectedVariant) {
      toast.add({ title: "Car not available" });
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      variantName: `${product.brandName} ${product.categoryName}`, // generic variant name
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      quantity: 1,
      image: product.media[0]?.url,
      sku: selectedVariant.sku,
    });
    toast.add({ title: "Car added to inquiry cart!" });
  }

  async function toggleWishlist() {
    if (!selectedVariant) return;

    if (!isLoggedIn) {
      guestWishlist.toggleItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        variantName: `${product.brandName} ${product.categoryName}`,
        price: selectedVariant.price,
        salePrice: selectedVariant.salePrice,
        image: product.media[0]?.url,
        sku: selectedVariant.sku,
      });
      setWishlistActive(guestWishlist.hasItem(selectedVariant.id));
      toast.add({ title: "Wishlist updated" });
      return;
    }

    try {
      const method = wishlistActive ? "DELETE" : "POST";
      const res = await fetch("/api/account/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selectedVariant.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setWishlistActive(!wishlistActive);
      toast.add({
        title: wishlistActive ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-xl bg-surface-container">
            <img
              src={product.media[0]?.url || "/placeholder.png"}
              alt={product.media[0]?.altText || product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.media.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.media.map((m, idx) => (
                <button
                  key={idx}
                  className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant"
                >
                  <img
                    src={m.url}
                    alt={m.altText}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Car Info */}
        <div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Car className="h-4 w-4" />
            {product.categoryName} · {product.brandName}
          </div>
          <h1 className="text-3xl font-bold text-on-surface mt-1">
            {product.name}
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {product.shortDescription || product.description}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              $
              {currentSalePrice
                ? currentSalePrice.toFixed(2)
                : currentPrice.toFixed(2)}
            </span>
            {currentSalePrice && (
              <span className="text-lg text-on-surface-variant line-through">
                ${selectedVariant?.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* VIN */}
          <div className="mt-4 rounded-lg border border-outline-variant bg-surface p-4">
            <p className="text-sm text-on-surface-variant">VIN</p>
            <p className="font-mono text-sm text-on-surface">
              {selectedVariant?.sku || "—"}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="mt-6 rounded-lg border border-outline-variant bg-surface">
            <h3 className="border-b border-outline-variant px-4 py-2 font-semibold">
              Specifications
            </h3>
            <div className="divide-y divide-outline-variant">
              {selectedVariant?.attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-4 py-2 text-sm"
                >
                  <span className="text-on-surface-variant">
                    {attr.groupName}
                  </span>
                  <span className="font-medium text-on-surface">
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-sm text-on-surface-variant">
              {isAvailable ? "Available" : "Sold"}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className="w-full rounded-lg bg-primary py-3 text-on-primary transition hover:bg-primary-container disabled:opacity-50"
            >
              Buy Now
            </button>
            <button
              onClick={toggleWishlist}
              className={`flex items-center justify-center gap-2 rounded-lg border py-3 transition ${
                wishlistActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              <Heart
                size={20}
                className={wishlistActive ? "fill-current" : ""}
              />
              {wishlistActive ? "In Wishlist" : "Save to Wishlist"}
            </button>
            <button
              onClick={() =>
                toast.add({
                  title: "Contact Seller",
                  description: "Please call +1234567890",
                })
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant py-3 text-on-surface-variant hover:border-primary hover:text-primary"
            >
              <Phone size={20} />
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
