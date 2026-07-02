import type { Metadata } from "next";
import Link from "next/link";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata({
  title: "Authentication Error",
  description:
    "Authentication error page for AdminSuite sign-in failures, including OAuth access denial and database connection issues.",
  path: "/auth/error",
  keywords: ["authentication error", "OAuth error", "admin login error"],
});

const errorMessages: Record<string, string> = {
  AccessDenied:
    "Access was denied while completing sign in. This can happen when the database is unreachable or the account cannot be created.",
  Configuration: "The authentication provider is not configured correctly.",
  Verification: "The verification link is invalid or has expired.",
  Default: "Something went wrong while signing in.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = errorMessages[error || "Default"] ?? errorMessages.Default;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <section className="w-full max-w-[420px] text-center" aria-label="Authentication error message">
        <div className="bg-card rounded-2xl border shadow-md p-7 sm:p-9">
          <h1 className="text-2xl font-bold tracking-tight">Authentication Error</h1>
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          {error && <p className="mt-3 text-xs text-muted-foreground">Error code: {error}</p>}
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
