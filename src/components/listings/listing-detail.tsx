"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Heart,
  Share2,
  Flag,
  MessageCircle,
  MapPin,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice, getInitials } from "@/lib/utils";
import { CONDITIONS } from "@/constants";
import type { ListingWithDetails } from "@/types";

interface ListingDetailProps {
  listing: ListingWithDetails;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onContact?: () => void;
}

export function ListingDetail({
  listing,
  isFavorite = false,
  onFavoriteToggle,
  onContact,
}: ListingDetailProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = listing.images?.map((img) => img.url) || [];
  const condition = CONDITIONS.find((c) => c.value === listing.condition);

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
    locale: tr,
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Fotoğraf yok</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative h-20 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-transparent"
                )}
              >
                <Image
                  src={image}
                  alt={`${listing.title} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-6">
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavoriteToggle}
                className="shrink-0"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isFavorite && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="shrink-0"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <p className="text-3xl md:text-4xl font-bold text-primary">
            {formatPrice(listing.price)}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {condition && <Badge variant="secondary">{condition.label}</Badge>}
          {listing.category && (
            <Badge variant="outline">{listing.category.name}</Badge>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{listing.seller?.university_name || "Üniversite"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{listing.view_count || 0} görüntülenme</span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h2 className="font-semibold mb-2">Açıklama</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {listing.description}
          </p>
        </div>

        <Separator />

        {/* Seller */}
        <div>
          <h2 className="font-semibold mb-4">Satıcı</h2>
          <div className="flex items-center gap-4">
            <Link href={`/users/${listing.seller_id}`}>
              <Avatar className="h-14 w-14">
                <AvatarImage src={listing.seller?.avatar_url || ""} />
                <AvatarFallback>
                  {getInitials(listing.seller?.full_name || "?")}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <Link
                href={`/users/${listing.seller_id}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {listing.seller?.full_name || "Kullanıcı"}
              </Link>
              <p className="text-sm text-muted-foreground">
                {listing.seller?.university_name}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1" size="lg" onClick={onContact}>
            <MessageCircle className="mr-2 h-5 w-5" />
            Mesaj Gönder
          </Button>
          <Button variant="outline" size="lg">
            <Flag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
