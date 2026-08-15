// components/admin/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/ImageUpload";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  brands: Brand[];
};

export default function ProductForm({ categories, brands }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");

  // Car-specific state
  const [year, setYear] = useState("2024");
  const [brandId, setBrandId] = useState("");
  const [model, setModel] = useState("");
  const [mileage, setMileage] = useState("");
  const [vin, setVin] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [bodyType, setBodyType] = useState("Sedan");
  const [fuelType, setFuelType] = useState("Gasoline");
  const [transmission, setTransmission] = useState("Automatic");
  const [driveType, setDriveType] = useState("FWD");
  const [color, setColor] = useState("Black");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [categoryId, setCategoryId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Find brand name to construct product name
    const brandName = brands.find((b) => b.id === brandId)?.name || "";
    const name = `${year} ${brandName} ${model}`;
    const slug = `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${vin.slice(-6)}`;

    const payload = {
      name,
      slug,
      description,
      shortDescription: `${year} ${brandName} ${model} - ${mileage} miles`,
      brandId,
      categoryId,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      quantity: Number(quantity),
      sku: vin, // use VIN as SKU
      barcode: undefined,
      status: "ACTIVE",
      mediaUrl: mediaUrl || undefined,
      // Car attributes
      year,
      mileage,
      bodyType,
      fuelType,
      transmission,
      driveType,
      color,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      toast.add({ title: "Car listing created" });
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Year, Brand, Model */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {["2018", "2019", "2020", "2021", "2022", "2023", "2024"].map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            required
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Mileage & VIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mileage</label>
          <Input
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="e.g., 15,000 miles"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">VIN</label>
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="17-character VIN"
            required
          />
        </div>
      </div>

      {/* Price & Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
             max="99999999.99"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Sale Price (optional)
          </label>
          <Input
            type="number"
            step="0.01"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>

      {/* Car details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Body Type</label>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {["Sedan", "SUV", "Coupe", "Hatchback", "Truck"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fuel Type</label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {["Gasoline", "Diesel", "Hybrid", "Electric"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Transmission</label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {["Automatic", "Manual", "CVT"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Drive Type</label>
          <select
            value={driveType}
            onChange={(e) => setDriveType(e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {["FWD", "RWD", "AWD", "4WD"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Color & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            {["Black", "White", "Silver", "Gray", "Blue", "Red"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded border border-outline-variant px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded border border-outline-variant px-3 py-2"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Car Image</label>
        <ImageUpload
          initialUrl={mediaUrl}
          onUpload={(url) => setMediaUrl(url)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Creating..." : "Create Car Listing"}
      </Button>
    </form>
  );
}
