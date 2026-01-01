import { ProductsTable } from "@/components/products/products-table";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Management | Admin Dashboard",
  description: "Manage your e-commerce products with our server-rendered admin dashboard. Create, edit, and delete products efficiently.",
  keywords: ["product management", "e-commerce", "admin dashboard", "inventory"],
  robots: {
    index: false,
    follow: false,
  },
};

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
    <div className="space-y-4">
      <div className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl  font-bold">Products</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your product catalog
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Logged in as: <span className="font-medium">{session.user.name}</span>
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
              {session.user.role}
            </span>
          </div>
        </div>
        
        <ProductsTable 
          initialQuery={{ page, search }}
          userRole={session.user.role}
        />
      </div>
    </div>
  );
}
