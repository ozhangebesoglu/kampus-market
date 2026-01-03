import { createClient } from "@/lib/supabase/client";
import { User, UpdateProfileData } from "@/types";

const supabase = createClient();

// ============================================
// Profil Getir
// ============================================

export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as User;
}

// ============================================
// Profil Güncelle
// ============================================

export async function updateProfile(
  userId: string,
  data: UpdateProfileData
): Promise<User> {
  const { data: profile, error } = await supabase
    .from("users")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return profile as User;
}

// ============================================
// Avatar Yükle
// ============================================

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  // Eski avatarı sil
  await supabase.storage.from("avatars").remove([fileName]);

  // Yeni avatarı yükle
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Profili güncelle
  await updateProfile(userId, { avatar_url: publicUrl } as any);

  return publicUrl;
}

// ============================================
// Kullanıcı Adı Kontrolü
// ============================================

export async function checkUsernameAvailable(
  username: string,
  currentUserId?: string
): Promise<boolean> {
  let query = supabase
    .from("users")
    .select("id")
    .eq("username", username.toLowerCase());

  if (currentUserId) {
    query = query.neq("id", currentUserId);
  }

  const { data } = await query;

  return !data || data.length === 0;
}

// ============================================
// Public Profil
// ============================================

export async function getPublicProfile(
  username: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, username, avatar_url, bio, university_name, listings_count, rating_avg, rating_count, created_at")
    .eq("username", username.toLowerCase())
    .eq("is_banned", false)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as User;
}
