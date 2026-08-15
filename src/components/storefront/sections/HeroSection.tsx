// components/storefront/sections/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  config?: {
    ctaLabel?: string;
    ctaUrl?: string;
    backgroundImage?: string;
    images?: string[]; // ✅ support multiple images
  };
};

export default function HeroSection({
  title,
  subtitle,
  config,
}: HeroSectionProps) {
  const images =
    config?.images && config.images.length > 0
      ? config.images
      : config?.backgroundImage
        ? [config.backgroundImage]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <section className="relative h-[60vh] min-h-[400px] rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
        <div className="text-center text-on-surface-variant">
          <p className="text-lg">Hero section – no images set</p>
        </div>
      </section>
    );
  }

  const ctaLabel = config?.ctaLabel || "Shop Now";
  const ctaUrl = config?.ctaUrl || "/products";

  return (
    <section className="relative h-[60vh] min-h-[400px] rounded-xl overflow-hidden bg-surface-container group">
      {/* Background image carousel */}
      <div className="absolute inset-0">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={title || `Slide ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          <Link
            href={ctaUrl}
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* Carousel controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white hover:bg-white/50 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white hover:bg-white/50 transition"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full ${idx === currentIndex ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
