import { type NextRequest, NextResponse } from "next/server";
import { LoginController } from "@/app/controllers/loginController";

export async function middleware(request: NextRequest) {
  // Check if the path is public
  const isPublicPath =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  // Get token from cookie
  const token = request.cookies.get("access_token")?.value;

  // If it's a public path and user is logged in, redirect to game
  if (isPublicPath && token) {
    const isValidToken = await LoginController.validateToken(token);
    if (isValidToken && request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/game", request.url));
    }
  }

  // If it's a protected path and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists but is invalid, clear it and redirect to login
  if (token) {
    const isValidToken = await LoginController.validateToken(token);
    if (!isValidToken && !isPublicPath) {
      const response = NextResponse.redirect(new URL("/login", request.url));
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
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
