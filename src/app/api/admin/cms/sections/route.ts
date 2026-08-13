// app/api/admin/cms/sections/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getHomepageSections,
  createHomepageSection,
} from "@/lib/services/cmsService";
import { auth } from "../../../../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sections = await getHomepageSections();
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowed = ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER"];
    if (!allowed.includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const section = await createHomepageSection(body);
    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    console.error("Create section failed:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}