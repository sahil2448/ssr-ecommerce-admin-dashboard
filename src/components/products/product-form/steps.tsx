"use client";

import type { UseFormReturn } from "react-hook-form";

type Img = { url: string; key: string };

export function StepBasics({ form }: { form: UseFormReturn<any> }) {
  const { register, formState } = form;
  return (
    <div className="grid gap-3">
      <Field label="Name" error={formState.errors.name?.message as string}>
        <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("name")} />
      </Field>
      <Field label="SKU" error={formState.errors.sku?.message as string}>
        <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("sku")} />
      </Field>
      <Field label="Category" error={formState.errors.category?.message as string}>
        <input className="w-full rounded-md border px-3 py-2 text-sm" {...register("category")} />
      </Field>
      <Field label="Description" error={formState.errors.description?.message as string}>
        <textarea className="w-full rounded-md border px-3 py-2 text-sm min-h-[120px]" {...register("description")} />
      </Field>
    </div>
  );
}

export function StepPricing({ form }: { form: UseFormReturn<any> }) {
  const { register, formState } = form;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Price" error={formState.errors.price?.message as string}>
        <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("price", { valueAsNumber: true })} />
      </Field>
      <Field label="Stock" error={formState.errors.stock?.message as string}>
        <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" {...register("stock", { valueAsNumber: true })} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register("isActive")} />
        Active
      </label>
    </div>
  );
}

export function StepImagesReview({
  form,
  onUpload,
  onRemove,
}: {
  form: UseFormReturn<any>;
  onUpload: (file: File) => Promise<void>;
  onRemove: (key: string) => void;
}) {
  const images = (form.watch("images") ?? []) as Img[];
  const error = form.formState.errors.images?.message as string;

  return (
    <div className="space-y-3">
      <div className="rounded-md border p-3">
        <div className="text-sm font-medium">Upload images</div>
        <p className="text-xs text-muted-foreground">Upload 1–8 images (S3 presigned upload).</p>
        <input
          className="mt-2 block w-full text-sm"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            await onUpload(f);
            e.target.value = "";
          }}
        />
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.key} className="rounded-md border p-2">
            <img src={img.url} alt="Product" className="h-28 w-full rounded object-cover" />
            <button type="button" className="mt-2 w-full rounded-md border px-2 py-1 text-xs" onClick={() => onRemove(img.key)}>
              Remove
            </button>
          </div>
        ))}
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
