"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Variant = {
  id: string;
  sku: string;
  barcode?: string | null;
  price: any;
  salePrice?: any;
  costPrice?: any;
  isDefault: boolean;
  status: string;
  attributes: {
    attributeValue: {
      id: string;
      value: string;
      group: { id: string; name: string };
    };
  }[];
  inventories: { quantity: number }[];
};

type AttributeGroup = {
  id: string;
  name: string;
  values: { id: string; value: string }[];
};

export default function VariantManager({
  productId,
  initialVariants,
  attributeGroups,
}: {
  productId: string;
  initialVariants: Variant[];
  attributeGroups: AttributeGroup[];
}) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    barcode: "",
    price: "",
    salePrice: "",
    costPrice: "",
    quantity: "",
    isDefault: false,
    attributeValueIds: {} as Record<string, string>, // groupId -> valueId
  });

  async function handleAddVariant(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const attributeValueIds = Object.values(formData.attributeValueIds).filter(Boolean) as string[];

    const payload = {
      sku: formData.sku,
      barcode: formData.barcode || undefined,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
      quantity: Number(formData.quantity),
      isDefault: formData.isDefault,
      attributeValueIds,
    };

    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create variant");

      setVariants((prev) => [...prev, data]);
      toast.add({ title: "Variant created" });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVariant(variantId: string) {
    if (!confirm("Delete this variant?")) return;
    try {
      const res = await fetch(`/api/admin/variants/${variantId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      toast.add({ title: "Variant deleted" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setOpen(true)}>Add Variant</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Variant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVariant} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
              <Input
                placeholder="Barcode (optional)"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Sale Price"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Cost Price"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            {/* Attribute selection */}
            {attributeGroups.length > 0 && (
              <div className="space-y-3">
                <p className="font-medium">Attributes</p>
                {attributeGroups.map((group) => (
                  <div key={group.id} className="flex items-center gap-2">
                    <label className="w-32 text-sm">{group.name}</label>
                    <select
                      className="flex-1 rounded border border-outline-variant px-3 py-2"
                      value={formData.attributeValueIds[group.id] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attributeValueIds: {
                            ...formData.attributeValueIds,
                            [group.id]: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Select {group.name}</option>
                      {group.values.map((value) => (
                        <option key={value.id} value={value.id}>
                          {value.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <span className="text-sm">Set as default variant</span>
            </label>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Variant"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Variant list */}
      <div className="rounded-lg border border-outline-variant overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 text-sm font-medium">SKU</th>
              <th className="px-4 py-3 text-sm font-medium">Attributes</th>
              <th className="px-4 py-3 text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-sm font-medium">Qty</th>
              <th className="px-4 py-3 text-sm font-medium">Default</th>
              <th className="px-4 py-3 text-sm font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-3">{variant.sku}</td>
                <td className="px-4 py-3 text-sm">
                  {variant.attributes.map((a) => a.attributeValue.value).join(" / ") || "—"}
                </td>
                <td className="px-4 py-3">
                  ${(variant.salePrice ?? variant.price).toString()}
                </td>
                <td className="px-4 py-3">{variant.inventories?.[0]?.quantity ?? 0}</td>
                <td className="px-4 py-3">{variant.isDefault ? "✓" : ""}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" onClick={() => handleDeleteVariant(variant.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}