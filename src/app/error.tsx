"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  const isDatabaseError =
    error.message.includes("Prisma") ||
    error.message.includes("connection") ||
    error.message.includes("SCRAM") ||
    error.message.includes("DATABASE_URL");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <AlertCircle className="text-destructive mb-6 h-20 w-20" />
      <h1 className="mb-3 text-3xl font-bold tracking-tight">
        {isDatabaseError
          ? "Database Connection Error"
          : "Something went wrong!"}
      </h1>

      <div className="mx-auto mb-8 max-w-md space-y-4">
        {isDatabaseError ? (
          <p className="text-muted-foreground">
            The application couldn&apos;t connect to the database. If
            you&apos;re running locally, make sure your{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              DATABASE_URL
            </code>{" "}
            is correctly set in your{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">.env</code>{" "}
            file.
          </p>
        ) : (
          <p className="text-muted-foreground">
            We&apos;ve encountered an unexpected error. Our team has been
            notified.
          </p>
        )}

        {/* Render actual error message in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-muted mt-4 max-h-40 overflow-auto rounded-md p-4 text-left font-mono text-xs">
            <p className="text-destructive font-semibold">
              {error.name}: {error.message}
            </p>
            {error.digest && (
              <p className="text-muted-foreground mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
