import { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "E-posta Doğrulama",
  description: "E-posta adresinizi doğrulayın",
};

export default function VerifyPage() {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">E-postanızı Kontrol Edin</CardTitle>
        <CardDescription>
          Hesabınızı doğrulamak için e-posta adresinize bir bağlantı gönderdik.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
        <p>
          E-posta birkaç dakika içinde ulaşmazsa, spam klasörünüzü kontrol edin.
        </p>
        <p>
          Hala e-posta almadıysanız, tekrar kayıt olmayı deneyebilir veya destek
          ekibimizle iletişime geçebilirsiniz.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Giriş Sayfasına Dön
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
