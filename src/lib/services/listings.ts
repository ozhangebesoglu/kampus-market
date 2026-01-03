import { createClient } from "@/lib/supabase/client";
import {
  Listing,
  ListingWithDetails,
  ListingFilters,
  PaginatedResponse,
  CreateListingData,
  UpdateListingData,
} from "@/types";
import { DEFAULT_PAGE_SIZE } from "@/constants";

const supabase = createClient();

// ============================================
// İlan Listesi
// ============================================

export async function getListings(
  filters: ListingFilters = {},
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PaginatedResponse<ListingWithDetails>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("listings")
    .select(
      `
      *,
      seller:users!seller_id(*),
      category:categories!category_id(*),
      images:listing_images(*)
    `,
      { count: "exact" }
    )
    .eq("status", "active");

  // Kategori filtresi
  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }

  // Durum filtresi
  if (filters.condition && filters.condition.length > 0) {
    query = query.in("condition", filters.condition);
  }

  // Fiyat aralığı
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  // Arama
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Sıralama
  switch (filters.sortBy) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Sayfalama
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: (data as ListingWithDetails[]) || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// ============================================
// Tekil İlan
// ============================================

export async function getListingById(
  id: string
): Promise<ListingWithDetails | null> {
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
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    throw new Error(error.message);
  }

  return data as ListingWithDetails;
}

// ============================================
// İlan Oluşturma
// ============================================

export async function createListing(
  data: CreateListingData,
  userId: string
): Promise<Listing> {
  // 1. İlanı oluştur
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .insert({
      seller_id: userId,
      title: data.title,
      description: data.description,
      price: data.price,
      category_id: data.category_id,
      condition: data.condition,
      status: "pending", // Admin onayı bekleyecek
    })
    .select()
    .single();

  if (listingError) {
    throw new Error(listingError.message);
  }

  // 2. Görselleri yükle
  if (data.images && data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${listing.id}/${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listings")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("listings").getPublicUrl(fileName);

      // Görsel kaydını oluştur
      await supabase.from("listing_images").insert({
        listing_id: listing.id,
        url: publicUrl,
        sort_order: i,
        is_primary: i === 0,
      });
    }
  }

  return listing as Listing;
}

// ============================================
// İlan Güncelleme
// ============================================

export async function updateListing(
  id: string,
  data: UpdateListingData
): Promise<Listing> {
  const { data: listing, error } = await supabase
    .from("listings")
    .update({
      ...data,
      status: "pending", // Düzenleme sonrası tekrar onaya gider
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return listing as Listing;
}

// ============================================
// İlan Silme
// ============================================

export async function deleteListing(id: string): Promise<void> {
  const { error } = await supabase
    .from("listings")
    .update({ status: "deleted" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// ============================================
// Görüntülenme Sayısı Artırma
// ============================================

export async function incrementViewCount(id: string): Promise<void> {
  await supabase.rpc("increment_view_count", { listing_id: id });
}

// ============================================
// Kullanıcının İlanları
// ============================================

export async function getUserListings(
  userId: string,
  status?: string
): Promise<ListingWithDetails[]> {
  let query = supabase
    .from("listings")
    .select(
      `
      *,
      seller:users!seller_id(*),
      category:categories!category_id(*),
      images:listing_images(*)
    `
    )
    .eq("seller_id", userId)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as ListingWithDetails[]) || [];
}
