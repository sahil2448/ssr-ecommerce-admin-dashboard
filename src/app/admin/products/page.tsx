export const runtime = "nodejs";
import { ProductsTable } from "@/components/products/products-table";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Product Management",
  description:
    "Private AdminSuite product management page for creating, editing, searching, and deleting ecommerce catalog products with server-rendered tables and AI-assisted descriptions.",
  path: "/admin/products",
  keywords: ["product management", "ecommerce catalog", "inventory management", "product CRUD"],
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin/products");
  }
  
  const sp = await searchParams;
  const page = sp.page ?? "1";
  const search = sp.search ?? "";

  return (
    <main className="space-y-4">
      <section className="rounded-lg bg-card border shadow-sm p-4 sm:p-6" aria-label="Product catalog management">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
  <div>
    <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
      Manage your product catalog
    </p>
  </div>
  
  <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-2">
    <span>Logged in as:</span>
    <span className="font-medium text-foreground">{session.user.name}</span>
    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium uppercase">
      {session.user.role}
    </span>
  </div>
</div>

        
        <ProductsTable 
          initialQuery={{ page, search }}
          userRole={session.user.role}
        />
      </section>
    </main>
  );
}
