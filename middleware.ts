import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PREFIXES = ["/gate", "/api/gate", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get("ckk-access")?.value === "granted";
  if (!hasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = "/gate";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
