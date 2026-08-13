// lib/services/themeService.ts
import prisma from "@/lib/db";

// Default theme keys (match the theme engine)
const defaultKeys = [
  "primary",
  "primaryContainer",
  "secondary",
  "background",
  "surface",
  "surfaceContainer",
  "onSurface",
  "onPrimary",
  "headingFont",
  "bodyFont",
  "borderRadius",
];

// Get current theme config
export async function getThemeConfig() {
  const configs = await prisma.themeConfig.findMany();
  const theme: Record<string, any> = {};

  for (const config of configs) {
    theme[config.key] = config.value;
  }
  return theme;
}

// Update a theme setting
export async function updateThemeConfig(key: string, value: any) {
  return prisma.themeConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

// Reset to defaults
export async function resetThemeConfig() {
  await prisma.themeConfig.deleteMany();
  const defaults = [
    { key: "primary", value: "#000666" },
    { key: "primaryContainer", value: "#1a237e" },
    { key: "secondary", value: "#505f76" },
    { key: "background", value: "#fcf9f8" },
    { key: "surface", value: "#fcf9f8" },
    { key: "surfaceContainer", value: "#f0eded" },
    { key: "onSurface", value: "#1c1b1b" },
    { key: "onPrimary", value: "#ffffff" },
    { key: "headingFont", value: "Outfit" },
    { key: "bodyFont", value: "Inter" },
    { key: "borderRadius", value: "0.5rem" },
  ];

  for (const item of defaults) {
    await prisma.themeConfig.create({
      data: { key: item.key, value: item.value },
    });
  }
  return getThemeConfig();
}