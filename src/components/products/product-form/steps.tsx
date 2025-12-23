"use client";

import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { CreateProductSchema } from "@/lib/validators/product";
import { useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { X } from "lucide-react";


type CreateValues = z.infer<typeof CreateProductSchema>;

export function StepBasics({ form }: { form: UseFormReturn<CreateValues> }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          {...form.register("name")}
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Premium Wireless Headphones"
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...form.register("description")}
          rows={4}
          className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          placeholder="Describe your product features, benefits, and specifications..."
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("category")}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g., Electronics, Clothing"
          />
          {form.formState.errors.category && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("sku")}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g., WH-001-BLK"
          />
          {form.formState.errors.sku && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.sku.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}


export function StepPricing({ form }: { form: UseFormReturn<CreateValues> }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...form.register("price", { valueAsNumber: true })}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="999.00"
          />
          {form.formState.errors.price && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...form.register("stock", { valueAsNumber: true })}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="100"
          />
          {form.formState.errors.stock && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
        <input
          type="checkbox"
          id="isActive"
          {...form.register("isActive")}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
        />
        <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
          Active (visible to customers)
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        Inactive products won't appear in your store but will remain in your inventory.
      </p>
    </div>
  );
}


export function StepImagesReview({
  form,
  onUpload,
  onRemove,
}: {
  form: UseFormReturn<CreateValues>;
  onUpload: (file: File) => Promise<void>;
  onRemove: (key: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const images = form.watch("images");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">Product Images</label>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="relative flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="sr-only"
            />
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-muted-foreground">
              {uploading ? "Uploading..." : "Click to upload"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
          </label>

          {images.map((img) => (
            <div key={img.key} className="relative group h-40 rounded-lg border overflow-hidden bg-muted">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(img.key)}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {images.length === 0 && !uploading && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>No images uploaded yet. Add at least one product image.</span>
          </div>
        )}

        {form.formState.errors.images && (
          <p className="mt-2 text-xs text-red-600">{form.formState.errors.images.message}</p>
        )}
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <h3 className="text-sm font-semibold">Review Details</h3>
        <div className="grid gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product Name:</span>
            <span className="font-medium">{form.watch("name") || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">{form.watch("category") || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">₹{form.watch("price") || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stock:</span>
            <span className="font-medium">{form.watch("stock") || 0} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{form.watch("isActive") ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      {children}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
}
