import Link from "next/link";
import { Search, Shield, MessageCircle, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, APP_NAME } from "@/constants";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#458588] via-[#076678] to-[#3c3836] text-[#ebdbb2]">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Öğrenciden Öğrenciye
              <br />
              <span className="text-[#fabd2f]">Güvenli Alışveriş</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[#a89984]">
              Üniversite öğrencileri için özel ikinci el alışveriş platformu.
              Kitaplardan elektroniğe, ihtiyacın olan her şey burada!
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-xl mx-auto bg-white rounded-lg p-2 shadow-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Ne arıyorsunuz?"
                  className="pl-10 border-0 focus-visible:ring-0 text-gray-900"
                />
              </div>
              <Button size="lg">Ara</Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-[#a89984] text-sm">Aktif İlan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-[#a89984] text-sm">Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-[#a89984] text-sm">Üniversite</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-[#fbf1c7] dark:fill-[#282828]"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#fbf1c7] dark:bg-[#282828]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kategoriler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              İhtiyacınıza göre kategori seçin ve binlerce ilan arasından aradığınızı bulun.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#ebdbb2] to-[#d5c4a1] dark:from-[#3c3836] dark:to-[#504945] p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  İlanları gör
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#ebdbb2] dark:bg-[#1d2021]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Neden {APP_NAME}?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Üniversite öğrencileri için özel olarak tasarlanmış platform avantajları
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#fbf1c7] dark:bg-[#3c3836] rounded-xl p-8 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-[#83a598]/20 dark:bg-[#83a598]/20 flex items-center justify-center mb-6">
                <GraduationCap className="h-6 w-6 text-[#076678] dark:text-[#83a598]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Sadece Öğrenciler
              </h3>
              <p className="text-muted-foreground">
                .edu.tr e-posta doğrulaması ile sadece üniversite öğrencileri
                platforma kayıt olabilir.
              </p>
            </div>

            <div className="bg-[#fbf1c7] dark:bg-[#3c3836] rounded-xl p-8 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-[#8ec07c]/20 dark:bg-[#8ec07c]/20 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-[#79740e] dark:text-[#8ec07c]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Güvenli Alışveriş</h3>
              <p className="text-muted-foreground">
                Doğrulanmış kullanıcılar, şeffaf profiller ve güvenilir
                değerlendirme sistemi.
              </p>
            </div>

            <div className="bg-[#fbf1c7] dark:bg-[#3c3836] rounded-xl p-8 shadow-sm">
              <div className="h-12 w-12 rounded-lg bg-[#d3869b]/20 dark:bg-[#d3869b]/20 flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6 text-[#8f3f71] dark:text-[#d3869b]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Anlık Mesajlaşma</h3>
              <p className="text-muted-foreground">
                Satıcılarla doğrudan ve anlık olarak iletişim kurabilir,
                pazarlık yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#d65d0e] to-[#af3a03] text-[#ebdbb2]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hemen Başla, Ücretsiz!
          </h2>
          <p className="text-xl text-[#ebdbb2]/80 mb-8 max-w-2xl mx-auto">
            Üniversite e-postanla kayıt ol ve dakikalar içinde alışverişe
            başla. Tamamen ücretsiz!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-[#af3a03] bg-[#ebdbb2] hover:bg-[#d5c4a1]"
            >
              <Link href="/register">
                Ücretsiz Kayıt Ol
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/listings">İlanları Keşfet</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
