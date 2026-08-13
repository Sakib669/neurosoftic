// app/account/orders/[orderNumber]/page.tsx
import prisma from "@/lib/db";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../auth";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      shippingAddress: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      payments: true,
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  // Map statuses to a simple timeline
  const timelineSteps = [
    { status: "CONFIRMED", label: "Confirmed" },
    { status: "PROCESSING", label: "Processing" },
    { status: "PACKED", label: "Packed" },
    { status: "SHIPPED", label: "Shipped" },
    { status: "DELIVERED", label: "Delivered" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
        <Link href="/account/orders" className="text-sm text-primary hover:underline">
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-outline-variant overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr className="border-b border-outline-variant">
                  <th className="px-4 py-3 text-sm font-medium">Product</th>
                  <th className="px-4 py-3 text-sm font-medium">Variant</th>
                  <th className="px-4 py-3 text-sm font-medium text-center">Qty</th>
                  <th className="px-4 py-3 text-sm font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.productName}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {item.variantName}
                    </td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">${item.total.toString()}</td>
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

          {/* Status timeline */}
          <div className="rounded-lg border border-outline-variant p-6">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <div className="relative">
              {timelineSteps.map((step, idx) => {
                const isReached = order.status === step.status || idx < timelineSteps.findIndex(s => s.status === order.status);
                return (
                  <div key={step.status} className="flex items-start gap-4 relative pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${isReached ? "bg-primary border-primary" : "bg-surface border-outline-variant"}`} />
                      {idx < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-full ${isReached ? "bg-primary" : "bg-outline-variant"}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isReached ? "text-on-surface" : "text-on-surface-variant"}`}>
                        {step.label}
                      </p>
                      {isReached && order.statusHistory.find(h => h.toStatus === step.status) && (
                        <p className="text-xs text-on-surface-variant">
                          {order.statusHistory.find(h => h.toStatus === step.status)?.createdAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipping & Payment info */}
        <div className="space-y-4">
          <div className="rounded-lg border border-outline-variant p-6">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            {order.shippingAddress && (
              <div className="text-sm text-on-surface-variant">
                <p className="font-medium text-on-surface">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-outline-variant p-6">
            <h2 className="font-semibold mb-3">Payment</h2>
            {order.payments.length ? (
              order.payments.map((pay) => (
                <div key={pay.id} className="text-sm">
                  <p><span className="text-on-surface-variant">Method:</span> {pay.method || pay.provider}</p>
                  <p><span className="text-on-surface-variant">Status:</span> {pay.status}</p>
                  <p><span className="text-on-surface-variant">Amount:</span> ${pay.amount.toString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">No payment recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}