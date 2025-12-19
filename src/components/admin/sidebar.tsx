import Link from "next/link";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function Sidebar() {
  return (
    <aside className="rounded-lg border bg-background p-4">
      <div className="mb-4 text-lg font-semibold">Admin Dashboard</div>
      <nav className="space-y-1">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <p className="mt-6 text-xs text-muted-foreground">
        Protected by Basic Auth (middleware).
      </p>
    </aside>
  );
}
