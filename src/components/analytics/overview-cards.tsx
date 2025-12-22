"use client";

import { useApiSWR } from "@/lib/swr";
import { TrendingUp, Package, AlertTriangle, DollarSign, ShoppingCart } from "lucide-react";

export function OverviewCards() {
  const { data, isLoading } = useApiSWR<{
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    revenue: number;
    units: number;
  }>("/api/metrics/overview");

  const cards = [
    {
      label: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Total Revenue",
      value: `₹${((data?.revenue ?? 0) / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Units Sold",
      value: data?.units ?? 0,
      icon: ShoppingCart,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Low Stock",
      value: data?.lowStock ?? 0,
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      label: "Out of Stock",
      value: data?.outOfStock ?? 0,
      icon: TrendingUp,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">{card.label}</div>
              <div className="text-2xl font-bold">{isLoading ? "..." : card.value}</div>
            </div>
            <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
