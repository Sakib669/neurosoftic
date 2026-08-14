// app/admin/products/[productId]/variants/VariantManager.tsx
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
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(false);

  // Add form state
  const [addForm, setAddForm] = useState({
    sku: "",
    barcode: "",
    price: "",
    salePrice: "",
    costPrice: "",
    quantity: "",
    isDefault: false,
    attributeValueIds: {} as Record<string, string>,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    sku: "",
    price: "",
    salePrice: "",
    costPrice: "",
    quantity: "",
    status: "ACTIVE",
  });

  async function handleAddVariant(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const attributeValueIds = Object.values(addForm.attributeValueIds).filter(
      Boolean,
    ) as string[];

    const payload = {
      sku: addForm.sku,
      barcode: addForm.barcode || undefined,
      price: Number(addForm.price),
      salePrice: addForm.salePrice ? Number(addForm.salePrice) : undefined,
      costPrice: addForm.costPrice ? Number(addForm.costPrice) : undefined,
      quantity: Number(addForm.quantity),
      isDefault: addForm.isDefault,
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
      setOpenAdd(false);
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleEditVariant(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVariant) return;
    setLoading(true);

    const payload = {
      sku: editForm.sku,
      price: Number(editForm.price),
      salePrice: editForm.salePrice ? Number(editForm.salePrice) : undefined,
      costPrice: editForm.costPrice ? Number(editForm.costPrice) : undefined,
      quantity: Number(editForm.quantity),
      status: editForm.status,
    };

    try {
      const res = await fetch(`/api/admin/variants/${editingVariant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setVariants((prev) =>
        prev.map((v) =>
          v.id === editingVariant.id
            ? {
                ...v,
                ...payload,
                price: payload.price,
                salePrice: payload.salePrice,
                costPrice: payload.costPrice,
                status: payload.status,
              }
            : v,
        ),
      );
      toast.add({ title: "Variant updated" });
      setOpenEdit(false);
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
      const res = await fetch(`/api/admin/variants/${variantId}`, {
        method: "DELETE",
      });
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
      <Button onClick={() => setOpenAdd(true)}>Add Variant</Button>

      {/* Add Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Variant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVariant} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="SKU"
                value={addForm.sku}
                onChange={(e) =>
                  setAddForm({ ...addForm, sku: e.target.value })
                }
                required
              />
              <Input
                placeholder="Barcode (optional)"
                value={addForm.barcode}
                onChange={(e) =>
                  setAddForm({ ...addForm, barcode: e.target.value })
                }
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={addForm.price}
                onChange={(e) =>
                  setAddForm({ ...addForm, price: e.target.value })
                }
                required
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Sale Price"
                value={addForm.salePrice}
                onChange={(e) =>
                  setAddForm({ ...addForm, salePrice: e.target.value })
                }
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Cost Price"
                value={addForm.costPrice}
                onChange={(e) =>
                  setAddForm({ ...addForm, costPrice: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={addForm.quantity}
                onChange={(e) =>
                  setAddForm({ ...addForm, quantity: e.target.value })
                }
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
                      value={addForm.attributeValueIds[group.id] || ""}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          attributeValueIds: {
                            ...addForm.attributeValueIds,
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
                checked={addForm.isDefault}
                onChange={(e) =>
                  setAddForm({ ...addForm, isDefault: e.target.checked })
                }
              />
              <span className="text-sm">Set as default variant</span>
            </label>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Variant"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
          </DialogHeader>
          {editingVariant && (
            <form onSubmit={handleEditVariant} className="space-y-4 py-4">
              <Input
                placeholder="SKU"
                value={editForm.sku}
                onChange={(e) =>
                  setEditForm({ ...editForm, sku: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Sale Price"
                  value={editForm.salePrice}
                  onChange={(e) =>
                    setEditForm({ ...editForm, salePrice: e.target.value })
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cost Price"
                  value={editForm.costPrice}
                  onChange={(e) =>
                    setEditForm({ ...editForm, costPrice: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="w-full rounded border border-outline-variant px-3 py-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Update Variant"}
              </Button>
            </form>
          )}
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
              <th className="px-4 py-3 text-sm font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-3">{variant.sku}</td>
                <td className="px-4 py-3 text-sm">
                  {variant.attributes
                    .map((a) => a.attributeValue.value)
                    .join(" / ") || "—"}
                </td>
                <td className="px-4 py-3">
                  ${(variant.salePrice ?? variant.price).toString()}
                </td>
                <td className="px-4 py-3">
                  {variant.inventories?.[0]?.quantity ?? 0}
                </td>
                <td className="px-4 py-3">{variant.isDefault ? "✓" : ""}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingVariant(variant);
                      setEditForm({
                        sku: variant.sku,
                        price: String(variant.price),
                        salePrice: variant.salePrice
                          ? String(variant.salePrice)
                          : "",
                        costPrice: variant.costPrice
                          ? String(variant.costPrice)
                          : "",
                        quantity: String(
                          variant.inventories?.[0]?.quantity ?? 0,
                        ),
                        status: variant.status,
                      });
                      setOpenEdit(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id)}
                  >
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
