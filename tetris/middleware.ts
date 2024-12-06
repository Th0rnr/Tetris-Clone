import { type NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/app/controllers/loginController";

export async function middleware(request: NextRequest) {
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/auth/login") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  const isProtectedApiPath =
    request.nextUrl.pathname.startsWith("/api/user") ||
    request.nextUrl.pathname.startsWith("/api/game");

  const token = request.cookies.get("access_token")?.value;

  if (isPublicPath && token) {
    const isValidToken = await validateToken(token);
    if (isValidToken && request.nextUrl.pathname === "/auth/login") {
      return NextResponse.redirect(new URL("/private/game", request.url));
    }
  }

  if ((!isPublicPath || isProtectedApiPath) && !token) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const isValidToken = await validateToken(token);
    if (!isValidToken && (!isPublicPath || isProtectedApiPath)) {
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
