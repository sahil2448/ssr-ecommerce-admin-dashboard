import type { Metadata } from "next";
import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";
import { privatePageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return privatePageMetadata({
    title: "Edit Product",
    description:
      "Edit an existing ecommerce product in AdminSuite with structured catalog fields, inventory settings, image uploads, pricing controls, and AI-assisted content workflows.",
    path: `/admin/products/${id}/edit`,
    keywords: ["edit product", "product catalog editing", "inventory editing", "AI product content"],
  });
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <section aria-label="Edit product form">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Edit Product</h1>
          <p className="mt-2 text-sm text-muted-foreground">Update product details, pricing, and images below.</p>
        </div>

        <div className="mx-auto">
          <MultiStepProductForm mode="edit" productId={id} />
        </div>
      </section>
    </main>
  );
}
