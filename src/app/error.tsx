"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ebdbb2] to-[#fbf1c7] dark:from-[#1d2021] dark:to-[#282828] p-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Bir Hata Oluştu</h2>
        <p className="text-muted-foreground mb-8">
          Üzgünüz, beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya
          daha sonra tekrar deneyin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tekrar Dene
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-left">
            <p className="text-sm font-mono text-muted-foreground break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
