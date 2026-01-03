import Link from "next/link";
import { Package, Github, Twitter, Instagram } from "lucide-react";
import { APP_NAME, CATEGORIES } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo & Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Üniversite öğrencileri için güvenli ikinci el alışveriş platformu.
              Sadece .edu.tr email ile kayıt olabilirsiniz.
            </p>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Kategoriler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-foreground transition-colors"
                >
                  Nasıl Çalışır?
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Yasal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/kvkk"
                  className="hover:text-foreground transition-colors"
                >
                  KVKK Aydınlatma Metni
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {APP_NAME}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
