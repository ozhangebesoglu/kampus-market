import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditListingForm } from "@/components/listings/edit-listing-form";
import type { ListingWithDetails } from "@/types";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "İlanı Düzenle",
  description: "İlan bilgilerini güncelleyin",
};

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Kullanıcı kontrolü
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/listings/${id}/edit`);
  }

  // İlanı getir
  const { data: listing, error } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(*),
      seller:users!seller_id(id, full_name, avatar_url, university_name),
      images:listing_images(*)
    `)
    .eq("id", id)
    .single();

  if (error || !listing) {
    notFound();
  }

  // Yetki kontrolü - sadece ilan sahibi düzenleyebilir
  if (listing.seller_id !== user.id) {
    redirect(`/listings/${id}`);
  }

  // Satılmış veya silinmiş ilanlar düzenlenemez
  if (listing.status === "sold" || listing.status === "deleted") {
    redirect(`/listings/${id}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EditListingForm listing={listing as ListingWithDetails} />
    </div>
  );
}
