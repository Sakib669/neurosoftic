// app/admin/orders/[orderNumber]/page.tsx
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/services/orderAdminService";
import OrderStatusForm from "./OrderStatusForm";
import ShipmentButton from "./ShipmentButton";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
        <span className="text-sm text-on-surface-variant">
          Placed {order.createdAt.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-outline-variant bg-surface overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr className="border-b border-outline-variant">
                  <th className="px-4 py-3 text-sm font-medium">Product</th>
                  <th className="px-4 py-3 text-sm font-medium">Variant</th>
                  <th className="px-4 py-3 text-sm font-medium text-center">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.variant.product.media[0] && (
                          <img
                            src={item.variant.product.media[0].url}
                            alt={item.productName}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <span>{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.variantName}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      ${item.total.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end p-4 border-t border-outline-variant">
              <div className="w-56 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${order.shipping.toString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-outline-variant pt-2">
                  <span>Total</span>
                  <span>${order.total.toString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status history timeline */}
          <div className="rounded-lg border border-outline-variant bg-surface p-6">
            <h2 className="font-semibold mb-4">Status History</h2>
            <div className="space-y-4">
              {order.statusHistory.map((history) => (
                <div key={history.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                    <div className="w-px flex-1 bg-outline-variant" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">
                      {history.fromStatus} → {history.toStatus}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {history.createdAt.toLocaleString()}
                    </p>
                    {history.note && (
                      <p className="text-xs text-on-surface-variant mt-1">
                        {history.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: customer, shipping, payment, update status */}
        <div className="space-y-4">
          <div className="rounded-lg border border-outline-variant bg-surface p-6">
            <h2 className="font-semibold mb-3">Customer</h2>
            <p className="text-sm">
              <span className="text-on-surface-variant">Name:</span>{" "}
              {order.customer.name || "—"}
            </p>
            <p className="text-sm">
              <span className="text-on-surface-variant">Email:</span>{" "}
              {order.customer.email || "—"}
            </p>
            <p className="text-sm">
              <span className="text-on-surface-variant">Phone:</span>{" "}
              {order.customer.phone || "—"}
            </p>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface p-6">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            {order.shippingAddress ? (
              <div className="text-sm text-on-surface-variant">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No address</p>
            )}
          </div>

          {/* Courier / Shipment Section */}
          <div className="rounded-lg border border-outline-variant bg-surface p-6 space-y-3">
            <h2 className="font-semibold">Courier</h2>
            {order.shipment ? (
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-on-surface-variant">Provider:</span>{" "}
                  {order.shipment.courierProviderId ? "Steadfast" : "N/A"}
                </p>
                <p>
                  <span className="text-on-surface-variant">Tracking #:</span>{" "}
                  {order.shipment.trackingNumber || "N/A"}
                </p>
                <p>
                  <span className="text-on-surface-variant">Status:</span>{" "}
                  {order.shipment.status}
                </p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No shipment created.</p>
            )}
            <ShipmentButton orderId={order.id} />
          </div>

          <OrderStatusForm
            orderNumber={order.orderNumber}
            currentStatus={order.status}
          />
        </div>
      </div>
    </div>
  );
}