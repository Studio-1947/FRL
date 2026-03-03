import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { nextUrl, cookies } = request;
  const token = cookies.get("access_token")?.value;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/signup");

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Add all paths here that require authentication to access.
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/life-balance/:path*",
    "/people/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};
