"use client";

import { useApiSWR } from "@/lib/swr";

export function OverviewCards() {
  const { data, isLoading } = useApiSWR<{
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    revenue: number;
    units: number;
  }>("/api/metrics/overview");

  const items = [
    { label: "Total products", value: data?.totalProducts ?? 0 },
    { label: "Low stock (≤5)", value: data?.lowStock ?? 0 },
    { label: "Out of stock", value: data?.outOfStock ?? 0 },
    { label: "Revenue", value: data?.revenue ?? 0 },
    { label: "Units sold", value: data?.units ?? 0 },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-5">
      {items.map((c) => (
        <div key={c.label} className="rounded-lg border bg-background p-3">
          <div className="text-xs text-muted-foreground">{c.label}</div>
          <div className="mt-1 text-lg font-semibold">{isLoading ? "…" : c.value}</div>
        </div>
      ))}
    </div>
  );
}
