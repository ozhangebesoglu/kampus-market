import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingGrid } from "@/components/listings/listing-grid";
import { ListingFilters } from "@/components/listings/listing-filters";
import { Category, ListingWithDetails } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Category;
}

async function getListingsByCategory(categoryId: string): Promise<ListingWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      seller:users!seller_id(*),
      category:categories!category_id(*),
      images:listing_images(*)
    `)
    .eq("category_id", categoryId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }

  return (data as ListingWithDetails[]) || [];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Kategori Bulunamadı" };
  }

  return {
    title: `${category.name} İlanları`,
    description: category.description || `${category.name} kategorisindeki ikinci el ürünleri keşfedin.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const listings = await getListingsByCategory(category.id);

  // Kategori ikonu için emoji mapping
  const iconMap: Record<string, string> = {
    "book-open": "📚",
    "laptop": "💻",
    "pencil": "✏️",
    "home": "🏠",
    "shirt": "👕",
    "dumbbell": "🏋️",
    "music": "🎵",
    "puzzle": "🧩",
    "package": "📦",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl bg-primary/10"
          >
            {iconMap[category.icon || "package"] || "📦"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">
              {category.description || `${category.name} kategorisindeki tüm ilanlar`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        <ListingFilters />
        <div className="flex-1">
          <ListingGrid
            listings={listings}
            isLoading={false}
            emptyMessage={`${category.name} kategorisinde henüz ilan bulunmuyor.`}
          />
        </div>
      </div>
    </div>
  );
}
