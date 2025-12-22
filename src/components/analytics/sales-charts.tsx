"use client";

import dynamic from "next/dynamic";
import { useApiSWR } from "@/lib/swr";

const SalesChartClient = dynamic(() => import("./sales-charts-client"), { ssr: false });

export function SalesCharts() {
  const { data, isLoading } = useApiSWR<any>("/api/metrics/sales?days=30");

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="text-sm text-muted-foreground">Loading charts...</div>
      </div>
    );
  }

  return <SalesChartClient payload={data} />;
}
