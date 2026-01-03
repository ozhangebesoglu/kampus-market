import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ebdbb2] to-[#fbf1c7] dark:from-[#1d2021] dark:to-[#282828] p-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
        </div>

        <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen adresi
          kontrol edin veya ana sayfaya dönün.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfa
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/listings">
              <Search className="mr-2 h-4 w-4" />
              İlanları Keşfet
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
