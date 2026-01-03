// ============================================
// Veritabanı Enum Tipleri
// ============================================

export type ListingStatus =
  | "draft"
  | "pending"
  | "active"
  | "sold"
  | "rejected"
  | "deleted";

export type ItemCondition = "new" | "like_new" | "good" | "fair" | "poor";

export type MessageStatus = "sent" | "delivered" | "read";

export type NotificationType =
  | "message"
  | "listing_approved"
  | "listing_rejected"
  | "listing_sold"
  | "system";

export type ReportReason =
  | "spam"
  | "inappropriate"
  | "fraud"
  | "wrong_category"
  | "duplicate"
  | "other";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

// ============================================
// Veritabanı Tablo Tipleri
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  university_name: string | null;
  is_verified: boolean;
  is_admin: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  ban_until: string | null;
  listings_count: number;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  condition: ItemCondition;
  status: ListingStatus;
  rejection_reason: string | null;
  view_count: number;
  favorite_count: number;
  message_count: number;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  sold_at: string | null;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_id: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  buyer_unread_count: number;
  seller_unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  status: MessageStatus;
  read_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  related_listing_id: string | null;
  related_user_id: string | null;
  action_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  listing_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// ============================================
// İlişkili Tipler (Joins)
// ============================================

export interface ListingWithDetails extends Listing {
  seller: User;
  category: Category;
  images: ListingImage[];
}

export interface ConversationWithDetails extends Conversation {
  listing: Listing;
  buyer: User;
  seller: User;
  messages?: Message[];
}

export interface MessageWithSender extends Message {
  sender: User;
}

// ============================================
// Form / API Tipleri
// ============================================

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category_id: string;
  condition: ItemCondition;
  images: File[];
}

export interface UpdateListingData extends Partial<CreateListingData> {
  id: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface UpdateProfileData {
  full_name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  university_name?: string;
}

// ============================================
// API Response Tipleri
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Filter / Query Tipleri
// ============================================

export interface ListingFilters {
  category?: string;
  condition?: ItemCondition[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
