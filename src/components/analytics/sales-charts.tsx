"use client";

import dynamic from "next/dynamic";

type SalesPayload = {
  daily: Array<{
    _id: { y: number; m: number; d: number };
    revenue: number;
    units: number;
  }>;
  topProducts: Array<{
    _id: string;
    units: number;
    revenue: number;
  }>;
};

const SalesChartClient = dynamic(() => import("./sales-charts-client"), { ssr: false });

export function SalesCharts({ initialData }: { initialData?: SalesPayload }) {
  if (!initialData) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="text-sm text-muted-foreground">Loading charts...</div>
      </div>
    );
  }

  return <SalesChartClient payload={initialData} />;
}
