import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseBasicAuth, isValidAdmin } from "@/lib/auth/basicAuth";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const shouldProtect = path.startsWith("/admin") || path.startsWith("/api");
  if (!shouldProtect) return NextResponse.next();

  const creds = parseBasicAuth(req.headers.get("authorization"));
  if (!creds) return unauthorized();

  if (!isValidAdmin(creds.user, creds.pass)) return unauthorized();
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
