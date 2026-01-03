import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { CATEGORIES, CONDITIONS } from "@/constants";
import type { ListingWithDetails } from "@/types";

interface ListingCardProps {
  listing: ListingWithDetails;
  isFavorite?: boolean;
  onFavoriteToggle?: (listingId: string) => void;
  className?: string;
}

export function ListingCard({
  listing,
  isFavorite = false,
  onFavoriteToggle,
  className,
}: ListingCardProps) {
  const category = CATEGORIES.find((c) => c.slug === listing.category?.slug);
  const condition = CONDITIONS.find((c) => c.value === listing.condition);

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/listings/${listing.id}`}>
          <Image
            src={listing.images?.[0]?.url || "/placeholder.jpg"}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Favori butonu */}
        {onFavoriteToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={() => onFavoriteToggle(listing.id)}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              )}
            />
          </Button>
        )}

        {/* Durum badge'i */}
        {condition && (
          <Badge
            variant="secondary"
            className="absolute bottom-2 left-2 bg-white/90"
          >
            {condition.label}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
        </Link>

        <p className="text-2xl font-bold text-primary mt-1">
          {formatPrice(listing.price)}
        </p>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          {category && (
            <div className="flex items-center gap-1">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{listing.seller?.university_name || "Üniversite"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
