import "@/app/globals.css";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[260px_1fr] gap-6 p-6">
        <Sidebar />
        <div className="space-y-4">
          <Topbar />
          <div className="rounded-lg border bg-background p-4">{children}</div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
