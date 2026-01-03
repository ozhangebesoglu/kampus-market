"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  // Şifre gereksinimleri kontrolü
  const requirements = [
    { text: "En az 8 karakter", met: password.length >= 8 },
    { text: "Büyük harf", met: /[A-Z]/.test(password) },
    { text: "Küçük harf", met: /[a-z]/.test(password) },
    { text: "Rakam", met: /\d/.test(password) },
  ];

  useEffect(() => {
    // URL hash'ten recovery token kontrolü
    const hashParams = new URLSearchParams(
      window.location.hash.substring(1)
    );
    const type = hashParams.get("type");
    
    if (type !== "recovery") {
      toast.error("Geçersiz veya süresi dolmuş bağlantı");
      router.push("/forgot-password");
    }
  }, [router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Şifreniz başarıyla güncellendi!");

      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Bir hata oluştu. Lütfen tekrar deneyin.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Şifre Güncellendi</CardTitle>
          <CardDescription>
            Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">Yeni Şifre Belirle</CardTitle>
        <CardDescription>
          Hesabınız için yeni bir şifre belirleyin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Yeni Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Şifre gereksinimleri */}
          {password && (
            <div className="space-y-1">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-xs ${
                    req.met ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  <CheckCircle
                    className={`h-3 w-3 ${
                      req.met ? "text-green-600" : "text-muted-foreground"
                    }`}
                  />
                  {req.text}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Şifreyi Güncelle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
