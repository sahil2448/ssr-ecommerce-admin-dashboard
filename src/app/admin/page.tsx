import type { Metadata } from "next";
import { OverviewCards } from "@/components/analytics/overview-cards";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { privatePageMetadata } from "@/lib/seo";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export const metadata: Metadata = privatePageMetadata({
  title: "Dashboard Overview",
  description:
    "AdminSuite dashboard overview showing key e-commerce metrics including total revenue, product count, units sold, low stock alerts, and out-of-stock items.",
  path: "/admin",
  keywords: ["dashboard overview", "ecommerce KPIs", "low stock alerts", "revenue summary"],
});

export default async function AdminDashboard() {
  await connectDB();

  const [totalProducts, lowStock, outOfStock, paidRevenueAgg] = await Promise.all([
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
  ]);

  const overviewData = {
    totalProducts,
    lowStock,
    outOfStock,
    revenue: paidRevenueAgg[0]?.revenue ?? 0,
    units: paidRevenueAgg[0]?.units ?? 0,
  };

  return (
    <main className="space-y-6">
      <section aria-label="Dashboard overview">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome to your e-commerce admin panel
          </p>
        </div>

        <OverviewCards initialData={overviewData} />
      </section>

      <section aria-label="Quick actions" className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="group rounded-md border bg-card p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <h2 className="font-semibold mb-2 flex items-center justify-between">
            Manage Products
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage your product catalog with multi-step forms
          </p>
        </Link>

        <Link
          href="/admin/analytics"
          className="group rounded-md border bg-card p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <h2 className="font-semibold mb-2 flex items-center justify-between">
            View Analytics
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Track revenue, units sold, and top performing products
          </p>
        </Link>
      </section>
    </main>
  );
}
