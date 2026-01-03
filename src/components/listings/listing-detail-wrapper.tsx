"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ListingDetail } from "@/components/listings/listing-detail";
import { useAuth } from "@/hooks/use-auth";
import { getOrCreateConversation } from "@/lib/services/messages";
import { createClient } from "@/lib/supabase/client";
import type { ListingWithDetails } from "@/types";

interface ListingDetailWrapperProps {
  listing: ListingWithDetails;
}

export function ListingDetailWrapper({ listing }: ListingDetailWrapperProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const supabase = createClient();

  // Favori durumunu kontrol et
  useEffect(() => {
    async function checkFavorite() {
      if (!user) return;
      
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", listing.id)
        .single();
      
      setIsFavorite(!!data);
    }
    
    checkFavorite();
  }, [user, listing.id, supabase]);

  const handleContact = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/listings/${listing.id}`);
      return;
    }

    // Kendi ilanına mesaj göndermeye çalışıyor mu?
    if (user.id === listing.seller_id) {
      toast.error("Kendi ilanınıza mesaj gönderemezsiniz");
      return;
    }

    try {
      // Konuşmayı bul veya oluştur
      const conversation = await getOrCreateConversation(
        listing.id,
        user.id,
        listing.seller_id
      );

      // Konuşma sayfasına yönlendir
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Konuşma başlatılırken bir hata oluştu");
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/listings/${listing.id}`);
      return;
    }

    setIsLoadingFavorite(true);

    try {
      if (isFavorite) {
        // Favorilerden kaldır
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listing.id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success("Favorilerden kaldırıldı");
      } else {
        // Favorilere ekle
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            listing_id: listing.id,
          });

        if (error) throw error;
        setIsFavorite(true);
        toast.success("Favorilere eklendi");
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
      toast.error("İşlem sırasında bir hata oluştu");
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <ListingDetail
      listing={listing}
      isFavorite={isFavorite}
      onFavoriteToggle={handleFavoriteToggle}
      onContact={handleContact}
    />
  );
}
