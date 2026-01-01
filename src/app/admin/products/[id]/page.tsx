import { Metadata } from "next";
import { MultiStepProductForm } from "@/components/products/product-form/multi-step-form";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const product = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${id}`)
    .then(res => res.json())
    .catch(() => null);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Product Management`,
    description: product.description || "View and edit product details",
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.map((img: any) => img.url) || [],
    },
  };
}

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
