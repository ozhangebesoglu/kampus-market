import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings/listing-grid";
import { ListingFilters } from "@/components/listings/listing-filters";
import { createClient } from "@/lib/supabase/server";
import { ListingWithDetails } from "@/types";

export const metadata: Metadata = {
  title: "İlanlar",
  description: "Tüm ilanları keşfedin",
};

async function getListings(): Promise<ListingWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      seller:users!seller_id(*),
      category:categories!category_id(*),
      images:listing_images(*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }

  return (data as ListingWithDetails[]) || [];
}

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">İlanlar</h1>
          <p className="text-muted-foreground mt-1">
            Tüm kategorilerdeki ilanları keşfedin
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            İlan Ver
          </Link>
        </Button>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Filters */}
        <ListingFilters />

        {/* Listings Grid */}
        <div className="flex-1">
          <ListingGrid
            listings={listings}
            isLoading={false}
            emptyMessage="Henüz ilan bulunmuyor. İlk ilanı sen oluştur!"
          />
        </div>
      </div>
    </div>
  );
}
