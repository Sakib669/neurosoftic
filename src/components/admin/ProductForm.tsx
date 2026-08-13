// components/admin/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  brands: Brand[];
};

export default function ProductForm({ categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      shortDescription: formData.get("shortDescription"),
      brandId: formData.get("brandId"),
      categoryId: formData.get("categoryId"),
      price: Number(formData.get("price")),
      salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : undefined,
      costPrice: formData.get("costPrice") ? Number(formData.get("costPrice")) : undefined,
      quantity: Number(formData.get("quantity")),
      sku: formData.get("sku"),
      barcode: formData.get("barcode") || undefined,
      status: formData.get("status") || "ACTIVE",
      mediaUrl: formData.get("mediaUrl") || undefined,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      toast.add({ title: "Product created" });
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" required className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input name="slug" required className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <input name="shortDescription" className="w-full rounded border border-outline-variant px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" rows={4} className="w-full rounded border border-outline-variant px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="categoryId" required className="w-full rounded border border-outline-variant px-3 py-2">
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select name="brandId" required className="w-full rounded border border-outline-variant px-3 py-2">
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input name="price" type="number" step="0.01" required className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sale Price</label>
          <input name="salePrice" type="number" step="0.01" className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost Price</label>
          <input name="costPrice" type="number" step="0.01" className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input name="quantity" type="number" required className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input name="sku" required className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Barcode</label>
          <input name="barcode" className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" className="w-full rounded border border-outline-variant px-3 py-2">
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input name="mediaUrl" type="url" className="w-full rounded border border-outline-variant px-3 py-2" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-6 py-2 text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}