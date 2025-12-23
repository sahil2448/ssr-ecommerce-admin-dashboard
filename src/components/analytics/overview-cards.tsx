"use client";

import React from "react";
import { useApiSWR } from "@/lib/swr";
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  ShoppingCart,
  ChevronRight
} from "lucide-react";

export function OverviewCards() {
  const { data, isLoading } = useApiSWR<{
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    revenue: number;
    units: number;
  }>("/api/metrics/overview");

  const formatCurrency = (val: number | undefined | null) => {
    if (val === undefined || val === null) return "₹0";
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  const cards = [
    {
      label: "Total Revenue",
      value: data ? formatCurrency(data.revenue) : "₹0",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      description: "Gross earnings",
    },
    {
      label: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      description: "Live items",
    },
    {
      label: "Units Sold",
      value: data?.units ?? 0,
      icon: ShoppingCart,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/40",
      description: "Items moved",
    },
    {
      label: "Low Stock",
      value: data?.lowStock ?? 0,
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      description: "Check soon",
    },
    {
      label: "Out of Stock",
      value: data?.outOfStock ?? 0,
      icon: TrendingUp,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/40",
      description: "Critical action",
    },
  ];


  return (
    <div className="grid gap-4 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <div 
          key={card.label} 
          className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-2 bg-card p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 active:scale-95 cursor-default"
        >
          <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 blur-2xl transition-opacity group-hover:opacity-10 ${card.bg}`} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-sm border ${card.border} ${card.bg} ${card.color} shadow-sm transition-transform duration-300 group-hover:rotate-12`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div className="opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                {card.label}
              </p>
              {isLoading ? (
                <div className="h-9 w-2/3 animate-pulse rounded-lg bg-muted" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {card.value}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-tight">
              {card.description}
            </span>
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${card.color.replace('text-', 'bg-')}`} />
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-muted/20">
            <div className={`h-full w-0 bg-current ${card.color} transition-all duration-500 ease-out group-hover:w-full`} />
          </div>
        </div>
      ))}
    </div>
  );
}
