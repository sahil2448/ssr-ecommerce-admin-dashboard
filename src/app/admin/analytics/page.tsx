import { OverviewCards } from "@/components/analytics/overview-cards";
import { SalesCharts } from "@/components/analytics/sales-charts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <OverviewCards />
      </div>

      <div className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Sales Analytics</h2>
        <SalesCharts />
      </div>
    </div>
  );
}
