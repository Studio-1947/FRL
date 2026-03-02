import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Check for the access_token cookie
  const token = request.cookies.get("access_token")?.value;

  // If the user doesn't have a token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists, let them proceed to the requested route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Add all paths here that require authentication to access.
  matcher: ["/life-balance/:path*", "/people/:path*", "/dashboard/:path*"],
};
