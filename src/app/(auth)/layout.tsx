import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ebdbb2] via-[#fbf1c7] to-[#d5c4a1] dark:from-[#1d2021] dark:via-[#282828] dark:to-[#3c3836] p-4">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
      >
        <GraduationCap className="h-8 w-8" />
        <span>{APP_NAME}</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-sm text-muted-foreground text-center">
        Devam ederek{" "}
        <Link href="/terms" className="underline hover:text-primary">
          Kullanım Koşulları
        </Link>{" "}
        ve{" "}
        <Link href="/privacy" className="underline hover:text-primary">
          Gizlilik Politikası
        </Link>
        'nı kabul etmiş olursunuz.
      </p>
    </div>
  );
}
