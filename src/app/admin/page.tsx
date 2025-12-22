import { OverviewCards } from "@/components/analytics/overview-cards";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to your e-commerce admin panel
        </p>
      </div>

      <OverviewCards />

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <h3 className="font-semibold mb-2 flex items-center justify-between">
            Manage Products
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage your product catalog with multi-step forms
          </p>
        </Link>

        <Link
          href="/admin/analytics"
          className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <h3 className="font-semibold mb-2 flex items-center justify-between">
            View Analytics
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-sm text-muted-foreground">
            Track revenue, units sold, and top performing products
          </p>
        </Link>
      </div>
    </div>
  );
}
