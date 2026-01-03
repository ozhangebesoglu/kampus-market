# 📁 KampüsMarket - Proje Klasör Yapısı

> Detaylı klasör ve dosya organizasyonu.
> 
> Son Güncelleme: 2 Ocak 2026

---

## 1. Genel Bakış

```
kampus-market/
│
├── 📁 src/                    # Kaynak kodlar
├── 📁 public/                 # Statik dosyalar
├── 📁 supabase/               # Veritabanı migration'ları
├── 📁 docs/                   # Dokümantasyon (opsiyonel)
│
├── 📄 .env.local              # Environment variables
├── 📄 .env.example            # Örnek env dosyası
├── 📄 .gitignore              # Git ignore
├── 📄 .eslintrc.json          # ESLint config
├── 📄 .prettierrc             # Prettier config
├── 📄 next.config.js          # Next.js config
├── 📄 tailwind.config.ts      # Tailwind config
├── 📄 tsconfig.json           # TypeScript config
├── 📄 package.json            # Dependencies
└── 📄 README.md               # Proje README
```

---

## 2. src/ Klasörü (Ana Kaynak)

```
src/
│
├── 📁 app/                    # Next.js App Router
├── 📁 components/             # React bileşenleri
├── 📁 lib/                    # Utilities & Services
├── 📁 hooks/                  # Custom React hooks
├── 📁 stores/                 # Zustand state stores
├── 📁 types/                  # TypeScript tip tanımları
└── 📁 constants/              # Sabitler
```

---

## 3. app/ Klasörü (Next.js App Router)

```
src/app/
│
├── 📄 layout.tsx              # Root layout (providers, fonts)
├── 📄 page.tsx                # Ana sayfa
├── 📄 globals.css             # Global stiller
├── 📄 loading.tsx             # Global loading UI
├── 📄 error.tsx               # Global error UI
├── 📄 not-found.tsx           # 404 sayfası
│
├── 📁 (auth)/                 # Auth route group (layout paylaşımı)
│   ├── 📄 layout.tsx          # Auth layout (centered, minimal)
│   ├── 📁 login/
│   │   └── 📄 page.tsx        # /login
│   ├── 📁 register/
│   │   └── 📄 page.tsx        # /register
│   ├── 📁 forgot-password/
│   │   └── 📄 page.tsx        # /forgot-password
│   └── 📁 verify/
│       └── 📄 page.tsx        # /verify (email doğrulama)
│
├── 📁 (main)/                 # Ana uygulama route group
│   ├── 📄 layout.tsx          # Main layout (header, footer, sidebar)
│   │
│   ├── 📁 listings/           # İlan sayfaları
│   │   ├── 📄 page.tsx        # /listings (liste)
│   │   ├── 📄 loading.tsx     # Skeleton loader
│   │   ├── 📁 [id]/
│   │   │   ├── 📄 page.tsx    # /listings/[id] (detay)
│   │   │   └── 📄 loading.tsx
│   │   ├── 📁 create/
│   │   │   └── 📄 page.tsx    # /listings/create
│   │   └── 📁 edit/
│   │       └── 📁 [id]/
│   │           └── 📄 page.tsx # /listings/edit/[id]
│   │
│   ├── 📁 categories/         # Kategori sayfaları
│   │   ├── 📄 page.tsx        # /categories (tüm kategoriler)
│   │   └── 📁 [slug]/
│   │       └── 📄 page.tsx    # /categories/[slug]
│   │
│   ├── 📁 search/             # Arama
│   │   └── 📄 page.tsx        # /search?q=...
│   │
│   ├── 📁 messages/           # Mesajlaşma
│   │   ├── 📄 page.tsx        # /messages (konuşma listesi)
│   │   └── 📁 [conversationId]/
│   │       └── 📄 page.tsx    # /messages/[conversationId]
│   │
│   ├── 📁 profile/            # Profil
│   │   ├── 📄 page.tsx        # /profile (kendi profil)
│   │   ├── 📁 settings/
│   │   │   └── 📄 page.tsx    # /profile/settings
│   │   ├── 📁 listings/
│   │   │   └── 📄 page.tsx    # /profile/listings (kendi ilanları)
│   │   ├── 📁 favorites/
│   │   │   └── 📄 page.tsx    # /profile/favorites
│   │   ├── 📁 orders/
│   │   │   ├── 📄 page.tsx    # /profile/orders (satın alımlar)
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx # /profile/orders/[id]
│   │   └── 📁 sales/
│   │       ├── 📄 page.tsx    # /profile/sales (satışlar)
│   │       └── 📁 [id]/
│   │           └── 📄 page.tsx # /profile/sales/[id]
│   │
│   └── 📁 u/                  # Kullanıcı profilleri (public)
│       └── 📁 [username]/
│           └── 📄 page.tsx    # /u/[username]
│
├── 📁 admin/                  # Admin panel
│   ├── 📄 layout.tsx          # Admin layout
│   ├── 📄 page.tsx            # /admin (dashboard)
│   ├── 📁 listings/
│   │   ├── 📄 page.tsx        # /admin/listings (ilan yönetimi)
│   │   └── 📁 [id]/
│   │       └── 📄 page.tsx    # /admin/listings/[id]
│   ├── 📁 users/
│   │   ├── 📄 page.tsx        # /admin/users
│   │   └── 📁 [id]/
│   │       └── 📄 page.tsx    # /admin/users/[id]
│   ├── 📁 reports/
│   │   └── 📄 page.tsx        # /admin/reports
│   ├── 📁 universities/
│   │   └── 📄 page.tsx        # /admin/universities
│   └── 📁 settings/
│       └── 📄 page.tsx        # /admin/settings
│
└── 📁 api/                    # API Routes
    ├── 📁 auth/
    │   ├── 📁 callback/
    │   │   └── 📄 route.ts    # OAuth callback
    │   └── 📁 confirm/
    │       └── 📄 route.ts    # Email confirmation
    │
    ├── 📁 listings/
    │   ├── 📄 route.ts        # GET /api/listings, POST /api/listings
    │   └── 📁 [id]/
    │       └── 📄 route.ts    # GET, PUT, DELETE /api/listings/[id]
    │
    ├── 📁 upload/
    │   └── 📄 route.ts        # POST /api/upload (image upload)
    │
    ├── 📁 payments/
    │   ├── 📁 initiate/
    │   │   └── 📄 route.ts    # POST /api/payments/initiate
    │   └── 📁 confirm/
    │       └── 📄 route.ts    # POST /api/payments/confirm
    │
    └── 📁 webhooks/
        ├── 📁 iyzico/
        │   └── 📄 route.ts    # Iyzico webhook
        └── 📁 supabase/
            └── 📄 route.ts    # Supabase webhook (optional)
```

---

## 4. components/ Klasörü

```
src/components/
│
├── 📁 ui/                     # shadcn/ui bileşenleri (auto-generated)
│   ├── 📄 button.tsx
│   ├── 📄 input.tsx
│   ├── 📄 card.tsx
│   ├── 📄 dialog.tsx
│   ├── 📄 form.tsx
│   ├── 📄 label.tsx
│   ├── 📄 select.tsx
│   ├── 📄 textarea.tsx
│   ├── 📄 avatar.tsx
│   ├── 📄 badge.tsx
│   ├── 📄 skeleton.tsx
│   ├── 📄 tabs.tsx
│   ├── 📄 dropdown-menu.tsx
│   ├── 📄 sheet.tsx
│   ├── 📄 table.tsx
│   ├── 📄 separator.tsx
│   ├── 📄 tooltip.tsx
│   └── 📄 ... (shadcn bileşenleri)
│
├── 📁 layout/                 # Layout bileşenleri
│   ├── 📄 header.tsx          # Ana header
│   ├── 📄 footer.tsx          # Footer
│   ├── 📄 sidebar.tsx         # Mobile sidebar
│   ├── 📄 mobile-nav.tsx      # Mobile navigation
│   ├── 📄 admin-header.tsx    # Admin header
│   ├── 📄 admin-sidebar.tsx   # Admin sidebar
│   └── 📄 breadcrumbs.tsx     # Breadcrumb navigation
│
├── 📁 auth/                   # Auth bileşenleri
│   ├── 📄 login-form.tsx      # Login formu
│   ├── 📄 register-form.tsx   # Kayıt formu
│   ├── 📄 forgot-password-form.tsx
│   ├── 📄 auth-guard.tsx      # Protected routes
│   ├── 📄 admin-guard.tsx     # Admin only routes
│   └── 📄 user-button.tsx     # User avatar dropdown
│
├── 📁 listings/               # İlan bileşenleri
│   ├── 📄 listing-card.tsx    # İlan kartı
│   ├── 📄 listing-grid.tsx    # İlan grid layout
│   ├── 📄 listing-form.tsx    # İlan oluştur/düzenle formu
│   ├── 📄 listing-gallery.tsx # Fotoğraf galerisi
│   ├── 📄 listing-info.tsx    # İlan detay bilgileri
│   ├── 📄 listing-actions.tsx # Favori, paylaş, şikayet
│   ├── 📄 listing-filters.tsx # Filtreleme UI
│   ├── 📄 listing-sort.tsx    # Sıralama dropdown
│   ├── 📄 listing-skeleton.tsx # Loading skeleton
│   └── 📄 category-badge.tsx  # Kategori etiketi
│
├── 📁 messages/               # Mesaj bileşenleri
│   ├── 📄 conversation-list.tsx  # Konuşma listesi
│   ├── 📄 conversation-item.tsx  # Tek konuşma satırı
│   ├── 📄 message-list.tsx       # Mesaj listesi
│   ├── 📄 message-bubble.tsx     # Tek mesaj balonu
│   ├── 📄 message-input.tsx      # Mesaj yazma alanı
│   └── 📄 message-header.tsx     # Mesaj header
│
├── 📁 orders/                 # Sipariş/Teslimat bileşenleri
│   ├── 📄 order-card.tsx
│   ├── 📄 order-status.tsx    # Status badge/timeline
│   ├── 📄 order-timeline.tsx  # Sipariş adımları
│   ├── 📄 delivery-info.tsx   # Teslimat bilgileri
│   ├── 📄 shipping-form.tsx   # Kargo bilgileri formu
│   └── 📄 confirmation-modal.tsx # Teslimat onay modal
│
├── 📁 profile/                # Profil bileşenleri
│   ├── 📄 profile-header.tsx  # Profil banner/info
│   ├── 📄 profile-stats.tsx   # İstatistikler
│   ├── 📄 profile-form.tsx    # Profil düzenleme
│   ├── 📄 avatar-upload.tsx   # Avatar yükleme
│   └── 📄 seller-card.tsx     # Satıcı mini kart
│
├── 📁 notifications/          # Bildirim bileşenleri
│   ├── 📄 notification-bell.tsx    # Bildirim ikonu + badge
│   ├── 📄 notification-list.tsx    # Bildirim dropdown listesi
│   └── 📄 notification-item.tsx    # Tek bildirim
│
├── 📁 admin/                  # Admin panel bileşenleri
│   ├── 📄 stats-card.tsx      # Dashboard stat kartları
│   ├── 📄 data-table.tsx      # Genel tablo bileşeni
│   ├── 📄 listing-review.tsx  # İlan onay/red
│   ├── 📄 user-management.tsx # Kullanıcı yönetimi
│   └── 📄 report-view.tsx     # Şikayet görüntüleme
│
└── 📁 shared/                 # Paylaşılan bileşenler
    ├── 📄 logo.tsx            # Marka logosu
    ├── 📄 empty-state.tsx     # Boş durum gösterimi
    ├── 📄 error-state.tsx     # Hata durumu gösterimi
    ├── 📄 loading-spinner.tsx # Yükleme spinner
    ├── 📄 image-upload.tsx    # Görsel yükleme
    ├── 📄 image-gallery.tsx   # Lightbox galeri
    ├── 📄 search-input.tsx    # Arama input
    ├── 📄 price-input.tsx     # Para formatı input
    ├── 📄 confirm-dialog.tsx  # Onay dialog
    ├── 📄 pagination.tsx      # Sayfalama
    └── 📄 infinite-scroll.tsx # Sonsuz scroll
```

---

## 5. lib/ Klasörü (Utilities & Services)

```
src/lib/
│
├── 📁 supabase/               # Supabase client & helpers
│   ├── 📄 client.ts           # Browser client
│   ├── 📄 server.ts           # Server client (cookies)
│   ├── 📄 admin.ts            # Admin client (service role)
│   ├── 📄 middleware.ts       # Auth middleware helper
│   └── 📄 types.ts            # Database types (generated)
│
├── 📁 services/               # Business logic services
│   ├── 📄 auth.service.ts     # Auth işlemleri
│   ├── 📄 listing.service.ts  # İlan işlemleri
│   ├── 📄 message.service.ts  # Mesaj işlemleri
│   ├── 📄 payment.service.ts  # Ödeme işlemleri
│   ├── 📄 notification.service.ts # Bildirim işlemleri
│   ├── 📄 upload.service.ts   # Dosya yükleme
│   ├── 📄 shipping.service.ts # Kargo/teslimat
│   └── 📄 admin.service.ts    # Admin işlemleri
│
├── 📁 repositories/           # Data access layer
│   ├── 📄 user.repository.ts
│   ├── 📄 listing.repository.ts
│   ├── 📄 message.repository.ts
│   ├── 📄 transaction.repository.ts
│   └── 📄 notification.repository.ts
│
├── 📁 validations/            # Zod schemas
│   ├── 📄 auth.schema.ts      # Login, register schemas
│   ├── 📄 listing.schema.ts   # İlan form schemas
│   ├── 📄 profile.schema.ts   # Profil form schemas
│   ├── 📄 payment.schema.ts   # Ödeme schemas
│   └── 📄 message.schema.ts   # Mesaj schemas
│
├── 📁 adapters/               # External service adapters
│   ├── 📄 iyzico.adapter.ts   # Iyzico payment adapter
│   └── 📄 cargo.adapter.ts    # Kargo API adapter
│
├── 📁 factories/              # Object factories
│   └── 📄 notification.factory.ts
│
├── 📁 strategies/             # Strategy implementations
│   ├── 📄 pricing.strategy.ts
│   └── 📄 delivery.strategy.ts
│
└── 📄 utils.ts                # Genel utility fonksiyonlar
                                # - cn() (tailwind merge)
                                # - formatPrice()
                                # - formatDate()
                                # - slugify()
                                # - truncate()
```

---

## 6. hooks/ Klasörü (Custom Hooks)

```
src/hooks/
│
├── 📄 use-auth.ts             # Auth state & actions
├── 📄 use-user.ts             # Current user data
├── 📄 use-listings.ts         # Listings CRUD
├── 📄 use-listing.ts          # Single listing
├── 📄 use-create-listing.ts   # Create listing mutation
├── 📄 use-update-listing.ts   # Update listing mutation
├── 📄 use-messages.ts         # Messages with realtime
├── 📄 use-conversations.ts    # Conversation list
├── 📄 use-notifications.ts    # Notifications with realtime
├── 📄 use-favorites.ts        # Favorites CRUD
├── 📄 use-search.ts           # Search with debounce
├── 📄 use-infinite-scroll.ts  # Infinite scroll logic
├── 📄 use-media-query.ts      # Responsive breakpoints
├── 📄 use-local-storage.ts    # LocalStorage wrapper
├── 📄 use-debounce.ts         # Debounce value
├── 📄 use-upload.ts           # File upload with progress
└── 📄 use-realtime.ts         # Generic realtime subscription
```

---

## 7. stores/ Klasörü (Zustand Stores)

```
src/stores/
│
├── 📄 auth-store.ts           # Auth state (user, session)
├── 📄 cart-store.ts           # Sepet state (ileride)
├── 📄 filter-store.ts         # Listing filters state
├── 📄 notification-store.ts   # Unread count, list
├── 📄 ui-store.ts             # UI state (sidebar, modals)
└── 📄 chat-store.ts           # Active chat state
```

---

## 8. types/ Klasörü (TypeScript Types)

```
src/types/
│
├── 📄 database.ts             # Supabase generated types
│                              # npx supabase gen types typescript
│
├── 📄 api.ts                  # API response types
│   └── interface ApiResponse<T>
│   └── interface PaginatedResponse<T>
│   └── interface ErrorResponse
│
├── 📄 auth.ts                 # Auth types
│   └── type User
│   └── type Session
│   └── type AuthState
│
├── 📄 listing.ts              # Listing types
│   └── type Listing
│   └── type ListingStatus
│   └── type CreateListingDTO
│   └── type UpdateListingDTO
│   └── type ListingFilters
│
├── 📄 message.ts              # Message types
│   └── type Conversation
│   └── type Message
│   └── type SendMessageDTO
│
├── 📄 transaction.ts          # Transaction/Order types
│   └── type Transaction
│   └── type TransactionStatus
│   └── type Shipment
│   └── type DeliveryType
│
├── 📄 notification.ts         # Notification types
│   └── type Notification
│   └── type NotificationType
│
└── 📄 index.ts                # Re-exports
```

---

## 9. constants/ Klasörü

```
src/constants/
│
├── 📄 categories.ts           # Kategori listesi
│   └── export const CATEGORIES = [...]
│   └── export const CATEGORY_MAP = {...}
│
├── 📄 conditions.ts           # Ürün durumları
│   └── export const CONDITIONS = [
│       { value: 'new', label: 'Sıfır' },
│       { value: 'like_new', label: 'Yeni Gibi' },
│       ...
│     ]
│
├── 📄 routes.ts               # Route sabitleri
│   └── export const ROUTES = {
│       HOME: '/',
│       LISTINGS: '/listings',
│       ...
│     }
│
├── 📄 config.ts               # Uygulama config
│   └── export const APP_CONFIG = {
│       name: 'KampüsMarket',
│       maxImages: 5,
│       maxPriceLimit: 50000,
│       ...
│     }
│
├── 📄 messages.ts             # UI mesajları
│   └── export const MESSAGES = {
│       SUCCESS: {...},
│       ERROR: {...},
│       VALIDATION: {...}
│     }
│
└── 📄 prohibited-items.ts     # Yasaklı ürünler
    └── export const PROHIBITED_ITEMS = [...]
```

---

## 10. public/ Klasörü

```
public/
│
├── 📁 images/
│   ├── 📄 logo.svg            # Ana logo
│   ├── 📄 logo-dark.svg       # Dark mode logo
│   ├── 📄 og-image.png        # Open Graph image
│   └── 📄 placeholder.png     # Placeholder image
│
├── 📁 icons/
│   ├── 📄 favicon.ico
│   ├── 📄 apple-touch-icon.png
│   └── 📄 icon-192.png
│
└── 📄 manifest.json           # PWA manifest
```

---

## 11. supabase/ Klasörü

```
supabase/
│
├── 📄 config.toml             # Supabase local config
│
├── 📁 migrations/             # Database migrations
│   ├── 📄 00001_initial_schema.sql
│   ├── 📄 00002_create_users.sql
│   ├── 📄 00003_create_listings.sql
│   ├── 📄 00004_create_messages.sql
│   ├── 📄 00005_create_transactions.sql
│   ├── 📄 00006_create_notifications.sql
│   ├── 📄 00007_create_universities.sql
│   ├── 📄 00008_create_shipments.sql
│   ├── 📄 00009_rls_policies.sql
│   ├── 📄 00010_functions_triggers.sql
│   └── 📄 00011_indexes.sql
│
├── 📁 functions/              # Edge Functions (opsiyonel)
│   └── 📁 send-notification/
│       └── 📄 index.ts
│
└── 📄 seed.sql                # Test verileri
```

---

## 12. Dosya Adlandırma Kuralları

| Tip | Format | Örnek |
|:----|:-------|:------|
| Component | `kebab-case.tsx` | `listing-card.tsx` |
| Page | `page.tsx` | `app/listings/page.tsx` |
| Layout | `layout.tsx` | `app/layout.tsx` |
| Hook | `use-*.ts` | `use-listings.ts` |
| Store | `*-store.ts` | `auth-store.ts` |
| Service | `*.service.ts` | `listing.service.ts` |
| Schema | `*.schema.ts` | `listing.schema.ts` |
| Type | `*.ts` (types/) | `listing.ts` |
| Constant | `*.ts` (constants/) | `categories.ts` |

---

## 13. Import Order

```typescript
// 1. React & Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { z } from 'zod';

// 3. Internal - lib
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

// 4. Internal - components
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';

// 5. Internal - hooks & stores
import { useAuth } from '@/hooks/use-auth';
import { useFilterStore } from '@/stores/filter-store';

// 6. Internal - types & constants
import type { Listing } from '@/types';
import { CATEGORIES } from '@/constants/categories';
```

---

## 14. Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  }
}
```

---

[[plan/SOLID ve Design Patterns.md]] | [[Teknoloji Stack.md]]
