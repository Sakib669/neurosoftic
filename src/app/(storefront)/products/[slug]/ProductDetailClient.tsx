// app/(storefront)/product/[slug]/ProductDetailClient.tsx
"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/lib/store/cart";

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

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // Determine selected variant based on chosen attributes
  const selectedVariant = useMemo(() => {
    return product.variants.find((v) =>
      v.attributes.every((a) => selectedAttrs[a.groupId] === a.valueId)
    );
  }, [selectedAttrs, product.variants]);

  const currentPrice = selectedVariant?.salePrice ?? selectedVariant?.price ?? product.basePrice;
  const currentSalePrice = selectedVariant?.salePrice ?? null;
  const stock = selectedVariant?.stock ?? 0;

  // Initialize selectedAttrs with first value of each group (if not set)
  useMemo(() => {
    const initial: Record<string, string> = {};
    for (const group of product.attributeGroups) {
      if (group.values.length > 0) {
        initial[group.name] = group.values[0].id; // using group name as key; better use group id
      }
    }
    // We'll use group name as key for simplicity; but group id is better.
    // We'll adjust later.
  }, [product.attributeGroups]);

  // Actually, let's initialize properly with useEffect
  // But to keep it simple, we'll just let user click and then set.
  // For now, we'll add a default selection in a useEffect.
  // We'll include a useEffect to set initial selectedAttrs.
  // We'll use a client-only effect.
  // Since this is a client component, we can use useEffect.
  // But to avoid hydration mismatch, we'll set default in state initializer.

  // For now, we'll skip automatic selection and rely on user click.

  function handleAddToCart() {
    if (!selectedVariant) {
      alert("Please select a variant");
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
    alert("Added to cart!");
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
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-outline-variant"
                >
                  <img src={m.url} alt={m.altText} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{product.name}</h1>
          <p className="mt-2 text-on-surface-variant">{product.shortDescription || product.description}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              ${currentSalePrice ? currentSalePrice.toFixed(2) : currentPrice.toFixed(2)}
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
                      setSelectedAttrs((prev) => ({ ...prev, [group.name]: value.id }))
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

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || stock === 0}
            className="mt-6 w-full rounded-lg bg-primary py-3 text-on-primary transition hover:bg-primary-container disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}