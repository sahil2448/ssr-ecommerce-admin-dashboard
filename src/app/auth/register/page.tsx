import type { Metadata } from "next";
import RegisterPageClient from "./register-page-client";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Create Account",
  description:
    "Create an AdminSuite account for private ecommerce dashboard access, product management workflows, analytics, and inventory administration.",
  path: "/auth/register",
  keywords: ["admin registration", "ecommerce dashboard account", "create admin account"],
});

export default function RegisterPage() {
  return <RegisterPageClient />;
}
