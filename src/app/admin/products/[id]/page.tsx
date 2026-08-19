import type { Metadata } from "next";
import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";
import { absoluteUrl, privatePageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type ProductMetadata = {
  name?: string;
  description?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = (await fetch(absoluteUrl(`/api/products/${id}`), { cache: "no-store" }).then((res) =>
      res.ok ? res.json() : null
    )) as ProductMetadata | null;

    if (product?.name) {
      return privatePageMetadata({
        title: `${product.name} Product Details`,
        description:
          product.description ||
          "Private AdminSuite product detail page for reviewing product data, pricing, inventory, and ecommerce catalog metadata.",
        path: `/admin/products/${id}`,
        keywords: ["product details", "catalog metadata", "inventory details"],
      });
    }
  } catch {
    // Metadata should never block the authenticated product page.
  }

  return privatePageMetadata({
    title: "Product Details",
    description:
      "Private AdminSuite product detail page for reviewing product data, pricing, inventory, and ecommerce catalog metadata.",
    path: `/admin/products/${id}`,
    keywords: ["product details", "catalog metadata", "inventory details"],
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
