"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 shadow-sm max-w-md w-full backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-red-600 mb-4 font-outfit">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-8 font-inter">
          We&apos;ve been notified about this error and are looking into it. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors w-full font-inter"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
