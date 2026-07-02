import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToastHandler } from "@/components/admin/toast-handler";
import { auth } from "@/lib/auth/auth";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Admin Dashboard",
  description:
    "Private AdminSuite ecommerce dashboard for managing products, sales analytics, inventory workflows, AI-assisted product content, and role-based access control.",
  path: "/admin",
  keywords: ["private admin dashboard", "ecommerce management console", "RBAC dashboard"],
});

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
