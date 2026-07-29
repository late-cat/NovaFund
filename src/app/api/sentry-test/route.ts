import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  Sentry.captureException(new Error("Server-Side Sentry Crash Test! (Explicit Capture)"));
  await Sentry.flush(2000);
  return NextResponse.json({ success: true, message: "Error sent to Sentry!" });
}
