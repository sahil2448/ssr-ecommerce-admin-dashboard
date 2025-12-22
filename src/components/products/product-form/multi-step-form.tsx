"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/lib/http";
import { uploadToS3 } from "@/lib/s3-upload";
import { CreateProductSchema } from "@/lib/validators/product";
import type { z } from "zod";
import { StepBasics, StepPricing, StepImagesReview } from "./steps";
import { useApiSWR } from "@/lib/swr";
import { Check } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      { title: "Basic Info", fields: ["name", "description", "category", "sku"] as const },
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
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await api("/api/products", { method: "POST", body: JSON.stringify(values) });
        toast.success("Product created successfully");
        router.push("/admin/products");
        router.refresh();
        return;
      }

      await api(`/api/products/${productId}`, { method: "PATCH", body: JSON.stringify(values) });
      toast.success("Product updated successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (mode === "edit" && isLoading) {
    return <div className="text-sm text-muted-foreground">Loading product...</div>;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <div className="mt-2 text-xs font-medium text-center">{s.title}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-4 ${i < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 && <StepBasics form={form} />}
        {step === 1 && <StepPricing form={form} />}
        {step === 2 && (
          <StepImagesReview
            form={form}
            onUpload={async (file) => {
              const img = await uploadToS3(file);
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

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
