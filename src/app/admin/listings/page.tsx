import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PendingListingsTable } from "@/components/admin/pending-listings-table";
import { ListingWithDetails } from "@/types";

export const metadata: Metadata = {
  title: "İlan Onay",
  description: "Bekleyen ilanları onayla veya reddet",
};

async function getPendingListings(): Promise<ListingWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      seller:users!seller_id(*),
      category:categories!category_id(*),
      images:listing_images(*)
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching pending listings:", error);
    return [];
  }

  return (data as ListingWithDetails[]) || [];
}

export default async function AdminListingsPage() {
  const listings = await getPendingListings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">İlan Onay</h1>
        <p className="text-muted-foreground mt-1">
          Onay bekleyen ilanları inceleyin
        </p>
      </div>

      <PendingListingsTable listings={listings} />
    </div>
  );
}
