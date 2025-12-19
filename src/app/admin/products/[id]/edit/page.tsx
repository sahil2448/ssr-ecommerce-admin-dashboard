import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Must await params in Next.js 15+ [web:171][web:172]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Edit product</h2>
        <p className="text-sm text-muted-foreground">Update fields, add/remove images, save.</p>
      </div>
      <MultiStepProductForm mode="edit" productId={id} />
    </div>
  );
}
