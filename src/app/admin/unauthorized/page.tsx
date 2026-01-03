"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function UnauthorizedPage() {
  const router = useRouter();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      toast.error("You don't have permission to access this page");
      hasShownToast.current = true;
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have permission to access this page. Please contact an admin to upgrade your role.
        </p>
        <button
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 cursor-pointer transition-colors"
        >
          Go to Products
        </button>
      </div>
    </div>
  );
}
