import Link from "next/link";
import { Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthNotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary/20 mb-4">404</h1>
      <h2 className="text-xl font-bold mb-4">Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground mb-8">
        Aradığınız sayfa mevcut değil.
      </p>

      <div className="flex flex-col gap-3">
        <Button asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Giriş Yap
          </Link>
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
