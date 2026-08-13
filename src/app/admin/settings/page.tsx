// app/admin/settings/page.tsx
import { getThemeConfig } from "@/lib/services/themeService";
import ThemeSettingsForm from "./ThemeSettingsForm";

export default async function AdminSettingsPage() {
  const theme = await getThemeConfig();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Theme &amp; Branding</h1>
      <p className="text-sm text-on-surface-variant">
        Customize the colors, fonts, and border radius of your storefront.
      </p>
      <ThemeSettingsForm initialTheme={theme} />
    </div>
  );
}