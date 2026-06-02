import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "MODERATOR") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (path.startsWith("/organizer") && token?.role !== "ORGANIZER" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if (path.startsWith("/tickets") && !token) {
        return NextResponse.redirect(new URL("/api/auth/signin?callbackUrl=/tickets", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/organizer/:path*", "/tickets/:path*"]
}
