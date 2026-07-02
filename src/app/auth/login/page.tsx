import type { Metadata } from "next";
import LoginPageClient from "./login-page-client";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Sign In",
  description:
    "Sign in to AdminSuite to access the private ecommerce admin dashboard for product management, analytics, inventory controls, and role-based workflows.",
  path: "/auth/login",
  keywords: ["admin login", "ecommerce dashboard login", "secure admin sign in"],
});

export default function LoginPage() {
  return <LoginPageClient />;
}
