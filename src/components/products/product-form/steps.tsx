"use client";

import { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { CreateProductSchema } from "@/lib/validators/product";
import { useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { X, SendHorizonal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CreateValues = z.infer<typeof CreateProductSchema>;

export function StepBasics({ form }: { form: UseFormReturn<CreateValues> }) {
  const [aiKeywords, setAiKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleGenerateDescription() {
    const name = form.getValues("name"); 
    
    if (!name) {
      toast.error("Please enter a product name first");
      return;
    }

    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: name,
          keywords: aiKeywords
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      form.setValue("description", data.text, { shouldValidate: true });
      toast.success("Description generated using AI!");
      setOpen(false);
      setAiKeywords("");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2 text-foreground/90">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("name")}
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/50"
            placeholder="e.g., Sony WH-1000XM5 Headphones"
          />
          {form.formState.errors.name && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground/90">
              Description <span className="text-red-500">*</span>
            </label>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors px-2 py-1 rounded-md hover:bg-purple-50"
                >
                  <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  <span>Generate with AI</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4" align="end" >
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      AI Description Generator
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Add keywords to help AI generate better descriptions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      placeholder="e.g., waterproof, 2-year warranty, leather"
                      className="w-full bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isGenerating) {
                          e.preventDefault();
                          handleGenerateDescription();
                        }
                      }}
                    />
                    
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <SendHorizonal className="h-4 w-4" />
                          Generate Description
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
            
          <textarea
            {...form.register("description")}
            rows={5}
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed"
            placeholder="Product description will appear here..."
          />
          {form.formState.errors.description && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/90">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("category")}
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/50"
            placeholder="e.g., Electronics"
          />
          {form.formState.errors.category && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/90">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("sku")}
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/50"
            placeholder="e.g., WH-001-BLK"
          />
          {form.formState.errors.sku && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{form.formState.errors.sku.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepPricing({ form }: { form: UseFormReturn<CreateValues> }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/90">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
            <input
              type="number"
              step="0.01"
              {...form.register("price", { valueAsNumber: true })}
              className="w-full rounded-lg border bg-background pl-8 pr-4 py-2.5 text-sm transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/50"
              placeholder="999.00"
            />
          </div>
          {form.formState.errors.price && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/90">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...form.register("stock", { valueAsNumber: true })}
            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/50"
            placeholder="100"
          />
          {form.formState.errors.stock && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{form.formState.errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4 transition-colors hover:bg-muted/60">
        <input
          type="checkbox"
          id="isActive"
          {...form.register("isActive")}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
        />
        <div className="grid gap-1.5 cursor-pointer">
          <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
            Active Status
          </label>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When checked, this product will be immediately visible to customers in your store. Uncheck to save as a draft.
          </p>
        </div>
      </div>
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
      toast.error("Please select an image file");
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
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium mb-4 text-foreground/90">Product Images</label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <label className="relative flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="sr-only"
            />
            <div className="flex flex-col items-center gap-2 transition-transform group-hover:scale-105">
              <div className="p-3 rounded-full bg-background shadow-sm ring-1 ring-border">
                {uploading ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-foreground">Upload Image</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">Max 5MB</span>
              </div>
            </div>
          </label>

          {images.map((img) => (
            <div key={img.key} className="relative group aspect-square rounded-xl border overflow-hidden bg-background shadow-sm ring-1 ring-border/50">
              <img src={img.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(img.key)}
                  className="rounded-full bg-white/90 p-2 text-destructive hover:bg-red-50 hover:text-red-600 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && !uploading && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-50/50 border border-yellow-100 text-yellow-700">
            <ImageIcon className="h-4 w-4" />
            <span className="text-xs font-medium">No images uploaded yet. Add at least one image.</span>
          </div>
        )}

        {form.formState.errors.images && (
          <p className="mt-2 text-xs text-red-500 font-medium">{form.formState.errors.images.message}</p>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-muted/40 px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center py-1">
            <span className="text-xs text-muted-foreground">Name</span>
            <span className="text-sm font-medium text-right truncate max-w-[200px]">{form.watch("name") || "—"}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-t border-dashed">
            <span className="text-xs text-muted-foreground">Category</span>
            <span className="text-sm font-medium">{form.watch("category") || "—"}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-t border-dashed">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="text-sm font-medium">₹{form.watch("price") || 0}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-t border-dashed">
            <span className="text-xs text-muted-foreground">Stock</span>
            <span className="text-sm font-medium">{form.watch("stock") || 0} units</span>
          </div>
          <div className="flex justify-between items-center py-1 border-t border-dashed">
            <span className="text-xs text-muted-foreground">Status</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${form.watch("isActive") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
              {form.watch("isActive") ? "Active" : "Draft"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
