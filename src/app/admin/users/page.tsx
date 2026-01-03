import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/admin/user-management";

export default async function UsersPage() {
  const session = await auth();

  
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin/users");
  }

  if (session.user.role !== "admin") {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-card border shadow-sm p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl  font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage user accounts with role assignments
          </p>
        </div>
        
        <UserManagement />
      </div>
    </div>
  );
}
