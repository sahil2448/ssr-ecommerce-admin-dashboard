import { OverviewCards } from "@/components/analytics/overview-cards";
import { SalesCharts } from "@/components/analytics/sales-charts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Sales + stock metrics from MongoDB aggregates.</p>
      </div>
      <OverviewCards />
      <SalesCharts />
    </div>
  );
}
