// components/storefront/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string;
  altText?: string;
  badge?: string;
};

export function ProductCard({
  id,
  slug,
  name,
  price,
  salePrice,
  imageUrl = "/placeholder.png",
  altText = name,
  badge,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-surface-container">
        {badge && (
          <span className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-1 text-xs font-medium text-on-primary">
            {badge}
          </span>
        )}
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-on-surface group-hover:text-primary">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-on-surface">
            ${(salePrice ?? price).toFixed(2)}
          </span>
          {salePrice && (
            <span className="text-sm text-on-surface-variant line-through">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}