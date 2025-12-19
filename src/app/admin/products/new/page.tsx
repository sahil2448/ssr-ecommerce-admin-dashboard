import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create product</h2>
        <p className="text-sm text-muted-foreground">Multi-step form with Zod validation.</p>
      </div>
      <MultiStepProductForm mode="create" />
    </div>
  );
}
