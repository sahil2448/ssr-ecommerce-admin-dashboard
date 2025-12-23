import { ProductsTable } from "@/components/products/products-table";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = sp.page ?? "1";
  const search = sp.search ?? "";

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
        </div>
        <ProductsTable initialQuery={{ page, search }} />
      </div>
    </div>
  );
}
