// app/(storefront)/layout.tsx
import { Header } from "@/components/shared/Header";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <footer className="border-t py-6 text-center text-sm text-on-surface/60">
        © 2024 Neurosoftic. All rights reserved.
      </footer>
    </div>
  );
}
