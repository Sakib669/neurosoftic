// app/account/addresses/page.tsx
import { getUserAddresses } from "@/lib/services/customerService";
import { redirect } from "next/navigation";
import AddressList from "./AddressList";
import { auth } from "../../../../auth";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const addresses = await getUserAddresses(session.user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>
      <AddressList addresses={addresses} />
    </div>
  );
}