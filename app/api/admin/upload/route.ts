import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminSession } from "@/lib/admin";

const extToContentType: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
const contentTypeToExt: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?.dataBase64) return NextResponse.json({ error: "Chybí data souboru" }, { status: 400 });

  let contentType: string | undefined = body.contentType || undefined;
  if (!contentType && body.filename) {
    const ext = body.filename.split(".").pop()?.toLowerCase();
    contentType = ext ? extToContentType[ext] : undefined;
  }

  const ext = contentType ? contentTypeToExt[contentType] : undefined;
  if (!ext) return NextResponse.json({ error: "Podporované formáty: JPG, PNG, WEBP" }, { status: 400 });

  const buffer = Buffer.from(body.dataBase64, "base64");
  if (buffer.byteLength > 8 * 1024 * 1024) return NextResponse.json({ error: "Soubor je větší než 8 MB" }, { status: 400 });

  const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, buffer, {
    access: "public",
    contentType,
  });

  return NextResponse.json({ url: blob.url });
}
