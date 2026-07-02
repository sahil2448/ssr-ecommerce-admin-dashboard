import type { Metadata } from "next";
import UnauthorizedClient from "./unauthorized-client";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Access Denied",
  description:
    "Private AdminSuite access denied page for users without sufficient role-based permissions to view protected ecommerce dashboard routes.",
  path: "/admin/unauthorized",
  keywords: ["access denied", "RBAC permissions", "admin authorization"],
});

export default function UnauthorizedPage() {
  return <UnauthorizedClient />;
}
