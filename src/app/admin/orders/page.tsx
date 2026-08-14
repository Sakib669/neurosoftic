// src/app/admin/orders/page.tsx
import Link from "next/link";
import { getAllOrders } from "@/lib/services/orderAdminService";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    startDate?: string;
    endDate?: string;
    customerQuery?: string;
  }>;
}) {
  const sp = await searchParams;

  const orders = await getAllOrders({
    status: sp.status,
    startDate: sp.startDate,
    endDate: sp.endDate,
    customerQuery: sp.customerQuery,
  });

  const statuses = [
    "ALL",
    "PENDING_PAYMENT",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "READY_FOR_PICKUP",
    "SHIPPED",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
    "PAYMENT_FAILED",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {/* Filter form */}
      <form method="GET" className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            defaultValue={sp.status || "ALL"}
            className="rounded border border-outline-variant px-3 py-2 text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All Statuses" : status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            defaultValue={sp.startDate}
            className="rounded border border-outline-variant px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            defaultValue={sp.endDate}
            className="rounded border border-outline-variant px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <input
            type="text"
            name="customerQuery"
            placeholder="Name or email"
            defaultValue={sp.customerQuery}
            className="rounded border border-outline-variant px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-sm text-on-primary hover:bg-primary-container"
        >
          Apply
        </button>
        <Link
          href="/admin/orders"
          className="rounded border border-outline-variant px-4 py-2 text-sm text-on-surface hover:bg-surface-container"
        >
          Clear
        </Link>
      </form>

      {/* Orders table */}
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-on-surface-variant">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}