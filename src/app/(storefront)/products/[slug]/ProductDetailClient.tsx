// app/(storefront)/products/[slug]/ProductDetailClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/lib/store/cart";
import { useGuestWishlist } from "@/lib/store/wishlist";
import { toast } from "@/components/ui/toast";
import { Heart } from "lucide-react";

type Media = { url: string; altText: string };
type Variant = {
  id: string;
  sku: string;
  price: number;
  salePrice: number | null;
  attributes: { groupId: string; valueId: string; value: string }[];
  stock: number;
};
type AttributeGroup = {
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
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlistActive, setWishlistActive] = useState(false);
  const { addItem } = useCart();
  const guestWishlist = useGuestWishlist();

  // Initialize selectedAttrs with first value of each group (only once)
  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const group of product.attributeGroups) {
      if (group.values.length > 0) {
        initial[group.name] = group.values[0].id;
      }
    }
    setSelectedAttrs(initial);
  }, [product.attributeGroups]);

  // Determine selected variant based on chosen attributes
  const selectedVariant = useMemo(() => {
    return product.variants.find((v) =>
      v.attributes.every((a) => selectedAttrs[a.groupId] === a.valueId),
    );
  }, [selectedAttrs, product.variants]);

  // Update wishlist active state for guest users when selected variant changes
  useEffect(() => {
    if (!isLoggedIn && selectedVariant) {
      setWishlistActive(guestWishlist.hasItem(selectedVariant.id));
    } else {
      // For logged-in, we won't preselect; user can toggle manually.
      setWishlistActive(false);
    }
  }, [selectedVariant, isLoggedIn, guestWishlist]);

  const currentPrice =
    selectedVariant?.salePrice ?? selectedVariant?.price ?? product.basePrice;
  const currentSalePrice = selectedVariant?.salePrice ?? null;
  const stock = selectedVariant?.stock ?? 0;

  function handleAddToCart() {
    if (!selectedVariant) {
      toast.add({ title: "Please select a variant" });
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      variantName: selectedVariant.attributes.map((a) => a.value).join(" / "),
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      quantity,
      image: product.media[0]?.url,
      sku: selectedVariant.sku,
    });
    toast.add({ title: "Added to cart!" });
  }

  async function toggleWishlist() {
    if (!selectedVariant) return;

    if (!isLoggedIn) {
      // Guest: use local store (toggles)
      guestWishlist.toggleItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        variantName: selectedVariant.attributes.map((a) => a.value).join(" / "),
        price: selectedVariant.price,
        salePrice: selectedVariant.salePrice,
        image: product.media[0]?.url,
        sku: selectedVariant.sku,
      });
      setWishlistActive(guestWishlist.hasItem(selectedVariant.id));
      toast.add({ title: "Wishlist updated" });
      return;
    }

    // Logged-in: use API
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
          <div className="aspect-square overflow-hidden rounded-xl bg-surface-container">
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

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{product.name}</h1>
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

          {/* Attribute selectors */}
          {product.attributeGroups.map((group) => (
            <div key={group.name} className="mt-6">
              <label className="mb-2 block text-sm font-medium text-on-surface">
                {group.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {group.values.map((value) => (
                  <button
                    key={value.id}
                    onClick={() =>
                      setSelectedAttrs((prev) => ({
                        ...prev,
                        [group.name]: value.id,
                      }))
                    }
                    className={`rounded border px-4 py-2 text-sm transition ${
                      selectedAttrs[group.name] === value.id
                        ? "border-primary bg-primary text-on-primary"
                        : "border-outline-variant hover:border-primary"
                    }`}
                  >
                    {value.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity and stock */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded border border-outline-variant">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
                className="px-3 py-2 text-lg"
              >
                +
              </button>
            </div>
            <span className="text-sm text-on-surface-variant">
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || stock === 0}
              className="w-full rounded-lg bg-primary py-3 text-on-primary transition hover:bg-primary-container disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              disabled={!selectedVariant}
              className={`flex items-center justify-center gap-2 rounded-lg border py-3 transition ${
                wishlistActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              } disabled:opacity-50`}
            >
              <Heart
                size={20}
                className={wishlistActive ? "fill-current" : ""}
              />
              {wishlistActive ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
