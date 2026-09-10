import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;

    // Strict Role-Based Route Protection
    if (path.startsWith("/portal") && role !== "EMPLOYEE") {
      return redirectBasedOnRole(role, req.url);
    }
    if (path.startsWith("/tl-dashboard") && role !== "TEAM_LEAD") {
      return redirectBasedOnRole(role, req.url);
    }
    if (path.startsWith("/hr-dashboard") && role !== "ADMIN_HR") {
      return redirectBasedOnRole(role, req.url);
    }
    if (path.startsWith("/manager-dashboard") && role !== "MANAGER") {
      return redirectBasedOnRole(role, req.url);
    }
    if (path.startsWith("/saas-dashboard") && role !== "SUPER_ADMIN") {
      return redirectBasedOnRole(role, req.url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

function redirectBasedOnRole(role: string, baseUrl: string) {
  switch (role) {
    case "EMPLOYEE":
      return NextResponse.redirect(new URL("/portal", baseUrl));
    case "TEAM_LEAD":
      return NextResponse.redirect(new URL("/tl-dashboard", baseUrl));
    case "ADMIN_HR":
      return NextResponse.redirect(new URL("/hr-dashboard", baseUrl));
    case "MANAGER":
      return NextResponse.redirect(new URL("/manager-dashboard", baseUrl));
    case "SUPER_ADMIN":
      return NextResponse.redirect(new URL("/saas-dashboard", baseUrl));
    default:
      return NextResponse.redirect(new URL("/login", baseUrl));
  }
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/tl-dashboard/:path*",
    "/hr-dashboard/:path*",
    "/manager-dashboard/:path*",
    "/saas-dashboard/:path*",
  ],
};
