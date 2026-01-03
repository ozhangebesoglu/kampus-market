import { ItemCondition } from "@/types";

// ============================================
// Kategori Sabitleri
// ============================================

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    name: "Elektronik",
    slug: "elektronik",
    icon: "📱",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Kitap & Kırtasiye",
    slug: "kitap-kirtasiye",
    icon: "📚",
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "Ev & Yaşam",
    slug: "ev-yasam",
    icon: "🏠",
    color: "#22c55e",
  },
  {
    id: "4",
    name: "Giyim & Aksesuar",
    slug: "giyim-aksesuar",
    icon: "👕",
    color: "#ec4899",
  },
  {
    id: "5",
    name: "Spor & Hobi",
    slug: "spor-hobi",
    icon: "🏋️",
    color: "#f97316",
  },
  {
    id: "6",
    name: "Müzik & Sanat",
    slug: "muzik-sanat",
    icon: "🎵",
    color: "#a855f7",
  },
  {
    id: "7",
    name: "Oyun & Konsol",
    slug: "oyun-konsol",
    icon: "🎮",
    color: "#ef4444",
  },
  {
    id: "8",
    name: "Diğer",
    slug: "diger",
    icon: "📦",
    color: "#6b7280",
  },
];

// ============================================
// Ürün Durumu Sabitleri
// ============================================

export interface ConditionItem {
  value: ItemCondition;
  label: string;
  description: string;
}

export const CONDITIONS: ConditionItem[] = [
  {
    value: "new",
    label: "Sıfır",
    description: "Hiç kullanılmamış, kutusunda",
  },
  {
    value: "like_new",
    label: "Yeni Gibi",
    description: "Çok az kullanılmış, kusursuz",
  },
  {
    value: "good",
    label: "İyi",
    description: "Normal kullanım izleri var",
  },
  {
    value: "fair",
    label: "Orta",
    description: "Belirgin kullanım izleri var",
  },
  {
    value: "poor",
    label: "Kötü",
    description: "Yoğun kullanılmış, hasarlı olabilir",
  },
];

// ============================================
// İlan Durumu Sabitleri
// ============================================

export const LISTING_STATUS_LABELS = {
  draft: "Taslak",
  pending: "Onay Bekliyor",
  active: "Aktif",
  sold: "Satıldı",
  rejected: "Reddedildi",
  deleted: "Silindi",
} as const;

export const LISTING_STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  sold: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  deleted: "bg-gray-100 text-gray-800",
} as const;

// ============================================
// Sıralama Seçenekleri
// ============================================

export const SORT_OPTIONS = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "price_asc", label: "Fiyat (Düşük → Yüksek)" },
  { value: "price_desc", label: "Fiyat (Yüksek → Düşük)" },
  { value: "popular", label: "En Popüler" },
] as const;

// ============================================
// Form Limitleri
// ============================================

export const LISTING_LIMITS = {
  title: { min: 5, max: 100 },
  description: { min: 20, max: 2000 },
  price: { min: 1, max: 50000 },
  images: { min: 1, max: 5, maxSizeBytes: 5 * 1024 * 1024 }, // 5MB
  MAX_IMAGES: 5,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const USER_LIMITS = {
  fullName: { min: 2, max: 100 },
  username: { min: 3, max: 50 },
  bio: { max: 500 },
  phone: { max: 20 },
} as const;

// ============================================
// Sayfalama
// ============================================

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// ============================================
// Rapor Sebepleri
// ============================================

export const REPORT_REASONS = [
  { value: "spam", label: "Spam / Reklam" },
  { value: "inappropriate", label: "Uygunsuz İçerik" },
  { value: "fraud", label: "Dolandırıcılık" },
  { value: "wrong_category", label: "Yanlış Kategori" },
  { value: "duplicate", label: "Tekrarlanan İlan" },
  { value: "other", label: "Diğer" },
] as const;

// ============================================
// Uygulama Sabitleri
// ============================================

export const APP_NAME = "KampüsMarket";
export const APP_DESCRIPTION =
  "Üniversite öğrencileri için güvenli ikinci el alışveriş platformu";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================
// Dosya Türleri
// ============================================

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ACCEPTED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png,.webp";
