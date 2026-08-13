// app/account/profile/page.tsx

import { getUserProfile } from "@/lib/services/customerService";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { auth } from "../../../../auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await getUserProfile(session.user.id);
  if (!user) redirect("/auth/login");

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm user={user} />
    </div>
  );
}