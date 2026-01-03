import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ROLE_PERMISSIONS = {
  admin: ["/admin/*"],
  editor: ["/admin/*"],
  viewer: ["/admin/*"],
  // editor: ["/admin/products", "/admin/products/*"],
  // viewer: ["/admin/products"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  
  const publicRoutes = ["/auth/login", "/auth/register", "/api/auth/*"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route.replace("*", ""))
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // @ts-ignore - Role might be undefined in edge runtime types but exists in token
    const userRole = session.user.role as keyof typeof ROLE_PERMISSIONS;
    const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];
    
    const hasAccess = allowedRoutes.some((route) => {
      if (route.endsWith("*")) {
        return pathname.startsWith(route.replace("*", ""));
      }
      return pathname === route;
    });
    
    // if (!hasAccess && userRole !== "admin") {
    //   return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
    // }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/metrics/:path*",
  ],
};
