// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
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
  "CONTENT_MANAGER",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Debug: print session to terminal
  console.log("Admin Layout - Session:", session);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  const role = session.user.role as string;
  console.log("Admin Layout - Role:", role);

  if (!ADMIN_ROLES.includes(role)) {
    redirect(
      "/auth/error?error=Forbidden&message=You%20do%20not%20have%20permission%20to%20access%20admin%20pages",
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
