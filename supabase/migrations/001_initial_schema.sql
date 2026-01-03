-- ============================================
-- KampüsMarket MVP - Veritabanı Şeması
-- ============================================
-- Dosya: 001_initial_schema.sql
-- Tarih: 2 Ocak 2026
-- Açıklama: Temel tablolar ve enum'lar
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Full-text search için

-- ============================================
-- 2. ENUM TYPES
-- ============================================

-- İlan durumu
CREATE TYPE listing_status AS ENUM (
  'draft',           -- Taslak
  'pending',         -- Onay bekliyor
  'active',          -- Aktif/Yayında
  'sold',            -- Satıldı
  'rejected',        -- Reddedildi
  'deleted'          -- Silindi
);

-- Ürün durumu (fiziksel)
CREATE TYPE item_condition AS ENUM (
  'new',             -- Sıfır
  'like_new',        -- Yeni gibi
  'good',            -- İyi
  'fair',            -- Orta
  'poor'             -- Kötü
);

-- Mesaj durumu
CREATE TYPE message_status AS ENUM (
  'sent',            -- Gönderildi
  'delivered',       -- İletildi
  'read'             -- Okundu
);

-- Bildirim tipi
CREATE TYPE notification_type AS ENUM (
  'message',         -- Yeni mesaj
  'listing_approved',-- İlan onaylandı
  'listing_rejected',-- İlan reddedildi
  'listing_sold',    -- İlan satıldı
  'system'           -- Sistem bildirimi
);

-- ============================================
-- 3. USERS TABLOSU
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Auth bilgileri (Supabase Auth ile sync)
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- Profil bilgileri
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  phone VARCHAR(20),
  bio VARCHAR(500),
  
  -- Üniversite bilgileri
  university_name VARCHAR(150),
  
  -- Durum
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  ban_until TIMESTAMP WITH TIME ZONE,
  
  -- İstatistikler
  listings_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  
  -- Zaman damgaları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_email_edu CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu\.tr$')
);

-- Users için index'ler
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_admin ON users(is_admin) WHERE is_admin = TRUE;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- 4. CATEGORIES TABLOSU
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  icon VARCHAR(50), -- Lucide icon adı
  color VARCHAR(20), -- Tailwind renk sınıfı
  sort_order INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- ============================================
-- 5. LISTINGS TABLOSU
-- ============================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- İlişkiler
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  
  -- Temel bilgiler
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  
  -- Ürün detayları
  condition item_condition NOT NULL DEFAULT 'good',
  
  -- Durum
  status listing_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT, -- Admin tarafından reddedildiyse
  
  -- İstatistikler
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  -- Admin
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Zaman damgaları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sold_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT chk_price_positive CHECK (price >= 0),
  CONSTRAINT chk_price_max CHECK (price <= 50000)
);

-- Listings için index'ler
CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_status_active ON listings(status) WHERE status = 'active';
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_title_trgm ON listings USING gin(title gin_trgm_ops);

-- ============================================
-- 6. LISTING_IMAGES TABLOSU
-- ============================================
CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,
  thumbnail_url TEXT, -- Küçük boyut için
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);
CREATE INDEX idx_listing_images_primary ON listing_images(listing_id, is_primary) WHERE is_primary = TRUE;

-- ============================================
-- 7. CONVERSATIONS TABLOSU
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Katılımcılar
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Son mesaj bilgisi (hız için denormalize)
  last_message_id UUID,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview VARCHAR(100),
  
  -- Okunmamış sayıları
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  
  -- Zaman damgaları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Bir ilan için alıcı-satıcı arasında tek konuşma
  CONSTRAINT unique_conversation UNIQUE (listing_id, buyer_id, seller_id),
  
  -- Kullanıcı kendine mesaj atamaz
  CONSTRAINT chk_different_users CHECK (buyer_id != seller_id)
);

CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_conversations_listing ON conversations(listing_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- ============================================
-- 8. MESSAGES TABLOSU
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  status message_status DEFAULT 'sent',
  
  -- Okunma bilgisi
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT chk_content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(conversation_id, created_at DESC);

-- ============================================
-- 9. NOTIFICATIONS TABLOSU
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type notification_type NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  
  -- İlişkili kayıt (opsiyonel)
  related_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_url VARCHAR(255),
  
  -- Durum
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- 10. FAVORITES TABLOSU (Opsiyonel MVP)
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_favorite UNIQUE (user_id, listing_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id);

-- ============================================
-- 11. REPORTS TABLOSU (Opsiyonel MVP)
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Raporlanan içerik (listing veya user)
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  reason VARCHAR(50) NOT NULL,
  description TEXT,
  
  -- Admin işlemi
  status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT chk_report_target CHECK (
    (listing_id IS NOT NULL AND reported_user_id IS NULL) OR
    (listing_id IS NULL AND reported_user_id IS NOT NULL)
  )
);

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_listing ON reports(listing_id);
CREATE INDEX idx_reports_status ON reports(status);
