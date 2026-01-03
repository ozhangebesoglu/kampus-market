import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

// ============================================
// AUTH SERVİS - Client-side
// ============================================

const supabase = createClient();

/**
 * Email ve şifre ile kayıt ol
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  // Email .edu.tr kontrolü
  if (!email.endsWith(".edu.tr")) {
    return {
      data: null,
      error: { message: "Sadece .edu.tr uzantılı e-posta adresleri kabul edilmektedir." },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Email ve şifre ile giriş yap
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Çıkış yap
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Şifre sıfırlama maili gönder
 */
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Yeni şifre belirle
 */
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Email doğrulama linkini yeniden gönder
 */
export async function resendVerificationEmail(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Mevcut kullanıcıyı getir
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, profile: null, error };
  }

  // Kullanıcı profilini getir
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { user, profile: null, error: profileError };
  }

  return { user, profile: profile as User, error: null };
}

/**
 * Auth state değişikliklerini dinle
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Session'ı getir
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}
