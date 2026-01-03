"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, X, ImageIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { createListingSchema, type CreateListingFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONDITIONS, LISTING_LIMITS } from "@/constants";
import type { ListingWithDetails } from "@/types";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface EditListingFormProps {
  listing: ListingWithDetails;
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();
  
  // Kategorileri veritabanından çek
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, icon")
        .eq("is_active", true)
        .order("sort_order");
      
      if (!error && data) {
        setCategories(data);
      }
    }
    fetchCategories();
  }, [supabase]);
  
  // Mevcut fotoğraflar (URL olarak)
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>(
    listing.images?.map((img) => ({ id: img.id, url: img.url })) || []
  );
  // Yeni eklenen fotoğraflar
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  // Silinecek fotoğraf ID'leri
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category_id: listing.category_id,
      condition: listing.condition,
    },
  });

  const category = watch("category_id");
  const condition = watch("condition");

  // Select değerlerini manuel set et
  useEffect(() => {
    setValue("category_id", listing.category_id);
    setValue("condition", listing.condition);
  }, [listing, setValue]);

  const totalImageCount = existingImages.length - deletedImageIds.length + newImages.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (totalImageCount + files.length > LISTING_LIMITS.MAX_IMAGES) {
      toast.error(`En fazla ${LISTING_LIMITS.MAX_IMAGES} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > LISTING_LIMITS.MAX_IMAGE_SIZE) {
        toast.error(`${file.name} dosyası 5MB'den büyük.`);
        return false;
      }
      return true;
    });

    setNewImages((prev) => [...prev, ...validFiles]);

    // Preview oluştur
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (imageId: string) => {
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateListingFormData) => {
    const remainingExisting = existingImages.filter(
      (img) => !deletedImageIds.includes(img.id)
    );

    if (remainingExisting.length + newImages.length === 0) {
      toast.error("En az bir fotoğraf olmalıdır.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();

      // Kullanıcı kontrolü
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Oturum açmanız gerekiyor.");
        router.push("/login");
        return;
      }

      // Yetki kontrolü
      if (listing.seller_id !== user.id) {
        toast.error("Bu ilanı düzenleme yetkiniz yok.");
        return;
      }

      // Silinen fotoğrafları kaldır
      if (deletedImageIds.length > 0) {
        // Storage'dan sil
        for (const imageId of deletedImageIds) {
          const image = existingImages.find((img) => img.id === imageId);
          if (image) {
            const path = image.url.split("/").slice(-2).join("/");
            await supabase.storage.from("listings").remove([path]);
          }
        }

        // DB'den sil
        await supabase
          .from("listing_images")
          .delete()
          .in("id", deletedImageIds);
      }

      // Yeni fotoğrafları yükle
      const newImageUrls: string[] = [];
      for (const image of newImages) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listings")
          .getPublicUrl(fileName);

        newImageUrls.push(urlData.publicUrl);
      }

      // Yeni fotoğrafları DB'ye ekle
      if (newImageUrls.length > 0) {
        const hasPrimary = remainingExisting.length > 0;
        const imageRecords = newImageUrls.map((url, index) => ({
          listing_id: listing.id,
          url: url,
          sort_order: remainingExisting.length + index,
          is_primary: !hasPrimary && index === 0,
        }));

        await supabase.from("listing_images").insert(imageRecords);
      }

      // İlanı güncelle
      const { error } = await supabase
        .from("listings")
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          condition: data.condition,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("İlan başarıyla güncellendi!");
      router.push(`/listings/${listing.id}`);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Bir hata oluştu.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/listings/${listing.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <CardTitle>İlanı Düzenle</CardTitle>
            <CardDescription>
              İlan bilgilerini güncelleyin.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Fotoğraflar */}
          <div className="space-y-2">
            <Label>Fotoğraflar *</Label>
            <div className="grid grid-cols-4 gap-4">
              {/* Mevcut fotoğraflar */}
              {existingImages
                .filter((img) => !deletedImageIds.includes(img.id))
                .map((image) => (
                  <div key={image.id} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt="Listing image"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

              {/* Yeni eklenen fotoğraflar */}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative aspect-square">
                  <Image
                    src={preview}
                    alt={`New image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Yeni fotoğraf ekleme butonu */}
              {totalImageCount < LISTING_LIMITS.MAX_IMAGES && (
                <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    Fotoğraf Ekle
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalImageCount}/{LISTING_LIMITS.MAX_IMAGES} fotoğraf • Max 5MB/dosya
            </p>
          </div>

          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              placeholder="Ürün başlığı"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              placeholder="Ürün hakkında detaylı bilgi..."
              rows={5}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Fiyat */}
          <div className="space-y-2">
            <Label htmlFor="price">Fiyat (TL) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              min={0}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label>Kategori *</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category_id", value)}
              disabled={categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Durum */}
          <div className="space-y-2">
            <Label>Ürün Durumu *</Label>
            <Select
              value={condition}
              onValueChange={(value: "new" | "like_new" | "good" | "fair" | "poor") =>
                setValue("condition", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((cond) => (
                  <SelectItem key={cond.value} value={cond.value}>
                    {cond.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-sm text-destructive">
                {errors.condition.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Güncelle
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
