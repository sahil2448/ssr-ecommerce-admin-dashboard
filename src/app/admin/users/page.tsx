import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/admin/user-management";
import { auth } from "@/lib/auth/auth";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "User Management",
  description:
    "Admin-only user management page for AdminSuite with role-based access control, account management, and admin, editor, and viewer role assignments.",
  path: "/admin/users",
  keywords: ["user management", "RBAC", "admin users", "role management"],
});

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin/users");
  }

  if (session.user.role !== "admin") {
    redirect("/admin/unauthorized");
  }

  return (
    <main className="space-y-4">
      <section className="rounded-lg bg-card border shadow-sm p-4 sm:p-6" aria-label="User management">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage user accounts with role assignments</p>
        </div>
        <UserManagement />
      </section>
    </main>
  );
}
