import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  const product = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${id}`)
    .then(res => res.json())
    .catch(() => null);

  if (!product) {
    return {
      title: "Product Not Found",
    };
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
