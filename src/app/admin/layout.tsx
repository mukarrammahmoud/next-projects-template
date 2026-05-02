import { requireAdmin } from "@/services/auth.service";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-muted/40 w-full shrink-0 border-r p-4 md:w-64 md:p-6">
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="text-muted-foreground hover:bg-muted hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="text-muted-foreground hover:bg-muted hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="text-muted-foreground hover:bg-muted hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
