import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";

export default function NewProductPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center sm:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
Create product</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Multi-step form with Zod validation.</p>
      </div>
            <div className="mx-auto">
      <MultiStepProductForm mode="create" />
      </div>
    </div>
  );
}
