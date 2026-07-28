"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-lg bg-white rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-red-600 mb-4">A Critical Error Occurred</h2>
          <p className="text-gray-600 mb-6">
            Our systems have captured this crash and our engineering team has been alerted via Sentry.
          </p>
          <button
            onClick={() => reset()}
            className="bg-gray-900 text-white font-medium py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Try recovering
          </button>
        </div>
      </body>
    </html>
  );
}
