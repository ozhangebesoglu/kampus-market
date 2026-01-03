-- ============================================
-- KampüsMarket MVP - Row Level Security
-- ============================================
-- Dosya: 003_rls_policies.sql
-- Tarih: 2 Ocak 2026
-- ============================================

-- ============================================
-- RLS'i Aktif Et
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLİTİKALARI
-- ============================================

-- Herkes public profilleri görebilir
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Kullanıcılar kendi profillerini silemez (admin gerekir)
-- DELETE politikası yok

-- ============================================
-- CATEGORIES POLİTİKALARI
-- ============================================

-- Herkes kategorileri görebilir
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

-- Sadece admin ekleyebilir/güncelleyebilir
CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- LISTINGS POLİTİKALARI
-- ============================================

-- Herkes aktif ilanları görebilir
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  USING (
    status = 'active'
    OR seller_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Giriş yapmış kullanıcılar ilan oluşturabilir
CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND seller_id = auth.uid()
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_banned = false)
  );

-- Kullanıcılar kendi ilanlarını güncelleyebilir
CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (
    seller_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    seller_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Soft delete için update kullanılacak
CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  USING (
    seller_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- LISTING_IMAGES POLİTİKALARI
-- ============================================

-- Herkes görselleri görebilir (ilan görüntülenebiliyorsa)
CREATE POLICY "Images are viewable if listing is viewable"
  ON listing_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_id 
      AND (
        l.status = 'active' 
        OR l.seller_id = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
      )
    )
  );

-- İlan sahibi görsel ekleyebilir
CREATE POLICY "Listing owners can insert images"
  ON listing_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_id 
      AND l.seller_id = auth.uid()
    )
  );

-- İlan sahibi görsel silebilir
CREATE POLICY "Listing owners can delete images"
  ON listing_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_id 
      AND l.seller_id = auth.uid()
    )
  );

-- ============================================
-- CONVERSATIONS POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi konuşmalarını görebilir
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Kullanıcılar konuşma başlatabilir
CREATE POLICY "Users can start conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND buyer_id = auth.uid()
    AND buyer_id != seller_id
  );

-- Konuşma güncellemesi (okundu işaretleme vb.)
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- ============================================
-- MESSAGES POLİTİKALARI
-- ============================================

-- Kullanıcılar konuşmalarındaki mesajları görebilir
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = conversation_id 
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Kullanıcılar konuşmalarına mesaj gönderebilir
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = conversation_id 
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- Mesajlar güncellenebilir (okundu işareti için)
CREATE POLICY "Users can update message status"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = conversation_id 
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- ============================================
-- NOTIFICATIONS POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Sistem bildirim ekleyebilir (service role)
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true); -- Service role ile kullanılacak

-- Kullanıcılar bildirimlerini güncelleyebilir (okundu işareti)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Kullanıcılar bildirimlerini silebilir
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- FAVORITES POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi favorilerini görebilir
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (user_id = auth.uid());

-- Kullanıcılar favori ekleyebilir
CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Kullanıcılar favori silebilir
CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- REPORTS POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi raporlarını görebilir
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (
    reporter_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Kullanıcılar rapor oluşturabilir
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- Sadece admin raporları güncelleyebilir
CREATE POLICY "Only admins can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );
