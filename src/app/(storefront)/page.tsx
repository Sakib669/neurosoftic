// app/(storefront)/page.tsx
import { redirect } from "next/navigation";
import {
  getActiveHomepageSections,
  getFeaturedCategories,
  getFeaturedProducts,
} from "@/lib/services/homepageService";
import HeroSection from "@/components/storefront/sections/HeroSection";
import CategoryGrid from "@/components/storefront/sections/CategoryGrid";
import ProductCarousel from "@/components/storefront/sections/ProductCarousel";
import { auth } from "../../../auth";

// Define a type for the section objects we handle
type Section = {
  id: string;
  type: string;
  title: string | null;
  subtitle?: string | null;   // ✅ made optional
  config?: any;
  sortOrder?: number;
};

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "ACCOUNTS",
];

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role as string | undefined;

  if (role && ADMIN_ROLES.includes(role)) {
    redirect("/admin");
  }

  const sections = await getActiveHomepageSections();
  const categories = await getFeaturedCategories();
  const featuredProducts = await getFeaturedProducts();

  const fallbackSections: Section[] =
    sections.length > 0
      ? (sections as Section[])
      : [
          {
            id: "fallback-hero",
            type: "hero",
            title: "Find Your Perfect Car",
            subtitle: "Browse our curated selection of quality pre‑owned vehicles.",
            config: {
              ctaLabel: "Shop Cars",
              ctaUrl: "/products",
              backgroundImage:
                "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1600&auto=format&fit=crop",
            },
          },
          {
            id: "fallback-categories",
            type: "category_grid",
            title: "Shop by Body Type",
            config: {},
          },
          {
            id: "fallback-products",
            type: "product_carousel",
            title: "Featured Cars",
            config: { query: "featured" },
          },
        ];

  const sectionComponents = [];

  for (const section of fallbackSections) {
    const config = section.config || {};
    switch (section.type) {
      case "hero":
        sectionComponents.push(
          <HeroSection
            key={section.id}
            title={section.title || undefined}
            subtitle={section.subtitle || undefined}
            config={config as any}
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
        break;
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:px-8">
      {sectionComponents}
    </div>
  );
}