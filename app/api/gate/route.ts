import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Nesprávné heslo" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ckk-access", "granted", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dní
  });
  return res;
}
