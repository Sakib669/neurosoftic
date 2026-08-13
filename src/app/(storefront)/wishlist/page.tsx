// app/(storefront)/wishlist/page.tsx
import { auth } from "../../../../auth";
import WishlistPageClient from "./WishlistPageClient";

export default async function WishlistPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <WishlistPageClient isLoggedIn={isLoggedIn} />
    </div>
  );
}