import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasSession =
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("__Secure-authjs.session-token") ||
      request.cookies.has("next-auth.session-token") ||
      request.cookies.has("__Secure-next-auth.session-token");

    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];

  if (firstSegment && isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
