// components/storefront/sections/HeroSection.tsx
import Link from "next/link";

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  config?: {
    ctaLabel?: string;
    ctaUrl?: string;
    backgroundImage?: string;
  };
};

export default function HeroSection({ title, subtitle, config }: HeroSectionProps) {
  const ctaLabel = config?.ctaLabel || "Shop Now";
  const ctaUrl = config?.ctaUrl || "/products";
  const bgImage = config?.backgroundImage;

  return (
    <section className="relative h-[60vh] min-h-100 rounded-xl overflow-hidden bg-surface-container">
      {bgImage ? (
        <img src={bgImage} alt={title || "Hero"} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-primary/40" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-on-primary p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">{subtitle}</p>}
          <Link
            href={ctaUrl}
            className="inline-block bg-on-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-surface-container transition"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}