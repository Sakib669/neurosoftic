// app/admin/settings/ThemeSettingsForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Theme = Record<string, any>;

export default function ThemeSettingsForm({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateThemeKey(key: string, value: any) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setTheme(data);
      toast.add({ title: "Theme updated" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function resetTheme() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setTheme(data);
      toast.add({ title: "Theme reset to defaults" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  // Color fields
  const colorFields = [
    { key: "primary", label: "Primary Color" },
    { key: "primaryContainer", label: "Primary Container" },
    { key: "secondary", label: "Secondary Color" },
    { key: "background", label: "Background" },
    { key: "surface", label: "Surface" },
    { key: "surfaceContainer", label: "Surface Container" },
    { key: "onSurface", label: "Text On Surface" },
    { key: "onPrimary", label: "Text On Primary" },
  ];

  return (
    <div className="space-y-8">
      {/* Colors */}
      <div className="rounded-lg border border-outline-variant bg-surface p-6">
        <h2 className="font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {colorFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme[field.key] || "#000000"}
                  onChange={(e) => setTheme((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="h-8 w-8 rounded border border-outline-variant cursor-pointer"
                />
                <Input
                  value={theme[field.key] || ""}
                  onChange={(e) => setTheme((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  onBlur={() => updateThemeKey(field.key, theme[field.key])}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="rounded-lg border border-outline-variant bg-surface p-6">
        <h2 className="font-semibold mb-4">Typography</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heading Font</label>
            <select
              value={theme.headingFont || "Outfit"}
              onChange={(e) => updateThemeKey("headingFont", e.target.value)}
              className="w-full rounded border border-outline-variant px-3 py-2"
            >
              <option value="Outfit">Outfit</option>
              <option value="Inter">Inter</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body Font</label>
            <select
              value={theme.bodyFont || "Inter"}
              onChange={(e) => updateThemeKey("bodyFont", e.target.value)}
              className="w-full rounded border border-outline-variant px-3 py-2"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div className="rounded-lg border border-outline-variant bg-surface p-6">
        <h2 className="font-semibold mb-4">Border Radius</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            Button Radius: {theme.borderRadius || "0.5rem"}
          </label>
          <select
            value={theme.borderRadius || "0.5rem"}
            onChange={(e) => updateThemeKey("borderRadius", e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            <option value="0rem">Sharp (0px)</option>
            <option value="0.25rem">Small (4px)</option>
            <option value="0.5rem">Medium (8px)</option>
            <option value="1rem">Large (16px)</option>
            <option value="9999px">Pill</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetTheme} disabled={loading}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}