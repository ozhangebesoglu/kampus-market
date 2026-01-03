"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient } from "@/lib/supabase/client";
import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations";

type Step = "password" | "otp" | "success";

export function SecurityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<Step>("password");
  const [otpCode, setOtpCode] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const supabase = createClient();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      // Önce mevcut şifre ile giriş yaparak doğrula
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error("Kullanıcı bilgisi alınamadı");
        return;
      }

      setUserEmail(user.email);

      // Mevcut şifre kontrolü - signInWithPassword ile doğrula
      // Bu aynı zamanda session'ı "fresh" yapar
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (verifyError) {
        form.setError("currentPassword", { message: "Mevcut şifre yanlış" });
        setIsLoading(false);
        return;
      }

      // Yeni şifreyi güncelle
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      // Reauthentication gerekiyorsa OTP adımına geç
      if (updateError?.code === "session_not_fresh") {
        // Şifreyi sakla, OTP doğrulamasından sonra kullanılacak
        setPendingPassword(data.newPassword);
        
        // Reauthentication emaili gönder
        const { error: reauthError } = await supabase.auth.reauthenticate();
        
        if (reauthError) {
          toast.error("Doğrulama e-postası gönderilemedi");
          setIsLoading(false);
          return;
        }

        setStep("otp");
        toast.info("E-postanıza 8 haneli doğrulama kodu gönderdik");
        setIsLoading(false);
        return;
      }

      if (updateError) throw updateError;

      form.reset();
      setStep("success");
      toast.success("Şifreniz başarıyla güncellendi");
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Şifre güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length !== 8) {
      toast.error("Lütfen 8 haneli kodu girin");
      return;
    }

    setIsLoading(true);

    try {
      // OTP ile doğrula - email type kullanarak
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: otpCode,
        type: "email",
      });

      if (verifyError) {
        toast.error("Doğrulama kodu geçersiz veya süresi dolmuş");
        setIsLoading(false);
        return;
      }

      // Şimdi şifreyi güncelle - session artık fresh
      const { error: updateError } = await supabase.auth.updateUser({
        password: pendingPassword,
      });

      if (updateError) throw updateError;

      form.reset();
      setOtpCode("");
      setPendingPassword("");
      setStep("success");
      toast.success("Şifreniz başarıyla güncellendi");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Şifre güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.reauthenticate();
      if (error) throw error;
      toast.success("Yeni doğrulama kodu gönderildi");
    } catch {
      toast.error("Kod gönderilemedi, lütfen tekrar deneyin");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep("password");
    setOtpCode("");
    setPendingPassword("");
    form.reset();
  };

  // Başarı durumu
  if (step === "success") {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium">Şifre Güncellendi</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Şifreniz başarıyla değiştirildi.
          </p>
          <Button className="mt-4" onClick={resetForm}>
            Tamam
          </Button>
        </div>
      </div>
    );
  }

  // OTP doğrulama adımı
  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">E-posta Doğrulaması</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Güvenliğiniz için <strong>{userEmail}</strong> adresine 8 haneli bir doğrulama kodu gönderdik.
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={8}
            value={otpCode}
            onChange={(value) => setOtpCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleOtpVerify} disabled={isLoading || otpCode.length !== 8}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Doğrula ve Şifreyi Değiştir
          </Button>
          <Button variant="ghost" onClick={handleResendOtp} disabled={isLoading}>
            Kodu Tekrar Gönder
          </Button>
          <Button variant="outline" onClick={resetForm} disabled={isLoading}>
            İptal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Şifre Değiştir</h3>
        <p className="text-sm text-muted-foreground">
          Hesap güvenliğiniz için güçlü bir şifre kullanın.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mevcut Şifre</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Mevcut şifrenizi girin"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yeni Şifre</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Yeni şifrenizi girin"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Yeni şifrenizi tekrar girin"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Şifre Gereksinimleri:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>En az 8 karakter</li>
              <li>En az bir büyük harf (A-Z)</li>
              <li>En az bir küçük harf (a-z)</li>
              <li>En az bir rakam (0-9)</li>
            </ul>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Şifreyi Güncelle
          </Button>
        </form>
      </Form>
    </div>
  );
}
