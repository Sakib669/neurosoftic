// lib/theme.ts
import { cache } from "react";
import prisma from "./db";

// Default theme values (fallback if DB is empty)
const defaultTheme = {
  primary: "#000666",
  primaryContainer: "#1a237e",
  secondary: "#505f76",
  background: "#fcf9f8",
  surface: "#fcf9f8",
  surfaceContainer: "#f0eded",
  onSurface: "#1c1b1b",
  onPrimary: "#ffffff",
  headingFont: "Outfit",
  bodyFont: "Inter",
  borderRadius: "0.5rem",
};

// Cache the theme for each request (React cache)
export const getTheme = cache(async () => {
  try {
    const configs = await prisma.themeConfig.findMany();
    const theme: Record<string, string> = {};

    // Convert each config to a simple key-value
    for (const config of configs) {
      const value =
        typeof config.value === "string"
          ? config.value
          : JSON.stringify(config.value);
      theme[config.key] = value;
    }

    // Merge with defaults
    return { ...defaultTheme, ...theme };
  } catch (error) {
    console.error("Failed to load theme:", error);
    return defaultTheme;
  }
});

// Convert theme object to CSS custom properties for <html> style
export function themeToStyle(
  theme: Record<string, string>
): React.CSSProperties {
  return {
    "--color-primary": theme.primary,
    "--color-primary-container": theme.primaryContainer,
    "--color-secondary": theme.secondary,
    "--color-background": theme.background,
    "--color-surface": theme.surface,
    "--color-surface-container": theme.surfaceContainer,
    "--color-on-surface": theme.onSurface,
    "--color-on-primary": theme.onPrimary,
    "--font-heading": theme.headingFont,
    "--font-body": theme.bodyFont,
    "--radius": theme.borderRadius,
  } as React.CSSProperties;
}