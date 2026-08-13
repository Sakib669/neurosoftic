// app/admin/cms/CMSSectionManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Section = {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  sortOrder: number;
  active: boolean;
};

export default function CMSSectionManager({
  initialSections,
}: {
  initialSections: Section[];
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/admin/cms/sections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active } : s))
      );
      toast.add({ title: "Section updated" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section?")) return;
    try {
      const res = await fetch(`/api/admin/cms/sections/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast.add({ title: "Section deleted" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  async function moveSection(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setSections(newSections);

    try {
      const orderedIds = newSections.map((s) => s.id);
      const res = await fetch("/api/admin/cms/sections/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast.add({ title: "Order updated" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  async function addSection(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;

    try {
      const res = await fetch("/api/admin/cms/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          subtitle: "",
          config: {},
          sortOrder: sections.length + 1,
          active: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const newSection = await res.json();
      setSections((prev) => [...prev, newSection]);
      toast.add({ title: "Section added" });
      form.reset();
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  return (
    <div className="space-y-4">
      {/* Add section form */}
      <form onSubmit={addSection} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">New Section Type</label>
          <select name="type" className="w-full rounded border border-outline-variant px-3 py-2">
            <option value="hero">Hero Slider</option>
            <option value="category_grid">Category Grid</option>
            <option value="product_carousel">Product Carousel</option>
            <option value="promo_banner">Promo Banner</option>
            <option value="testimonials">Testimonials</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input name="title" placeholder="Section title" />
        </div>
        <Button type="submit">Add</Button>
      </form>

      {/* Section list */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              section.active ? "border-outline-variant bg-surface" : "border-outline-variant bg-surface-container-low opacity-70"
            }`}
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveSection(index, "up")}
                disabled={index === 0}
                className="text-xs text-on-surface-variant hover:text-primary disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveSection(index, "down")}
                disabled={index === sections.length - 1}
                className="text-xs text-on-surface-variant hover:text-primary disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            <div className="flex-1">
              <p className="font-medium">{section.title || section.type}</p>
              <p className="text-sm text-on-surface-variant">
                Type: {section.type} | Order: {section.sortOrder}
              </p>
            </div>
            <Switch
              checked={section.active}
              onCheckedChange={(checked) => toggleActive(section.id, checked)}
            />
            <Button variant="outline" size="sm" onClick={() => deleteSection(section.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}