import { NextResponse } from "next/server";

// Lightweight health check endpoint.
// - No DB connection (so it never hangs on MongoDB timeouts)
// - Not matched by middleware (matcher only covers /admin, /api/products, /api/metrics)
// - Returns 200 immediately so Azure Container Apps health probes pass fast
export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}