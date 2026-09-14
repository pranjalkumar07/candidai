"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center px-4">
      <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
      <p className="text-light-100 max-w-md text-sm">
        An error occurred while loading this page. Please try refreshing or click below to retry.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="btn-primary">
          Try again
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="text-white border-dark-200"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
