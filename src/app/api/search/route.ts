// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/services/searchService";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q") || "";
    const results = await searchProducts(query);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}