// app/account/orders/page.tsx
import prisma from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true } }, // for count
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-on-surface-variant">You have no orders yet.</p>
      ) : (
        <div className="rounded-lg border border-outline-variant overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr className="border-b border-outline-variant">
                <th className="px-4 py-3 text-sm font-medium">Order Number</th>
                <th className="px-4 py-3 text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-sm font-medium">Items</th>
                <th className="px-4 py-3 text-sm font-medium">Total</th>
                <th className="px-4 py-3 text-sm font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low transition">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{order.items.length}</td>
                  <td className="px-4 py-3 font-medium">${order.total.toString()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-surface-container-high">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}