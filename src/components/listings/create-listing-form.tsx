"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createListingSchema, CreateListingFormData } from "@/lib/validations";
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
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export function CreateListingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
  });

  const category = watch("category_id");
  const condition = watch("condition");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > LISTING_LIMITS.MAX_IMAGES) {
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

    setImages((prev) => [...prev, ...validFiles]);

    // Preview oluştur
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateListingFormData) => {
    if (images.length === 0) {
      toast.error("En az bir fotoğraf eklemelisiniz.");
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

      // Fotoğrafları yükle
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listings")
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      // İlanı oluştur
      const { data: listing, error } = await supabase
        .from("listings")
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          condition: data.condition,
          seller_id: user.id,
          status: "pending", // Admin onayı bekleyecek
        })
        .select()
        .single();

      if (error) throw error;

      // Fotoğrafları listing_images tablosuna ekle
      if (listing && imageUrls.length > 0) {
        const imageRecords = imageUrls.map((url, index) => ({
          listing_id: listing.id,
          url: url,
          sort_order: index,
          is_primary: index === 0,
        }));

        const { error: imageError } = await supabase
          .from("listing_images")
          .insert(imageRecords);

        if (imageError) {
          console.error("Image insert error:", imageError);
        }
      }

      toast.success("İlan başarıyla oluşturuldu! Onay için bekliyor.");
      router.push("/profile");
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
        <CardTitle>Yeni İlan Oluştur</CardTitle>
        <CardDescription>
          Satmak istediğiniz ürün hakkında bilgi verin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Fotoğraflar */}
          <div className="space-y-2">
            <Label>Fotoğraflar *</Label>
            <div className="grid grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {images.length < LISTING_LIMITS.MAX_IMAGES && (
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
                    disabled={isLoading}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              En fazla {LISTING_LIMITS.MAX_IMAGES} fotoğraf, her biri max 5MB
            </p>
          </div>

          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              placeholder="Örn: iPhone 13 Pro Max 256GB"
              {...register("title")}
              disabled={isLoading}
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
              placeholder="Ürün hakkında detaylı bilgi verin..."
              rows={4}
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Fiyat */}
          <div className="space-y-2">
            <Label htmlFor="price">Fiyat (₺) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              {...register("price", { valueAsNumber: true })}
              disabled={isLoading}
              min={0}
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
              disabled={isLoading || categories.length === 0}
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
              onValueChange={(value) => setValue("condition", value as "new" | "like_new" | "good" | "fair" | "poor")}
              disabled={isLoading}
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Upload className="mr-2 h-4 w-4" />
            İlanı Yayınla
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
