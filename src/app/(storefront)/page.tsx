// app/(storefront)/page.tsx
import { getActiveHomepageSections, getFeaturedCategories, getFeaturedProducts } from "@/lib/services/homepageService";
import HeroSection from "@/components/storefront/sections/HeroSection";
import CategoryGrid from "@/components/storefront/sections/CategoryGrid";
import ProductCarousel from "@/components/storefront/sections/ProductCarousel";

export default async function HomePage() {
  const sections = await getActiveHomepageSections();
  const categories = await getFeaturedCategories();
  const featuredProducts = await getFeaturedProducts();

  const sectionComponents = [];

  for (const section of sections) {
    const config = section.config as any;
    switch (section.type) {
      case "hero":
        sectionComponents.push(
          <HeroSection
            key={section.id}
            title={section.title || undefined}
            subtitle={section.subtitle || undefined}
            config={config}
          />
        );
        break;
      case "category_grid":
        sectionComponents.push(
          <CategoryGrid
            key={section.id}
            title={section.title || undefined}
            categories={categories}
          />
        );
        break;
      case "product_carousel":
        sectionComponents.push(
          <ProductCarousel
            key={section.id}
            title={section.title || undefined}
            products={featuredProducts as any}
          />
        );
        break;
      default:
        // fallback: ignore unknown section types or render a placeholder
        break;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      {sectionComponents}
    </div>
  );
}