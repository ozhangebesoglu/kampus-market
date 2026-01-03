-- ============================================
-- KampüsMarket MVP - Storage Policies
-- ============================================
-- Dosya: 004_storage_policies.sql
-- Tarih: 2 Ocak 2026
-- Açıklama: Supabase Storage bucket ve policy'leri
-- ============================================

-- ============================================
-- NOT: Bu SQL Supabase Dashboard'dan çalıştırılmalı
-- veya Supabase CLI ile
-- ============================================

-- ============================================
-- 1. BUCKET'LAR OLUŞTUR
-- ============================================

-- Avatarlar için bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public erişim
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- İlan görselleri için bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings',
  'listings',
  true, -- Public erişim
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. AVATARS POLİTİKALARI
-- ============================================

-- Herkes avatarları görebilir
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Kullanıcılar kendi avatarlarını yükleyebilir
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Kullanıcılar kendi avatarlarını güncelleyebilir
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Kullanıcılar kendi avatarlarını silebilir
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 3. LISTINGS POLİTİKALARI
-- ============================================

-- Herkes ilan görsellerini görebilir
CREATE POLICY "Listing images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'listings');

-- Kullanıcılar ilan görseli yükleyebilir
CREATE POLICY "Users can upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listings'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Kullanıcılar kendi ilan görsellerini silebilir
CREATE POLICY "Users can delete their own listing images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listings'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- KLASÖR YAPISI
-- ============================================
--
-- avatars/
--   └── {user_id}/
--       └── avatar.jpg
--
-- listings/
--   └── {user_id}/
--       └── {listing_id}/
--           ├── 1.jpg
--           ├── 2.jpg
--           └── ...
--
-- ============================================
