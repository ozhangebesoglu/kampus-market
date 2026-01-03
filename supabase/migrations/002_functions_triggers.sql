-- ============================================
-- KampüsMarket MVP - Functions & Triggers
-- ============================================
-- Dosya: 002_functions_triggers.sql
-- Tarih: 2 Ocak 2026
-- ============================================

-- ============================================
-- 1. UPDATED_AT TRİGGER FONKSİYONU
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users için trigger
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Listings için trigger
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Conversations için trigger
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. İLAN SAYISI GÜNCELLEME
-- ============================================
CREATE OR REPLACE FUNCTION update_user_listings_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET listings_count = listings_count + 1 
    WHERE id = NEW.seller_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users 
    SET listings_count = listings_count - 1 
    WHERE id = OLD.seller_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_listings_count
  AFTER INSERT OR DELETE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_listings_count();

-- ============================================
-- 3. GÖRÜNTÜLENME SAYISI ARTIRMA
-- ============================================
CREATE OR REPLACE FUNCTION increment_view_count(p_listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE listings 
  SET view_count = view_count + 1 
  WHERE id = p_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. FAVORİ SAYISI GÜNCELLEME
-- ============================================
CREATE OR REPLACE FUNCTION update_listing_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE listings 
    SET favorite_count = favorite_count + 1 
    WHERE id = NEW.listing_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE listings 
    SET favorite_count = favorite_count - 1 
    WHERE id = OLD.listing_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_favorite_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_favorite_count();

-- ============================================
-- 5. CONVERSATION SON MESAJ GÜNCELLEME
-- ============================================
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
DECLARE
  v_is_buyer BOOLEAN;
BEGIN
  -- Gönderen alıcı mı satıcı mı?
  SELECT buyer_id = NEW.sender_id INTO v_is_buyer
  FROM conversations WHERE id = NEW.conversation_id;
  
  -- Conversation'ı güncelle
  UPDATE conversations 
  SET 
    last_message_id = NEW.id,
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    -- Karşı tarafın okunmamış sayısını artır
    buyer_unread_count = CASE WHEN v_is_buyer THEN buyer_unread_count ELSE buyer_unread_count + 1 END,
    seller_unread_count = CASE WHEN v_is_buyer THEN seller_unread_count + 1 ELSE seller_unread_count END
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- 6. MESAJ OKUNDU İŞARETLEME
-- ============================================
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
DECLARE
  v_is_buyer BOOLEAN;
BEGIN
  -- Kullanıcı alıcı mı satıcı mı?
  SELECT buyer_id = p_user_id INTO v_is_buyer
  FROM conversations WHERE id = p_conversation_id;
  
  -- Mesajları okundu işaretle
  UPDATE messages
  SET 
    status = 'read',
    read_at = NOW()
  WHERE 
    conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND status != 'read';
  
  -- Okunmamış sayısını sıfırla
  UPDATE conversations
  SET
    buyer_unread_count = CASE WHEN v_is_buyer THEN 0 ELSE buyer_unread_count END,
    seller_unread_count = CASE WHEN v_is_buyer THEN seller_unread_count ELSE 0 END
  WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. İLAN ONAYLAMA
-- ============================================
CREATE OR REPLACE FUNCTION approve_listing(
  p_listing_id UUID,
  p_admin_id UUID
)
RETURNS listings AS $$
DECLARE
  v_listing listings;
BEGIN
  UPDATE listings
  SET 
    status = 'active',
    approved_by = p_admin_id,
    approved_at = NOW()
  WHERE 
    id = p_listing_id
    AND status = 'pending'
  RETURNING * INTO v_listing;
  
  -- Bildirim oluştur
  INSERT INTO notifications (user_id, type, title, body, related_listing_id, action_url)
  VALUES (
    v_listing.seller_id,
    'listing_approved',
    'İlanınız Onaylandı! 🎉',
    'İlanınız yayına alındı: ' || v_listing.title,
    v_listing.id,
    '/listings/' || v_listing.id
  );
  
  RETURN v_listing;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. İLAN REDDETME
-- ============================================
CREATE OR REPLACE FUNCTION reject_listing(
  p_listing_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS listings AS $$
DECLARE
  v_listing listings;
BEGIN
  UPDATE listings
  SET 
    status = 'rejected',
    rejection_reason = p_reason,
    approved_by = p_admin_id,
    approved_at = NOW()
  WHERE 
    id = p_listing_id
    AND status = 'pending'
  RETURNING * INTO v_listing;
  
  -- Bildirim oluştur
  INSERT INTO notifications (user_id, type, title, body, related_listing_id, action_url)
  VALUES (
    v_listing.seller_id,
    'listing_rejected',
    'İlanınız Reddedildi',
    'Sebep: ' || p_reason,
    v_listing.id,
    '/profile/listings'
  );
  
  RETURN v_listing;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. KULLANICI ARAMA
-- ============================================
CREATE OR REPLACE FUNCTION search_listings(
  p_query TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_min_price DECIMAL DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_condition item_condition DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  price DECIMAL,
  condition item_condition,
  status listing_status,
  view_count INTEGER,
  favorite_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  seller_id UUID,
  seller_name VARCHAR,
  seller_avatar TEXT,
  category_id UUID,
  category_name VARCHAR,
  category_slug VARCHAR,
  primary_image TEXT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered AS (
    SELECT 
      l.*,
      u.full_name as seller_name,
      u.avatar_url as seller_avatar,
      c.name as category_name,
      c.slug as category_slug,
      (SELECT url FROM listing_images li WHERE li.listing_id = l.id AND li.is_primary = TRUE LIMIT 1) as primary_image,
      COUNT(*) OVER() as total_count
    FROM listings l
    JOIN users u ON l.seller_id = u.id
    JOIN categories c ON l.category_id = c.id
    WHERE 
      l.status = 'active'
      AND (p_query IS NULL OR l.title ILIKE '%' || p_query || '%')
      AND (p_category_id IS NULL OR l.category_id = p_category_id)
      AND (p_min_price IS NULL OR l.price >= p_min_price)
      AND (p_max_price IS NULL OR l.price <= p_max_price)
      AND (p_condition IS NULL OR l.condition = p_condition)
    ORDER BY l.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  SELECT 
    f.id,
    f.title,
    f.price,
    f.condition,
    f.status,
    f.view_count,
    f.favorite_count,
    f.created_at,
    f.seller_id,
    f.seller_name,
    f.seller_avatar,
    f.category_id,
    f.category_name,
    f.category_slug,
    f.primary_image,
    f.total_count
  FROM filtered f;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. KULLANICI OLUŞTURMA (Auth trigger ile)
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_university VARCHAR(150);
BEGIN
  -- Email'den üniversite adını çıkar (basit)
  v_university := SPLIT_PART(NEW.email, '@', 2);
  v_university := REPLACE(v_university, '.edu.tr', '');
  v_university := INITCAP(REPLACE(v_university, '.', ' '));
  
  INSERT INTO public.users (id, email, full_name, university_name, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    v_university,
    NEW.email_confirmed_at IS NOT NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bu trigger Supabase Auth schema'sında oluşturulmalı
-- Supabase Dashboard > Database > Triggers > auth.users tablosunda
-- VEYA aşağıdaki gibi:

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION handle_new_user();
