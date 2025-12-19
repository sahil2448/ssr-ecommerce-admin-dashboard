"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/lib/http";
import { uploadToS3 } from "@/lib/s3-upload";
import { CreateProductSchema, UpdateProductSchema } from "@/lib/validators/product";
import type { z } from "zod";
import { StepBasics, StepPricing, StepImagesReview } from "./steps";
import { useApiSWR } from "@/lib/swr";

type CreateValues = z.infer<typeof CreateProductSchema>;
type Product = CreateValues & { _id: string };

export function MultiStepProductForm({
  mode,
  productId,
}: {
  mode: "create" | "edit";
  productId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const shouldLoad = mode === "edit" && !!productId;
  const { data: product, isLoading } = useApiSWR<Product>(shouldLoad ? `/api/products/${productId}` : null);

  const form = useForm<CreateValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      sku: "",
      images: [],
      isActive: true,
    },
    mode: "onChange",
  });

  // Prefill when product loads
  useEffect(() => {
    if (mode === "edit" && product) {
      form.reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        images: product.images ?? [],
        isActive: product.isActive ?? true,
      });
    }
  }, [mode, product, form]);

  const steps = useMemo(
    () => [
      { title: "Basics", fields: ["name", "description", "category", "sku"] as const },
      { title: "Pricing & Stock", fields: ["price", "stock", "isActive"] as const },
      { title: "Images", fields: ["images"] as const },
    ],
    []
  );

  async function next() {
    const fields = steps[step]!.fields as any;
    const ok = await form.trigger(fields);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
async function onSubmit(values: CreateValues) {
  try {
    if (mode === "create") {
      await api("/api/products", { method: "POST", body: JSON.stringify(values) });
      toast.success("Product created");
      router.push("/admin/products");
      router.refresh();
      return;
    }

    // edit mode: send all values (backend UpdateProductSchema will validate)
    await api(`/api/products/${productId}`, { 
      method: "PATCH", 
      body: JSON.stringify(values) 
    });
    toast.success("Product updated");
    router.push("/admin/products");
    router.refresh();
  } catch (error: any) {
    toast.error(error?.message ?? "Failed to save product");
    console.error("Save error:", error);
  }
}


  if (mode === "edit" && isLoading) {
    return <div className="text-sm text-muted-foreground">Loading product…</div>;
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">
          Step {step + 1} / {steps.length}: {steps[step]!.title}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {step === 0 && <StepBasics form={form} />}
        {step === 1 && <StepPricing form={form} />}
        {step === 2 && (
          <StepImagesReview
            form={form}
            onUpload={async (file) => {
              const img = await uploadToS3(file); // presigned PUT flow [web:148][web:150]
              const prev = form.getValues("images");
              form.setValue("images", [...prev, img], { shouldValidate: true });
              toast.success("Image uploaded");
            }}
            onRemove={(key) => {
              const nextImgs = form.getValues("images").filter((i) => i.key !== key);
              form.setValue("images", nextImgs, { shouldValidate: true });
            }}
          />
        )}

        <div className="flex justify-between pt-2">
          <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={back} disabled={step === 0}>
            Back
          </button>

          {step < steps.length - 1 ? (
            <button type="button" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={next}>
              Next
            </button>
          ) : (
            <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
              {mode === "create" ? "Create product" : "Save changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
