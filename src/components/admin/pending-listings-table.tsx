"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, X, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ListingWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";

interface PendingListingsTableProps {
  listings: ListingWithDetails[];
}

export function PendingListingsTable({ listings }: PendingListingsTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    listingId: string | null;
  }>({ open: false, listingId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [previewListing, setPreviewListing] =
    useState<ListingWithDetails | null>(null);

  const supabase = createClient();

  const handleApprove = async (listingId: string) => {
    setIsLoading(listingId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("listings")
        .update({
          status: "active",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", listingId);

      if (error) throw error;

      toast.success("İlan onaylandı!");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.listingId) return;

    setIsLoading(rejectDialog.listingId);
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          status: "rejected",
          rejection_reason: rejectReason || "İlan uygun görülmedi",
        })
        .eq("id", rejectDialog.listingId);

      if (error) throw error;

      toast.success("İlan reddedildi");
      setRejectDialog({ open: false, listingId: null });
      setRejectReason("");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(null);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Bekleyen ilan yok</h3>
        <p className="text-muted-foreground">
          Tüm ilanlar işlenmiş görünüyor
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İlan</TableHead>
              <TableHead>Satıcı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden relative">
                      {listing.images?.[0]?.url ? (
                        <Image
                          src={listing.images[0].url}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          📦
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium line-clamp-1">
                        {listing.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {listing.description.slice(0, 50)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {listing.seller?.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {listing.seller?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{listing.category?.name}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(listing.price)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(listing.created_at), "dd MMM yyyy", {
                    locale: tr,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewListing(listing)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(listing.id)}
                      disabled={isLoading === listing.id}
                    >
                      {isLoading === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setRejectDialog({ open: true, listingId: listing.id })
                      }
                      disabled={isLoading === listing.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) =>
          setRejectDialog({ open, listingId: open ? rejectDialog.listingId : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlanı Reddet</DialogTitle>
            <DialogDescription>
              Reddetme nedenini belirtin. Bu mesaj kullanıcıya iletilecek.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reddetme nedeni..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog({ open: false, listingId: null })}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading !== null}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reddet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewListing}
        onOpenChange={() => setPreviewListing(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewListing?.title}</DialogTitle>
          </DialogHeader>
          {previewListing && (
            <div className="space-y-4">
              {/* Images */}
              {previewListing.images && previewListing.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previewListing.images.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square relative rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img.url}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fiyat:</span>
                  <span className="font-bold">
                    {formatPrice(previewListing.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durum:</span>
                  <span>{previewListing.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori:</span>
                  <span>{previewListing.category?.name}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Açıklama</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {previewListing.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
