import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });
  const body = await request.json();
  await saveSiteSettings(body);
  return NextResponse.json({ ok: true });
}
