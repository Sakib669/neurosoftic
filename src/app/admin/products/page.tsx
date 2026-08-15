// app/admin/products/page.tsx
import Link from "next/link";
import prisma from "@/lib/db";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      media: { where: { primary: true }, take: 1 },
      variants: {
        select: { id: true, price: true, salePrice: true, status: true },
      },
      category: true,
      brand: true,
    },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-on-primary hover:bg-primary-container"
        >
          Add Car Listing
        </Link>
      </div>

      <div className="rounded-lg border border-outline-variant bg-surface overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 text-sm font-medium">Product</th>
              <th className="px-4 py-3 text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-sm font-medium">Brand</th>
              <th className="px-4 py-3 text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products.map((product) => {
              const defaultVariant = product.variants[0];
              return (
                <tr key={product.id} className="hover:bg-surface-container-low">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-surface-container-high overflow-hidden shrink-0">
                        {product.media[0] && (
                          <img
                            src={product.media[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{product.category.name}</td>
                  <td className="px-4 py-3 text-sm">{product.brand.name}</td>
                  <td className="px-4 py-3 text-sm">
                    $
                    {defaultVariant
                      ? (
                          defaultVariant.salePrice ?? defaultVariant.price
                        ).toString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        product.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/products/${product.id}/variants`}
                      className="text-sm text-primary hover:underline"
                    >
                      Variants
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
