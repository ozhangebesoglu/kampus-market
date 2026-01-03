import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingDetailWrapper } from "@/components/listings/listing-detail-wrapper";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!listing) {
    return { title: "İlan Bulunamadı" };
  }

  return {
    title: listing.title,
    description: listing.description?.slice(0, 160),
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      category:categories(*),
      seller:users!seller_id(id, full_name, avatar_url, university_name),
      images:listing_images(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !listing) {
    notFound();
  }

  // View count artırma (fire and forget)
  supabase
    .from("listings")
    .update({ view_count: (listing.view_count || 0) + 1 })
    .eq("id", id)
    .then();

  return (
    <div className="container mx-auto px-4 py-8">
      <ListingDetailWrapper listing={listing} />
    </div>
  );
}
