import type { Metadata } from "next";

export const siteConfig = {
  name: "AdminSuite",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  title: "AdminSuite - SSR Ecommerce Admin Dashboard",
  description:
    "AdminSuite is a server-side rendered Next.js ecommerce admin dashboard for product management, sales analytics, inventory workflows, AI-assisted product content, and role-based access control.",
  image: "/Hero.png",
};

export const ecommerceAdminKeywords = [
  "ecommerce admin dashboard",
  "Next.js admin dashboard",
  "SSR ecommerce dashboard",
  "server-side rendered admin panel",
  "open source ecommerce dashboard",
  "SaaS admin dashboard",
  "product management dashboard",
  "inventory management software",
  "sales analytics dashboard",
  "AI ecommerce admin",
  "RBAC admin panel",
  "MongoDB ecommerce dashboard",
];

export const privateRouteRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function buildOpenGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title,
    description,
    url: path,
    images: [
      {
        url: siteConfig.image,
        width: 1200,
        height: 630,
        alt: "AdminSuite ecommerce admin dashboard interface with product management, analytics cards, and sidebar navigation",
      },
    ],
  };
}

export function buildTwitter({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.image],
  };
}

export function privatePageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords: [...ecommerceAdminKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: buildOpenGraph({
      title,
      description,
      path,
    }),
    twitter: buildTwitter({
      title,
      description,
    }),
    robots: privateRouteRobots,
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.image),
    screenshot: absoluteUrl(siteConfig.image),
    softwareVersion: "1.0.0",
    featureList: [
      "Server-side rendered product catalog management",
      "AI-assisted product description generation",
      "Sales analytics and revenue reporting",
      "Role-based access control for admin, editor, and viewer roles",
      "MongoDB-backed ecommerce metrics",
      "AWS S3 product image uploads",
      "Multi-step product creation and editing workflows",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
