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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">Manage catalog with CRUD.</p>
        </div>
        <a
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          href="/admin/products/new"
        >
          New product
        </a>
      </div>

      <ProductsTable initialQuery={{ page, search }} />
    </div>
  );
}
