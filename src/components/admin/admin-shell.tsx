"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarContent } from "@/components/admin/sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 border-r bg-card shadow-sm">
        <div className="flex h-full w-full flex-col">
          <div className="border-b bg-muted/30 px-4 py-4">
            <div className="text-base font-bold">Admin Dashboard</div>
            <div className="text-xs text-muted-foreground">E-commerce Management</div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-3 bg-card">
            <SidebarContent />
          </div>

          <div className="border-t bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
            Protected by Basic Auth
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <div className="md:hidden sticky top-0 z-30 border-b bg-card/95 backdrop-blur shadow-sm">
          <div className="flex items-center justify-between px-3 py-3 sm:px-4">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer shadow-sm"
            >
              <Menu className="h-4 w-4" />
              Menu
            </button>
            <div className="text-sm font-semibold">Dashboard</div>
          </div>
        </div>

       <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
          {children}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 cursor-pointer backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card border-r shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-4">
              <div>
                <div className="text-base font-bold">Admin Dashboard</div>
                <div className="text-xs text-muted-foreground">E-commerce Management</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3 bg-card">
              <SidebarContent />
            </div>

            <div className="border-t bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
              Protected by Basic Auth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
