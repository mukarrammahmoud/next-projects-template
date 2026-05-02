"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Critical Application Error
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            The application encountered a fatal error while trying to render the
            page layout or connect to critical services.
          </p>

          <div className="flex gap-4">
            <Button onClick={() => reset()}>Try again</Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Reload App
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
