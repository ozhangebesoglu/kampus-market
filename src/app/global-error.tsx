"use client";

import { AlertOctagon, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf1c7] p-4">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-[#cc241d]/10 flex items-center justify-center">
                <AlertOctagon className="h-12 w-12 text-[#cc241d]" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-[#3c3836]">
              Kritik Hata
            </h2>
            <p className="text-[#7c6f64] mb-8">
              Uygulama çalışırken kritik bir hata oluştu. Lütfen sayfayı
              yenileyin.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="bg-[#458588] hover:bg-[#076678] text-[#fbf1c7] px-4 py-2 rounded-md inline-flex items-center justify-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tekrar Dene
              </button>
              <a
                href="/"
                className="border border-[#bdae93] hover:bg-[#ebdbb2] text-[#3c3836] px-4 py-2 rounded-md inline-flex items-center justify-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
