import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "KampüsMarket hesabınıza giriş yapın",
};

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
