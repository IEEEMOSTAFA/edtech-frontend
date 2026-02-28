// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // public
//   if (
//     pathname === "/" ||
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/register")
//   ) {
//     return NextResponse.next();
//   }

//   // 🔐 just check session cookie exists
//   const session = req.cookies.get("better-auth.session_token");

//   if (!session) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/tutor/:path*",
//     "/admin/:path*",
//   ],
// };







// Tested file:
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const allCookies = req.cookies.getAll();
  
  const session = allCookies.find(
    (c) => c.name.includes("better-auth") || c.name.includes("session")
  );

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/tutor/:path*",
    "/admin/:path*",
    "/booking/:path*",
  ],
};