// app/admin/page.tsx
import {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
} from "@/lib/services/adminService";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders();
  const lowStock = await getLowStockProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <p className="text-sm text-on-surface-variant">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <p className="text-sm text-on-surface-variant">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <p className="text-sm text-on-surface-variant">Low Stock Items</p>
          <p className="text-2xl font-bold mt-1 text-error">
            {stats.lowStockCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-lg border border-outline-variant bg-surface">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr className="border-b border-outline-variant">
                  <th className="px-4 py-2 text-sm font-medium">Order #</th>
                  <th className="px-4 py-2 text-sm font-medium">Customer</th>
                  <th className="px-4 py-2 text-sm font-medium">Date</th>
                  <th className="px-4 py-2 text-sm font-medium">Total</th>
                  <th className="px-4 py-2 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low">
                    <td className="px-4 py-2">{order.orderNumber}</td>
                    <td className="px-4 py-2">
                      {/* ✅ use customer instead of user */}
                      {order.customer.name || order.customer.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-on-surface-variant">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">${order.total.toString()}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-surface-container-high">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-lg border border-outline-variant bg-surface p-4">
          <h2 className="font-semibold mb-4">Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              No low stock items.
            </p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((inv) => (
                <li key={inv.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-surface-container-high shrink-0">
                    {inv.variant.product.media[0] && (
                      <img
                        src={inv.variant.product.media[0].url}
                        alt={inv.variant.product.name}
                        className="h-full w-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {inv.variant.product.name}
                    </p>
                    <p className="text-xs text-error">{inv.quantity} left</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
