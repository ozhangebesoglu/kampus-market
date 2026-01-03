"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyFavorites } from "@/components/shared";
import { ListingCard } from "@/components/listings";
import { createClient } from "@/lib/supabase/client";
import type { ListingWithDetails } from "@/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ListingWithDetails[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        // Kullanıcı kontrolü
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }
        setUserId(user.id);

        // Favorileri çek
        const { data, error } = await supabase
          .from("favorites")
          .select(`
            listing_id,
            listings!inner (
              id,
              title,
              description,
              price,
              condition,
              status,
              created_at,
              category_id,
              seller_id,
              categories (
                id,
                name,
                slug,
                icon
              ),
              users!listings_seller_id_fkey (
                id,
                full_name,
                username,
                avatar_url,
                university_name
              ),
              listing_images (
                id,
                url,
                is_primary,
                sort_order
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Favorileri düzenle
        const listings = data?.map((fav) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const listing = fav.listings as any;
          return {
            id: listing.id as string,
            title: listing.title as string,
            description: listing.description as string,
            price: listing.price as number,
            condition: listing.condition as string,
            status: listing.status as string,
            created_at: listing.created_at as string,
            category_id: listing.category_id as string,
            seller_id: listing.seller_id as string,
            category: listing.categories as { id: string; name: string; slug: string; icon: string },
            seller: listing.users as { id: string; full_name: string; username: string; avatar_url: string; university_name: string },
            images: (listing.listing_images as Array<{ id: string; url: string; is_primary: boolean; sort_order: number }>)?.sort(
              (a, b) => a.sort_order - b.sort_order
            ) || [],
          };
        }).filter((listing) => listing.status === "active") || [];

        setFavorites(listings as ListingWithDetails[]);
        setFavoriteIds(new Set(listings.map((l) => l.id)));
      } catch (error) {
        console.error("Favorites fetch error:", error);
        toast.error("Favoriler yüklenirken hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavorites();
  }, [supabase]);

  const handleFavoriteToggle = async (listingId: string) => {
    if (!userId) {
      toast.error("Giriş yapmanız gerekiyor");
      return;
    }

    try {
      // Favoriden çıkar
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId);

      if (error) throw error;

      // State güncelle
      setFavorites((prev) => prev.filter((f) => f.id !== listingId));
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(listingId);
        return newSet;
      });

      toast.success("Favorilerden kaldırıldı");
    } catch (error) {
      console.error("Favorite toggle error:", error);
      toast.error("İşlem sırasında bir hata oluştu");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Giriş Yapın</h2>
          <p className="text-muted-foreground mb-4">
            Favorilerinizi görmek için giriş yapmanız gerekiyor.
          </p>
          <Button asChild>
            <Link href="/login?redirect=/favorites">Giriş Yap</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Favorilerim</h1>
          {favorites.length > 0 && (
            <span className="text-muted-foreground">({favorites.length})</span>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href="/listings">
            İlanları Keşfet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorite={favoriteIds.has(listing.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
