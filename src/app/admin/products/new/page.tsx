import type { Metadata } from "next";
import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Create Product",
  description:
    "Create a new ecommerce product in AdminSuite with a multi-step product form, Zod validation, product image uploads, pricing, stock controls, and AI-assisted descriptions.",
  path: "/admin/products/new",
  keywords: ["create product", "product form", "AI product descriptions", "inventory workflow"],
});

export default function NewProductPage() {
  return (
    <main className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <section aria-label="Create product form">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Create product</h1>
          <p className="mt-2 text-sm text-muted-foreground">Multi-step form with Zod validation.</p>
        </div>
        <div className="mx-auto">
          <MultiStepProductForm mode="create" />
        </div>
      </section>
    </main>
  );
}
