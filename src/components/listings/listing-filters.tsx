"use client";

import { useFilterStore } from "@/stores";
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
import { CATEGORIES, CONDITIONS, SORT_OPTIONS } from "@/constants";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ListingFiltersProps {
  onFilterChange?: () => void;
}

export function ListingFilters({ onFilterChange }: ListingFiltersProps) {
  const {
    category,
    conditions,
    minPrice,
    maxPrice,
    sortBy,
    setCategory,
    setConditions,
    setPriceRange,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters =
    category || conditions.length > 0 || minPrice || maxPrice;

  const handleConditionChange = (value: string, checked: boolean) => {
    if (checked) {
      setConditions([...conditions, value]);
    } else {
      setConditions(conditions.filter((c) => c !== value));
    }
    onFilterChange?.();
  };

  const handleReset = () => {
    resetFilters();
    onFilterChange?.();
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sıralama */}
      <div className="space-y-2">
        <Label>Sıralama</Label>
        <Select
          value={sortBy}
          onValueChange={(value: "newest" | "oldest" | "price_asc" | "price_desc" | "popular") => {
            setSortBy(value);
            onFilterChange?.();
          }}
        >
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
          onValueChange={(value) => {
            setCategory(value === "all" ? null : value);
            onFilterChange?.();
          }}
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
                id={condition.value}
                checked={conditions.includes(condition.value)}
                onCheckedChange={(checked) =>
                  handleConditionChange(condition.value, checked as boolean)
                }
              />
              <label
                htmlFor={condition.value}
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
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              setPriceRange(value, maxPrice);
              onFilterChange?.();
            }}
            min={0}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              setPriceRange(minPrice, value);
              onFilterChange?.();
            }}
            min={0}
          />
        </div>
      </div>

      {/* Filtreleri Temizle */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          <X className="mr-2 h-4 w-4" />
          Filtreleri Temizle
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filtreler
          </h3>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtreler
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                  Aktif
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filtreler</SheetTitle>
              <SheetDescription>
                İlanları filtrelemek için seçenekleri kullanın.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
