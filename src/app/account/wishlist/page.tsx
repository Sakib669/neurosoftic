// app/account/wishlist/page.tsx
import { redirect } from "next/navigation";
import WishlistPageClient from "@/app/(storefront)/wishlist/WishlistPageClient";
import { auth } from "../../../../auth";

export default async function AccountWishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <WishlistPageClient isLoggedIn={true} />
    </div>
  );
}
