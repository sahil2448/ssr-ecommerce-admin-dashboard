import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Edit Product
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update product details, pricing, and images below.
        </p>
      </div>

      <div className="mx-auto">
        <MultiStepProductForm mode="edit" productId={id} />
      </div>
    </div>
  );
}
