// components/shared/Header.tsx
import Link from "next/link";
import { Search } from "lucide-react";
import { CartIcon } from "./CartIcon";
import { WishlistIcon } from "./WishlistIcon";
import { SignOutButton } from "./SignOutButton";
import { auth } from "../../../auth";

export async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <header className="sticky top-0 z-50 border-b bg-surface">
      <div className="flex h-20 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Neurosoftic
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/products"
            className="text-sm text-on-surface/70 hover:text-primary"
          >
            Shop
          </Link>
          <Link
            href="/search"
            className="text-sm text-on-surface/70 hover:text-primary"
          >
            Search
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">

          <WishlistIcon isLoggedIn={isLoggedIn} />
          <CartIcon />

          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link href="/account" className="text-sm">
                Account
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/auth/login" className="text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
