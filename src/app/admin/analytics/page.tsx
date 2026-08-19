import type { Metadata } from "next";
import { OverviewCards } from "@/components/analytics/overview-cards";
import { SalesCharts } from "@/components/analytics/sales-charts";
import { privatePageMetadata } from "@/lib/seo";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export const metadata: Metadata = privatePageMetadata({
  title: "Sales Analytics",
  description:
    "Private ecommerce sales analytics dashboard for tracking revenue trends, units sold, top products, and key business metrics over the last 30 days.",
  path: "/admin/analytics",
  keywords: ["sales analytics", "ecommerce metrics", "revenue tracking", "admin dashboard analytics"],
});

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const fromDate = new Date(Date.now() - THIRTY_DAYS_MS);

export default async function AnalyticsPage() {
  await connectDB();

  const [totalProducts, lowStock, outOfStock, paidRevenueAgg, salesData] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Product.countDocuments({ stock: 0 }),
    Order.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          units: { $sum: "$items.quantity" },
        },
      },
    ]),
    Order.aggregate([
      { $match: { status: "paid", createdAt: { $gte: fromDate } } },
      { $unwind: "$items" },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  y: { $year: "$createdAt" },
                  m: { $month: "$createdAt" },
                  d: { $dayOfMonth: "$createdAt" },
                },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                units: { $sum: "$items.quantity" },
              },
            },
            { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
          ],
          topProducts: [
            {
              $group: {
                _id: "$items.productId",
                units: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ]),
  ]);

  const overviewData = {
    totalProducts,
    lowStock,
    outOfStock,
    revenue: paidRevenueAgg[0]?.revenue ?? 0,
    units: paidRevenueAgg[0]?.units ?? 0,
  };

  const salesPayload = salesData[0] ?? { daily: [], topProducts: [] };

  return (
    <main className="space-y-6">
      <section aria-label="Key metrics overview" className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        <OverviewCards initialData={overviewData} />
      </section>
      <section aria-label="Sales analytics charts" className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
        <SalesCharts initialData={salesPayload} />
      </section>
    </main>
  );
}
