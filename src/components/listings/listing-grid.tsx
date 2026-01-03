import { ListingCard } from "./listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ListingWithDetails } from "@/types";

interface ListingGridProps {
  listings: ListingWithDetails[];
  favorites?: string[];
  onFavoriteToggle?: (listingId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  favorites = [],
  onFavoriteToggle,
  isLoading = false,
  emptyMessage = "Henüz ilan bulunmuyor.",
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isFavorite={favorites.includes(listing.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between pt-3 border-t">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
