// components/storefront/sections/ProductCarousel.tsx
import { ProductCard } from "@/components/storefront/ProductCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  media: { url: string; altText?: string | null }[];
  variants: { price: any; salePrice?: any }[];
};

export default function ProductCarousel({ title, products }: { title?: string; products: Product[] }) {
  return (
    <section className="mt-12">
      {title && <h2 className="text-2xl font-bold text-on-surface mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const defaultVariant = product.variants[0];
          const price = defaultVariant ? Number(defaultVariant.price) : 0;
          const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={price}
              salePrice={salePrice}
              imageUrl={product.media[0]?.url || "/placeholder.png"}
              altText={product.media[0]?.altText || product.name}
            />
          );
        })}
      </div>
    </section>
  );
}