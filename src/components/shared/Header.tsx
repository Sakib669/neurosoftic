// components/shared/Header.tsx
import Link from "next/link";
import { Search } from "lucide-react";
import { CartIcon } from "./CartIcon";
import { WishlistIcon } from "./WishlistIcon";
import { SignOutButton } from "./SignOutButton";
import { auth } from "../../../auth";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "ACCOUNTS",
];

export async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const role = session?.user?.role as string | undefined;
  const isAdmin = role ? ADMIN_ROLES.includes(role) : false;

  return (
    <header className="sticky top-0 z-50 border-b bg-surface">
      <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary whitespace-nowrap"
        >
          Neurosoftic
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex space-x-6">
          <Link
            href="/products"
            className="text-sm text-on-surface/70 hover:text-primary"
          >
            Shop
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-primary hover:underline"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Search Bar (desktop) */}
        <form
          action="/search"
          method="GET"
          className="hidden md:flex flex-1 max-w-md items-center rounded-full border border-outline-variant bg-surface-container-low px-4 py-2"
        >
          <input
            type="text"
            name="q"
            placeholder="Search cars..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-on-surface-variant"
            defaultValue=""
          />
          <button
            type="submit"
            className="text-on-surface-variant hover:text-primary transition"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile search icon (hidden on md+) */}
          <Link
            href="/search"
            className="md:hidden p-2 text-on-surface/70 hover:text-primary transition"
          >
            <Search className="h-5 w-5" />
          </Link>

          <WishlistIcon isLoggedIn={isLoggedIn} />
          <CartIcon />

          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link href="/account" className="text-sm whitespace-nowrap">
                Account
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/auth/login" className="text-sm whitespace-nowrap">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
