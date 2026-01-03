import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">İlan Bulunamadı</h2>
        <p className="text-muted-foreground mb-8">
          Aradığınız ilan mevcut değil, satılmış veya kaldırılmış olabilir.
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
              Tüm İlanlar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
