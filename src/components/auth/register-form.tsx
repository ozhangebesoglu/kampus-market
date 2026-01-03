"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Eye, EyeOff, User, Check, X } from "lucide-react";
import { toast } from "sonner";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  // Şifre gereksinimleri kontrolü
  const passwordRequirements = [
    { label: "En az 8 karakter", met: password.length >= 8 },
    { label: "Bir büyük harf", met: /[A-Z]/.test(password) },
    { label: "Bir küçük harf", met: /[a-z]/.test(password) },
    { label: "Bir rakam", met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    if (!captchaToken) {
      toast.error("Lütfen robot olmadığınızı doğrulayın");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken,
        },
      });

      if (error) {
        // Captcha'yı sıfırla
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        
        if (error.message.includes("already registered")) {
          toast.error("Bu email adresi zaten kayıtlı");
        } else if (error.message.includes("captcha")) {
          toast.error("Captcha doğrulaması başarısız. Lütfen tekrar deneyin.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success(
        "Kayıt başarılı! Lütfen email adresinizi doğrulayın.",
        {
          description: "Email'inizi kontrol edin ve doğrulama linkine tıklayın.",
          duration: 5000,
        }
      );
      router.push("/verify");
    } catch (error) {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Kayıt Ol</CardTitle>
        <CardDescription>
          Sadece .edu.tr uzantılı email adresleri kabul edilmektedir
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Ad Soyad */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Ad Soyad</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="full_name"
                type="text"
                placeholder="Ali Yılmaz"
                className="pl-10"
                {...register("full_name")}
                disabled={isLoading}
              />
            </div>
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Üniversite Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="ornek@ogrenci.edu.tr"
                className="pl-10"
                {...register("email")}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Şifre */}
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
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
            
            {/* Şifre Gereksinimleri */}
            {password && (
              <div className="space-y-1 rounded-md bg-muted p-3">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center text-sm ${
                      req.met ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {req.met ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <X className="mr-2 h-4 w-4" />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Şifre Tekrar */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
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

          {/* Kullanım Koşulları */}
          <p className="text-xs text-muted-foreground">
            Kayıt olarak{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Kullanım Koşulları
            </Link>{" "}
            ve{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Gizlilik Politikası
            </Link>
            'nı kabul etmiş olursunuz.
          </p>

          {/* hCaptcha */}
          {HCAPTCHA_SITE_KEY && (
            <div className="flex justify-center">
              <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => {
                  setCaptchaToken(null);
                  toast.error("Captcha yüklenirken hata oluştu");
                }}
                theme="dark"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kayıt Ol
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
