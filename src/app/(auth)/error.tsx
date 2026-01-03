"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Giriş Hatası</h2>
      <p className="text-muted-foreground mb-6">
        Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
      </p>

      <div className="flex flex-col gap-3">
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
    </div>
  );
}
