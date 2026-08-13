// app/api/admin/theme/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getThemeConfig, updateThemeConfig, resetThemeConfig } from "@/lib/services/themeService";
import { auth } from "../../../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const theme = await getThemeConfig();
  return NextResponse.json(theme);
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN"];
    if (!allowed.includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { key, value } = body;
    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
    }

    await updateThemeConfig(key, value);
    const updatedTheme = await getThemeConfig();
    return NextResponse.json(updatedTheme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  // Reset to defaults
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN"];
    if (!allowed.includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const theme = await resetThemeConfig();
    return NextResponse.json(theme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}