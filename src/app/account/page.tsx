// app/account/page.tsx
import prisma from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  // Fetch recent orders for this user
  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: { take: 1 }, // just to show item count maybe
    },
  });

  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { customer: true, addresses: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="md:col-span-2 rounded-lg border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-on-surface-variant">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.orderNumber}`}
                  className="flex items-center justify-between rounded border border-outline-variant px-4 py-3 hover:bg-surface-container-low transition"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-on-surface-variant">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toString()}</p>
                    <span className="text-xs px-2 py-1 rounded bg-surface-container-high text-on-surface">
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profile Summary */}
        <div className="space-y-4">
          <div className="rounded-lg border border-outline-variant p-6">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <p className="text-sm">
              <span className="text-on-surface-variant">Name:</span>{" "}
              {user?.name}
            </p>
            <p className="text-sm">
              <span className="text-on-surface-variant">Email:</span>{" "}
              {user?.email}
            </p>
            <p className="text-sm">
              <span className="text-on-surface-variant">Phone:</span>{" "}
              {user?.phone || "—"}
            </p>
            <Link
              href="/account/profile"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Edit Profile
            </Link>
          </div>

          <div className="rounded-lg border border-outline-variant p-6">
            <h2 className="text-lg font-semibold mb-4">Addresses</h2>
            {user?.addresses?.length ? (
              <p className="text-sm">
                {user.addresses[0].line1}, {user.addresses[0].city}
              </p>
            ) : (
              <p className="text-sm text-on-surface-variant">
                No address saved.
              </p>
            )}
            <Link
              href="/account/addresses"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Manage Addresses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
