-- ============================================
-- KampüsMarket MVP - Seed Data
-- ============================================
-- Dosya: seed.sql
-- Tarih: 2 Ocak 2026
-- Açıklama: Test verileri
-- ============================================

-- ============================================
-- 1. KATEGORİLER
-- ============================================
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
  ('Kitaplar', 'kitaplar', 'Ders kitapları, romanlar, akademik kaynaklar', 'book-open', 'blue', 1),
  ('Elektronik', 'elektronik', 'Laptop, tablet, telefon, aksesuar', 'laptop', 'purple', 2),
  ('Kırtasiye', 'kirtasiye', 'Defterler, kalemler, çizim malzemeleri', 'pencil', 'yellow', 3),
  ('Ev & Yaşam', 'ev-yasam', 'Mobilya, mutfak eşyaları, dekorasyon', 'home', 'green', 4),
  ('Giyim', 'giyim', 'Kıyafetler, ayakkabılar, aksesuarlar', 'shirt', 'pink', 5),
  ('Spor', 'spor', 'Spor ekipmanları, fitness malzemeleri', 'dumbbell', 'orange', 6),
  ('Müzik', 'muzik', 'Enstrümanlar, ses ekipmanları', 'music', 'indigo', 7),
  ('Hobi', 'hobi', 'Oyunlar, koleksiyonlar, el işi', 'puzzle', 'cyan', 8),
  ('Diğer', 'diger', 'Diğer kategorilere uymayan ürünler', 'package', 'gray', 99);

-- ============================================
-- 2. TEST KULLANICILARI
-- NOT: Bu kullanıcılar Supabase Auth ile oluşturulmalı
-- Aşağıdaki INSERT'ler sadece public.users tablosu içindir
-- Auth.users ile senkronize olmalı
-- ============================================

-- Admin kullanıcısı (UUID'yi gerçek auth.users id'si ile değiştirin)
INSERT INTO users (id, email, full_name, username, university_name, is_verified, is_admin) VALUES
   ('00000000-0000-0000-0000-000000000001', 'admin@test.edu.tr', 'Admin User', 'admin', 'Test Üniversitesi', true, true);

-- Test kullanıcıları
INSERT INTO users (id, email, full_name, username, university_name, is_verified) VALUES
   ('00000000-0000-0000-0000-000000000002', 'ozhan@itu.edu.tr', 'Özhan Test', 'ozhan', 'İstanbul Teknik Üniversitesi', true),
   ('00000000-0000-0000-0000-000000000003', 'eren@odtu.edu.tr', 'Eren Test', 'eren', 'Orta Doğu Teknik Üniversitesi', true),
   ('00000000-0000-0000-0000-000000000004', 'safi@boun.edu.tr', 'Safi Test', 'safi', 'Boğaziçi Üniversitesi', true),
   ('00000000-0000-0000-0000-000000000005', 'burak@ytu.edu.tr', 'Burak Test', 'burak', 'Yıldız Teknik Üniversitesi', true),
   ('00000000-0000-0000-0000-000000000006', 'seyit@marmara.edu.tr', 'Seyit Test', 'seyit', 'Marmara Üniversitesi', true);

-- ============================================
-- 3. TEST İLANLARI (Kullanıcılar oluştuktan sonra)
-- ============================================

-- Kitaplar kategorisi için örnek ilanlar
 INSERT INTO listings (seller_id, category_id, title, description, price, condition, status) VALUES
   (
     (SELECT id FROM users WHERE username = 'ozhan'),
     (SELECT id FROM categories WHERE slug = 'kitaplar'),
     'Calculus: Early Transcendentals',
     'James Stewart, 8. baskı. Çok az kullanıldı, içinde not yok. Üniversite matematiği için ideal.',
     150.00,
     'like_new',
     'active'
   );

-- ============================================
-- NOTLAR
-- ============================================
-- 
-- Gerçek test için:
-- 1. Supabase Dashboard'dan kullanıcı oluşturun
-- 2. UUID'leri alın ve yukarıdaki INSERT'leri güncelleyin
-- 3. Ya da uygulama üzerinden kayıt olun
--
-- Kategoriler hemen kullanılabilir, kullanıcı/ilan verileri
-- development ortamında manuel oluşturulmalı.
-- ============================================
