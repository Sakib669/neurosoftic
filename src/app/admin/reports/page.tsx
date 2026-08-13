// app/admin/reports/page.tsx
import {
  getSalesSummary,
  getTopProducts,
  getOrderStatusBreakdown,
} from "@/lib/services/reportService";

export default async function AdminReportsPage() {
  const sales = await getSalesSummary();
  const topProducts = await getTopProducts();
  const statusBreakdown = await getOrderStatusBreakdown();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <p className="text-sm text-on-surface-variant">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">${sales.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <p className="text-sm text-on-surface-variant">Orders</p>
          <p className="text-2xl font-bold mt-1">{sales.orderCount}</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <p className="text-sm text-on-surface-variant">Avg Order Value</p>
          <p className="text-2xl font-bold mt-1">${sales.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <h2 className="font-semibold mb-4">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No sales yet.</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((product) => (
                <li key={product.variantId} className="flex justify-between items-center">
                  <span className="text-sm">{product.productName}</span>
                  <span className="text-sm font-medium">{product.quantitySold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="rounded-lg border border-outline-variant bg-surface p-6">
          <h2 className="font-semibold mb-4">Order Status Breakdown</h2>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No orders.</p>
          ) : (
            <ul className="space-y-3">
              {statusBreakdown.map((item) => (
                <li key={item.status} className="flex justify-between items-center">
                  <span className="text-sm">{item.status}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}