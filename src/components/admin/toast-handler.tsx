"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error === "unauthorized") {
      toast.error("Access denied. Only admins can access user management.");
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search);
    }

    if (success === "role_updated") {
      toast.success("Your role has been updated.");
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  return null;
}
