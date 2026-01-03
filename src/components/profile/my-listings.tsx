"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit2, Trash2, Eye, MoreVertical, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import type { ListingWithDetails, ListingStatus } from "@/types";

interface MyListingsProps {
  userId: string;
}

const STATUS_LABELS: Record<ListingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Taslak", variant: "secondary" },
  pending: { label: "Onay Bekliyor", variant: "outline" },
  active: { label: "Aktif", variant: "default" },
  sold: { label: "Satıldı", variant: "secondary" },
  rejected: { label: "Reddedildi", variant: "destructive" },
  deleted: { label: "Silindi", variant: "destructive" },
};

export function MyListings({ userId }: MyListingsProps) {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ListingWithDetails | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchListings();
  }, [userId]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          category:categories!category_id(*),
          images:listing_images(*)
        `)
        .eq("seller_id", userId)
        .neq("status", "deleted")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings((data as ListingWithDetails[]) || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("İlanlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedListing) return;

    try {
      // Soft delete - status'u deleted yap
      const { error } = await supabase
        .from("listings")
        .update({ status: "deleted", updated_at: new Date().toISOString() })
        .eq("id", selectedListing.id);

      if (error) throw error;

      setListings(listings.filter((l) => l.id !== selectedListing.id));
      toast.success("İlan başarıyla silindi");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("İlan silinirken bir hata oluştu");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  const handleMarkAsSold = async (listing: ListingWithDetails) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({ 
          status: "sold", 
          sold_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq("id", listing.id);

      if (error) throw error;

      setListings(listings.map((l) => 
        l.id === listing.id ? { ...l, status: "sold" as ListingStatus } : l
      ));
      toast.success("İlan satıldı olarak işaretlendi");
    } catch (error) {
      console.error("Error marking as sold:", error);
      toast.error("İşlem sırasında bir hata oluştu");
    }
  };

  const getPrimaryImage = (listing: ListingWithDetails) => {
    const images = listing.images || [];
    const primary = images.find((img) => img.is_primary);
    return primary?.url || images[0]?.url || "/placeholder-listing.jpg";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-24 w-24 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Henüz ilan oluşturmadınız.</p>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            İlk İlanınızı Oluşturun
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card"
          >
            {/* Image */}
            <Link href={`/listings/${listing.id}`} className="shrink-0">
              <div className="relative h-24 w-full sm:w-24 rounded-md overflow-hidden bg-muted">
                <Image
                  src={getPrimaryImage(listing)}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(listing.price)}
                  </p>
                </div>
                <Badge variant={STATUS_LABELS[listing.status].variant}>
                  {STATUS_LABELS[listing.status].label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {listing.view_count} görüntülenme
                </span>
                <span>{formatDate(listing.created_at)}</span>
              </div>

              {/* Rejection reason */}
              {listing.status === "rejected" && listing.rejection_reason && (
                <p className="mt-2 text-sm text-destructive">
                  Red sebebi: {listing.rejection_reason}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/listings/${listing.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Görüntüle
                    </Link>
                  </DropdownMenuItem>
                  {listing.status !== "sold" && listing.status !== "deleted" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/listings/${listing.id}/edit`}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Düzenle
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {listing.status === "active" && (
                    <DropdownMenuItem onClick={() => handleMarkAsSold(listing)}>
                      <Badge className="mr-2 h-4 w-4" />
                      Satıldı Olarak İşaretle
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setSelectedListing(listing);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. İlan kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
