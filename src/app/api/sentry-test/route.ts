import { NextResponse } from "next/server";

export async function GET() {
  throw new Error("Server-Side Sentry Crash Test! (Bypasses Ad Blockers)");
}
