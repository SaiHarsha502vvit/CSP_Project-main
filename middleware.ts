import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=()");
  // Add more headers as needed
  return response;
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/") {
    return addSecurityHeaders(NextResponse.next());
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session && path === "/profile") {
    return addSecurityHeaders(NextResponse.redirect(new URL("/login", req.url)));
  } else if (session && (path === "/login" || path === "/register")) {
    return addSecurityHeaders(NextResponse.redirect(new URL("/profile", req.url)));
  }

  return addSecurityHeaders(NextResponse.next());
}