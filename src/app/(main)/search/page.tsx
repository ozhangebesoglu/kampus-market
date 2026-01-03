"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListingGrid } from "@/components/listings/listing-grid";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from "@/constants";
import type { ListingWithDetails } from "@/types";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [category, setCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [conditions, setConditions] = useState<string[]>(
    searchParams.get("condition")?.split(",").filter(Boolean) || []
  );
  const [minPrice, setMinPrice] = useState<number | null>(
    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null
  );
  const [maxPrice, setMaxPrice] = useState<number | null>(
    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sort") || "newest"
  );

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

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

    // Search query
    if (searchQuery.trim()) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    }

    // Category filter
    if (category) {
      // Önce kategori slug'ından ID'yi bul
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (categoryData) {
        query = query.eq("category_id", categoryData.id);
      }
    }

    // Condition filter
    if (conditions.length > 0) {
      query = query.in("condition", conditions);
    }

    // Price range
    if (minPrice !== null) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== null) {
      query = query.lte("price", maxPrice);
    }

    // Sorting
    switch (sortBy) {
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

    const { data, error, count } = await query.limit(50);

    if (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
      setTotalCount(0);
    } else {
      setListings((data as ListingWithDetails[]) || []);
      setTotalCount(count || 0);
    }

    setIsLoading(false);
  }, [searchQuery, category, conditions, minPrice, maxPrice, sortBy]);

  // Update URL with filters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (category) params.set("category", category);
    if (conditions.length > 0) params.set("condition", conditions.join(","));
    if (minPrice !== null) params.set("minPrice", String(minPrice));
    if (maxPrice !== null) params.set("maxPrice", String(maxPrice));
    if (sortBy !== "newest") params.set("sort", sortBy);

    const queryString = params.toString();
    router.replace(`/search${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [searchQuery, category, conditions, minPrice, maxPrice, sortBy, router]);

  // Initial fetch and URL sync
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Debounced URL update
  useEffect(() => {
    const timeout = setTimeout(updateURL, 300);
    return () => clearTimeout(timeout);
  }, [updateURL]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  // Condition toggle
  const handleConditionChange = (value: string, checked: boolean) => {
    if (checked) {
      setConditions([...conditions, value]);
    } else {
      setConditions(conditions.filter((c) => c !== value));
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setCategory(null);
    setConditions([]);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy("newest");
  };

  const hasActiveFilters =
    category || conditions.length > 0 || minPrice !== null || maxPrice !== null;

  // Filter content component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sıralama */}
      <div className="space-y-2">
        <Label>Sıralama</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sıralama seçin" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <Label>Kategori</Label>
        <Select
          value={category || "all"}
          onValueChange={(value) => setCategory(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Durum */}
      <div className="space-y-2">
        <Label>Ürün Durumu</Label>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition.value}`}
                checked={conditions.includes(condition.value)}
                onCheckedChange={(checked) =>
                  handleConditionChange(condition.value, checked as boolean)
                }
              />
              <label
                htmlFor={`condition-${condition.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {condition.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Fiyat Aralığı */}
      <div className="space-y-2">
        <Label>Fiyat Aralığı</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min ₺"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? Number(e.target.value) : null)
            }
            min={0}
          />
          <Input
            type="number"
            placeholder="Max ₺"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? Number(e.target.value) : null)
            }
            min={0}
          />
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Filtreleri Temizle
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">İlan Ara</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ne arıyorsunuz?"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Ara</Button>
        </form>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mt-4">
            {searchQuery.trim() ? (
              <>
                <span className="font-medium">&quot;{searchQuery}&quot;</span>{" "}
                için {totalCount} sonuç bulundu
              </>
            ) : (
              <>{totalCount} ilan listeleniyor</>
            )}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filtreler</h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 px-2 text-xs"
                >
                  Temizle
                </Button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtreler
                  {hasActiveFilters && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {
                        [
                          category,
                          conditions.length > 0,
                          minPrice !== null || maxPrice !== null,
                        ].filter(Boolean).length
                      }
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filtreler</SheetTitle>
                  <SheetDescription>
                    Arama sonuçlarınızı daraltın
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Listings Grid */}
          <ListingGrid
            listings={listings}
            isLoading={isLoading}
            emptyMessage={
              searchQuery.trim()
                ? `"${searchQuery}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`
                : "Henüz ilan bulunmuyor."
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-48 mb-4" />
            <div className="h-12 bg-muted rounded max-w-2xl mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card overflow-hidden">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-8 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
