"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { updateProfileSchema, type UpdateProfileFormData } from "@/lib/validations";
import type { User } from "@/types";

interface ProfileFormProps {
  user: User;
  onUpdate: (user: User) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const supabase = createClient();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user.full_name || "",
      username: user.username || "",
      phone: user.phone || "",
      bio: user.bio || "",
      university_name: user.university_name || "",
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      toast.error("Sadece resim dosyaları yüklenebilir");
      return;
    }

    // Boyut kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalı");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Eski avatar'ı sil (varsa)
      if (user.avatar_url) {
        const oldPath = user.avatar_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("avatars").remove([`${user.id}/${oldPath}`]);
        }
      }

      // Yeni avatar'ı yükle
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Public URL al
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Profili güncelle
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      onUpdate({ ...user, avatar_url: urlData.publicUrl });
      toast.success("Profil fotoğrafı güncellendi");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Fotoğraf yüklenirken bir hata oluştu");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);

    try {
      // Username benzersizlik kontrolü
      if (data.username && data.username !== user.username) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("username", data.username)
          .neq("id", user.id)
          .single();

        if (existingUser) {
          form.setError("username", { message: "Bu kullanıcı adı zaten kullanılıyor" });
          setIsLoading(false);
          return;
        }
      }

      // Profili güncelle
      const updateData = {
        full_name: data.full_name || user.full_name,
        username: data.username || null,
        phone: data.phone || null,
        bio: data.bio || null,
        university_name: data.university_name || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      onUpdate({ ...user, ...updateData });
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            {isUploadingAvatar ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploadingAvatar}
          />
        </div>
        <div>
          <h3 className="font-semibold">{user.full_name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.is_verified && (
            <span className="inline-flex items-center text-xs text-green-600 mt-1">
              ✓ Doğrulanmış hesap
            </span>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Ad Soyad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kullanıcı Adı</FormLabel>
                <FormControl>
                  <Input placeholder="kullanici_adi" {...field} />
                </FormControl>
                <FormDescription>
                  Benzersiz kullanıcı adınız (sadece küçük harf, rakam ve alt çizgi)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="05XX XXX XX XX" {...field} />
                </FormControl>
                <FormDescription>
                  Alıcılarla iletişim için (isteğe bağlı)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Üniversite</FormLabel>
                <FormControl>
                  <Input placeholder="Üniversite adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hakkımda</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Kendinizi kısaca tanıtın..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Maksimum 500 karakter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kaydet
          </Button>
        </form>
      </Form>
    </div>
  );
}
