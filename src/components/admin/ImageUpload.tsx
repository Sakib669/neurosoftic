// components/admin/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

type ImageUploadProps = {
  initialUrl?: string;
  onUpload: (url: string) => void;
};

export default function ImageUpload({ initialUrl = "", onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Replace local preview with remote URL
      setPreview(data.url);
      onUpload(data.url);
      toast.add({ title: "Image uploaded" });
    } catch (error: any) {
      toast.add({ title: "Upload failed", description: error.message });
      setPreview(initialUrl); // revert
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative h-32 w-32 rounded-lg border border-outline-variant overflow-hidden bg-surface-container">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreview("");
                onUpload("");
              }}
              className="absolute top-1 right-1 p-1 rounded-full bg-surface/80 text-on-surface hover:text-error"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-on-surface-variant">
            <Upload className="h-6 w-6" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : preview ? "Change Image" : "Upload Image"}
      </Button>
    </div>
  );
}