import Link from "next/link";
import { getCurrentUser } from "@/services/auth.service";
import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">LUMIÈRE</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
            >
              Shop
            </Link>
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {user ? (
              <>
                {/* We'll use a link to an account/admin page if admin */}
                {(user as { role?: string }).role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="ghost" className="hidden sm:inline-flex">
                      Admin
                    </Button>
                  </Link>
                )}

                <form
                  action="/api/auth/signout"
                  method="POST"
                  className="inline"
                >
                  <Button variant="ghost" size="icon" type="submit">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Sign out</span>
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
