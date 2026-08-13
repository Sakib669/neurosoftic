// app/admin/products/[productId]/edit/EditProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/ImageUpload";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

type EditProductFormProps = {
  productId: string;
  initialData: {
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    brandId: string;
    categoryId: string;
    price: number;
    salePrice?: number;
    quantity: number;
    sku: string;
    status: string;
    mediaUrl: string;
  };
  categories: Category[];
  brands: Brand[];
};

export default function EditProductForm({
  productId,
  initialData,
  categories,
  brands,
}: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      shortDescription: formData.shortDescription,
      brandId: formData.brandId,
      categoryId: formData.categoryId,
      price: formData.price,
      salePrice: formData.salePrice,
      quantity: formData.quantity,
      sku: formData.sku,
      status: formData.status,
      mediaUrl: formData.mediaUrl,
    };

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.add({ title: "Product updated" });
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
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Short Description
        </label>
        <Input
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded border border-outline-variant px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sale Price</label>
          <Input
            name="salePrice"
            type="number"
            step="0.01"
            value={formData.salePrice || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <Input name="sku" value={formData.sku} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Image upload field replaces plain Image URL */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <ImageUpload
          initialUrl={formData.mediaUrl || ""}
          onUpload={(url) => setFormData({ ...formData, mediaUrl: url })}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Product"}
      </Button>
    </form>
  );
}
