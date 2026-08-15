import { NextRequest, NextResponse } from "next/server";
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/services/wishlistService";
import { auth } from "../../../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await getWishlistItems(session.user.id);
  const mapped = items.map((item) => ({
    variantId: item.variantId,
    productId: item.variant.productId,
    name: item.variant.product.name,
    variantName: item.variant.attributes
      .map((a) => a.attributeValue.value)
      .join(" / "),
    price: Number(item.variant.price),
    salePrice: item.variant.salePrice ? Number(item.variant.salePrice) : null,
    image: item.variant.product.media[0]?.url || "",
    sku: item.variant.sku,
  }));
  return NextResponse.json(mapped);
}



export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { variantId } = await req.json();
    if (!variantId)
      return NextResponse.json(
        { error: "variantId required" },
        { status: 400 },
      );

    await addToWishlist(session.user.id, variantId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { variantId } = await req.json();
    if (!variantId)
      return NextResponse.json(
        { error: "variantId required" },
        { status: 400 },
      );

    await removeFromWishlist(session.user.id, variantId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
