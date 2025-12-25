import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ToastHandler } from "@/components/admin/toast-handler";


export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin");
  }
  
  return (
    <>
      <ToastHandler />
      <AdminShell session={session}>{children}</AdminShell>
    </>
  );
}
