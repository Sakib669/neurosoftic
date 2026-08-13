// app/admin/orders/page.tsx
import Link from "next/link";
import { getAllOrders } from "@/lib/services/orderAdminService";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="rounded-lg border border-outline-variant bg-surface overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 text-sm font-medium">Order #</th>
              <th className="px-4 py-3 text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-sm font-medium">Items</th>
              <th className="px-4 py-3 text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  {order.customer.name || order.customer.email}
                </td>
                <td className="px-4 py-3 text-sm text-on-surface-variant">
                  {order.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">{order.items.length}</td>
                <td className="px-4 py-3">${order.total.toString()}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs rounded bg-surface-container-high">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.orderNumber}`}
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
    </div>
  );
}