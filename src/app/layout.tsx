// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { getTheme, themeToStyle } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Neurosoftic",
  description: "Ecommerce Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const style = themeToStyle(theme);

  return (
    <html
      lang="en"
      style={style}
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning // ✅ suppresses extension-caused mismatches
    >
      <body className="bg-background text-on-surface font-body">
        {children}
      </body>
    </html>
  );
}
