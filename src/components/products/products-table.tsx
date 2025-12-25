"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApiSWR } from "@/lib/swr";
import { api } from "@/lib/http";
import { toast } from "sonner";
import { DeleteProductDialog } from "./delete-product-dialog";
import { ProductDetailDialog } from "./product-detail-dialog";
import { Search, Plus, Package } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  isActive: boolean;
  images: { url: string; key: string }[];
  createdAt: string;
};

type ProductsResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface ProductsTableProps {
  initialQuery: { page: string; search: string };
  userRole: "admin" | "editor" | "viewer";
}

export function ProductsTable({ initialQuery, userRole }: ProductsTableProps) {
  const [search, setSearch] = useState(initialQuery.search);
  const [page, setPage] = useState(Number(initialQuery.page) || 1);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    if (search) p.set("search", search);
    p.set("limit", "10");
    p.set("sort", "newest");
    return p.toString();
  }, [page, search]);

  const { data, isLoading, mutate } = useApiSWR<ProductsResponse>(`/api/products?${qs}`);

  const canEdit = userRole === "admin" || userRole === "editor";
  const canDelete = userRole === "admin";

  async function onDelete(id: string) {
    if (userRole !== "admin") {
      toast.error("Only admins can delete products");
      return;
    }

    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      mutate();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-md border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        {canEdit && (
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <p className="hidden sm:inline">New Product</p>
          </Link>
        )}
        
        {!canEdit && (
          <div className="text-xs text-muted-foreground px-3 py-2 bg-muted rounded-md">
            Read-only access
          </div>
        )}
      </div>

      <div className="rounded-sm border bg-background shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                  Status
                </th>
                {canEdit && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:table-cell">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading && (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && (data?.items?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-4 py-8 text-center">
                    <div className="text-sm text-muted-foreground">No products found</div>
                    {canEdit && (
                      <Link
                        href="/admin/products/new"
                        className="mt-2 inline-block text-sm text-primary hover:underline cursor-pointer"
                      >
                        Create your first product
                      </Link>
                    )}
                  </td>
                </tr>
              )}
              {data?.items?.map((p) => (
                <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex-shrink-0 border">
                        {p.images?.[0]?.url ? (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement!.innerHTML = `
                                <div class="h-full w-full flex items-center justify-center">
                                  <svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-medium">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        p.stock === 0
                          ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : p.stock <= 5
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        p.isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  
                  {canEdit && (
                    <td className="px-4 py-3">
                      <div className="flex items-end sm:items-center justify-end gap-2">
                        <ProductDetailDialog product={p} />
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                        >
                          Edit
                        </Link>
                        
                        {canDelete && (
                          <DeleteProductDialog productName={p.name} onConfirm={() => onDelete(p._id)} />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-xs text-muted-foreground">
              Showing {(data.page - 1) * data.limit + 1} to {Math.min(data.page * data.limit, data.total)} of{" "}
              {data.total} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.page === 1}
                className="rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        data.page === pageNum ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={data.page === data.totalPages}
                className="rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
