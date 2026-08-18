import type { Metadata } from "next";
import LandingPageClient from "./landing-page-client";
import {
  breadcrumbJsonLd,
  buildOpenGraph,
  buildTwitter,
  ecommerceAdminKeywords,
  siteConfig,
} from "@/lib/seo";

const title = "AdminSuite - Open Source SSR Ecommerce Admin Dashboard";
const description =
  "Explore AdminSuite, a server-side rendered Next.js ecommerce admin dashboard for product management, AI-assisted product descriptions, inventory workflows, analytics, and role-based access control.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ecommerceAdminKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: buildOpenGraph({
    title,
    description,
    path: "/",
  }),
  twitter: buildTwitter({
    title,
    description,
  }),
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: siteConfig.name, path: "/" }])),
        }}
      />
      <LandingPageClient />
    </>
  );
}