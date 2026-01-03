import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types";

const supabase = createClient();

// ============================================
// Tüm Kategoriler
// ============================================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Category[]) || [];
}

// ============================================
// Slug ile Kategori
// ============================================

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as Category;
}
