"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApiSWR } from "@/lib/swr";
import { api } from "@/lib/http";
import { toast } from "sonner";
import { DeleteProductDialog } from "./delete-product-dialog";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
};

type ProductsResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function ProductsTable({ initialQuery }: { initialQuery: { page: string; search: string } }) {
  const [search, setSearch] = useState(initialQuery.search);
  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", initialQuery.page);
    if (search) p.set("search", search);
    p.set("limit", "10");
    p.set("sort", "newest");
    return p.toString();
  }, [initialQuery.page, search]);

  const { data, isLoading, mutate } = useApiSWR<ProductsResponse>(`/api/products?${qs}`);

  async function onDelete(id: string) {
    await api(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Product deleted");
    mutate();
  }

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="rounded-md border">
        <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr_1fr_160px] gap-2 border-b bg-muted px-3 py-2 text-xs font-medium">
          <div>Name</div><div>Category</div><div>Price</div><div>Stock</div><div>SKU</div><div className="text-right">Actions</div>
        </div>

        {isLoading && <div className="p-4 text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && (data?.items?.length ?? 0) === 0 && (
          <div className="p-4 text-sm text-muted-foreground">No products found.</div>
        )}

        {data?.items?.map((p) => (
          <div key={p._id} className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr_1fr_160px] gap-2 px-3 py-3 text-sm">
            <div className="font-medium">{p.name}</div>
            <div className="text-muted-foreground">{p.category}</div>
            <div>₹{p.price}</div>
            <div>{p.stock}</div>
            <div className="text-muted-foreground">{p.sku}</div>
            <div className="flex justify-end gap-2">
              <Link className="rounded-md border px-2 py-1 text-xs" href={`/admin/products/${p._id}/edit`}>
                Edit
              </Link>
              <DeleteProductDialog productName={p.name} onConfirm={() => onDelete(p._id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
