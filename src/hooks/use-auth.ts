"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } =
    useAuthStore();
  const [supabase] = useState(() => createClient());

  // Kullanıcı bilgilerini yükle
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // users tablosundan profil bilgilerini al
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profile) {
          setUser(profile as User);
        } else {
          // Profil yoksa auth user bilgileriyle oluştur
          setUser({
            id: authUser.id,
            email: authUser.email!,
            full_name: authUser.user_metadata?.full_name || "",
            username: null,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            phone: null,
            bio: null,
            university_name: null,
            is_verified: authUser.email_confirmed_at !== null,
            is_admin: false,
            is_banned: false,
            ban_reason: null,
            ban_until: null,
            listings_count: 0,
            rating_avg: 0,
            rating_count: 0,
            created_at: authUser.created_at,
            updated_at: authUser.created_at,
            last_seen_at: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    }
  }, [supabase, setUser, setLoading]);

  // Auth state değişikliklerini dinle
  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loadUser();
      } else if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadUser, logout]);

  // Çıkış yap
  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
    router.push("/");
    router.refresh();
  };

  // Email doğrulama kontrolü
  const isEmailVerified = user?.is_verified ?? false;

  return {
    user,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    isAdmin: user?.is_admin ?? false,
    signOut,
    refreshUser: loadUser,
  };
}
