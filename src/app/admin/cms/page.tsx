// app/admin/cms/page.tsx
import { getHomepageSections } from "@/lib/services/cmsService";
import CMSSectionManager from "./CMSSectionManager";

export default async function AdminCMSPage() {
  const sections = await getHomepageSections();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Homepage Builder</h1>
      <p className="text-sm text-on-surface-variant">
        Manage the sections of your storefront homepage.
      </p>
      <CMSSectionManager initialSections={sections} />
    </div>
  );
}