// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const session = await getSession(req);

  // 🔒 Not logged in
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.role;

  // 🎓 Student routes
  if (pathname.startsWith("/dashboard") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 👨‍🏫 Tutor routes
  if (pathname.startsWith("/tutor") && role !== "TUTOR") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 🛡️ Admin routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}



/* 🔥 THIS PART */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutor/:path*",
    "/admin/:path*",
  ],
};
