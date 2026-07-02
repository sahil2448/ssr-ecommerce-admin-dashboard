import type { Metadata } from "next";
import { OverviewCards } from "@/components/analytics/overview-cards";
import { SalesCharts } from "@/components/analytics/sales-charts";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Sales Analytics",
  description:
    "Private ecommerce sales analytics dashboard for tracking revenue trends, units sold, top products, and key business metrics over the last 30 days.",
  path: "/admin/analytics",
  keywords: ["sales analytics", "ecommerce metrics", "revenue tracking", "admin dashboard analytics"],
});

export default function AnalyticsPage() {
  return (
    <main className="space-y-6">
      <section aria-label="Key metrics overview" className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        <OverviewCards />
      </section>
      <section aria-label="Sales analytics charts" className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
        <SalesCharts />
      </section>
    </main>
  );
}
