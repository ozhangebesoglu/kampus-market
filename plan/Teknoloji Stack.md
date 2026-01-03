# Teknoloji Stack

> Bu bölüm, KampüsMarket projesinde kullanılacak tüm teknolojileri, kütüphaneleri ve servisleri detaylı şekilde tanımlar.

---

## 1. Genel Bakış

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         TEKNOLOJİ MİMARİSİ                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                              ┌─────────────┐                                    │
│                              │   Vercel    │                                    │
│                              │  (Hosting)  │                                    │
│                              └──────┬──────┘                                    │
│                                     │                                           │
│                              ┌──────▼──────┐                                    │
│                              │  Next.js 14 │                                    │
│                              │ (App Router)│                                    │
│                              └──────┬──────┘                                    │
│                                     │                                           │
│         ┌───────────────────────────┼───────────────────────────┐              │
│         │                           │                           │              │
│         ▼                           ▼                           ▼              │
│  ┌─────────────┐           ┌─────────────┐           ┌─────────────┐          │
│  │  Supabase   │           │  Supabase   │           │   Iyzico    │          │
│  │    Auth     │           │  Database   │           │  (Ödeme)    │          │
│  └─────────────┘           │  + Realtime │           └─────────────┘          │
│                            │  + Storage  │                                     │
│                            └─────────────┘                                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

### 2.1 Core Framework

| Teknoloji | Versiyon | Amaç | Dokümantasyon |
|:----------|:---------|:-----|:--------------|
| **Next.js** | 14.x | React framework, SSR, App Router | [nextjs.org](https://nextjs.org/docs) |
| **React** | 18.x | UI kütüphanesi | [react.dev](https://react.dev) |
| **TypeScript** | 5.x | Tip güvenliği | [typescriptlang.org](https://www.typescriptlang.org/docs) |

### 2.2 Styling & UI

| Teknoloji | Versiyon | Amaç | Dokümantasyon |
|:----------|:---------|:-----|:--------------|
| **Tailwind CSS** | 3.x | Utility-first CSS | [tailwindcss.com](https://tailwindcss.com/docs) |
| **shadcn/ui** | latest | UI component library | [ui.shadcn.com](https://ui.shadcn.com) |
| **Lucide React** | latest | Icon kütüphanesi | [lucide.dev](https://lucide.dev) |
| **clsx** | latest | Conditional class names | [npm](https://www.npmjs.com/package/clsx) |
| **tailwind-merge** | latest | Tailwind class merging | [npm](https://www.npmjs.com/package/tailwind-merge) |

### 2.3 State Management & Forms

| Teknoloji | Versiyon | Amaç | Dokümantasyon |
|:----------|:---------|:-----|:--------------|
| **Zustand** | 4.x | Global state management | [zustand](https://zustand-demo.pmnd.rs) |
| **React Hook Form** | 7.x | Form yönetimi | [react-hook-form.com](https://react-hook-form.com) |
| **Zod** | 3.x | Schema validation | [zod.dev](https://zod.dev) |
| **@hookform/resolvers** | latest | Zod + RHF entegrasyonu | [npm](https://www.npmjs.com/package/@hookform/resolvers) |

### 2.4 Data Fetching & Caching

| Teknoloji | Versiyon | Amaç | Dokümantasyon |
|:----------|:---------|:-----|:--------------|
| **TanStack Query** | 5.x | Server state management | [tanstack.com/query](https://tanstack.com/query) |
| **SWR** (alternatif) | 2.x | Data fetching hooks | [swr.vercel.app](https://swr.vercel.app) |

### 2.5 Utilities

| Teknoloji | Versiyon | Amaç | Dokümantasyon |
|:----------|:---------|:-----|:--------------|
| **date-fns** | 3.x | Tarih işlemleri | [date-fns.org](https://date-fns.org) |
| **sharp** | latest | Image optimization | [sharp.pixelplumbing.com](https://sharp.pixelplumbing.com) |
| **next-themes** | latest | Dark/Light mode | [npm](https://www.npmjs.com/package/next-themes) |
| **sonner** | latest | Toast notifications | [sonner.emilkowal.ski](https://sonner.emilkowal.ski) |
| **nuqs** | latest | URL state management | [nuqs.47ng.com](https://nuqs.47ng.com) |

---

## 3. Backend Stack (BaaS)

### 3.1 Supabase

| Servis | Amaç | Özellikler |
|:-------|:-----|:-----------|
| **Supabase Auth** | Kimlik doğrulama | Email/password, Magic link, OAuth |
| **Supabase Database** | PostgreSQL veritabanı | RLS, Triggers, Functions |
| **Supabase Realtime** | Gerçek zamanlı | WebSocket, Presence, Broadcast |
| **Supabase Storage** | Dosya depolama | Image upload, CDN |
| **Supabase Edge Functions** | Serverless functions | Deno runtime |

### 3.2 Supabase Client Libraries

| Paket | Amaç |
|:------|:-----|
| `@supabase/supabase-js` | JavaScript client |
| `@supabase/ssr` | Server-side rendering helpers |
| `@supabase/auth-helpers-nextjs` | Next.js auth helpers |

### 3.3 Database Features

```sql
-- Kullanılacak PostgreSQL özellikleri
├── Row Level Security (RLS)     -- Her tablo için güvenlik politikaları
├── Database Triggers            -- Otomatik işlemler (updated_at, notifications)
├── PostgreSQL Functions         -- Stored procedures
├── Full-Text Search             -- pg_trgm ile arama
├── ENUM Types                   -- Durum yönetimi
├── Foreign Key Constraints      -- İlişkisel bütünlük
├── Indexes                      -- Performans optimizasyonu
└── Views                        -- Karmaşık sorgular için
```

---

## 4. Ödeme Entegrasyonu

### 4.1 Iyzico

| Özellik | Açıklama |
|:--------|:---------|
| **3D Secure** | Tüm ödemeler için zorunlu |
| **Marketplace** | Alt satıcı (sub-merchant) desteği |
| **Escrow** | Para tutma ve aktarma |
| **Refund API** | İade işlemleri |
| **Webhook** | Ödeme bildirimleri |

### 4.2 Iyzico Paketleri

| Paket | Amaç |
|:------|:-----|
| `iyzipay` | Official Node.js SDK |

### 4.3 Ödeme Akışı

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ÖDEME AKIŞI                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. Alıcı "Satın Al" tıklar                                                    │
│     │                                                                           │
│     ▼                                                                           │
│  2. Next.js API → Iyzico Initialize                                            │
│     │                                                                           │
│     ▼                                                                           │
│  3. 3D Secure popup açılır                                                     │
│     │                                                                           │
│     ├─► Başarılı → Callback URL → Para escrow'a                                │
│     │                                                                           │
│     └─► Başarısız → Hata sayfası                                               │
│                                                                                 │
│  4. Teslimat onaylandığında                                                    │
│     │                                                                           │
│     ▼                                                                           │
│  5. Iyzico Approval → Para satıcıya aktarılır                                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Deployment & Infrastructure

### 5.1 Hosting

| Servis | Amaç | Tier |
|:-------|:-----|:-----|
| **Vercel** | Next.js hosting | Hobby (Free) |
| **Supabase** | Database + Auth + Storage | Free |

### 5.2 Vercel Özellikleri

| Özellik | Açıklama |
|:--------|:---------|
| Edge Functions | API routes at the edge |
| Image Optimization | next/image için otomatik |
| Analytics | Web Vitals tracking |
| Preview Deployments | PR başına preview |
| Environment Variables | Secret yönetimi |

### 5.3 Domain & SSL

| Özellik | Değer |
|:--------|:------|
| Domain | `kampusmarket.vercel.app` (başlangıç) |
| SSL | Otomatik (Vercel) |
| CDN | Vercel Edge Network |

---

## 6. Development Tools

### 6.1 Code Quality

| Araç | Amaç | Config Dosyası |
|:-----|:-----|:---------------|
| **ESLint** | Linting | `.eslintrc.json` |
| **Prettier** | Code formatting | `.prettierrc` |
| **TypeScript** | Type checking | `tsconfig.json` |
| **Husky** | Git hooks | `.husky/` |
| **lint-staged** | Pre-commit linting | `package.json` |

### 6.2 Testing (Opsiyonel - MVP sonrası)

| Araç | Amaç |
|:-----|:-----|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **Testing Library** | Component testing |

### 6.3 IDE & Extensions

| Araç | Önerilen Extension'lar |
|:-----|:-----------------------|
| **VS Code** | ESLint, Prettier, Tailwind CSS IntelliSense, Prisma (opsiyonel) |

---

## 7. Versiyon Gereksinimleri

| Teknoloji | Minimum Versiyon | Önerilen |
|:----------|:-----------------|:---------|
| **Node.js** | 18.17.0 | 20.x LTS |
| **npm** | 9.0.0 | 10.x |
| **Next.js** | 14.0.0 | 14.x |
| **React** | 18.2.0 | 18.x |
| **TypeScript** | 5.0.0 | 5.x |

---

## 8. Package.json Dependencies

### 8.1 Production Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "zustand": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "@tanstack/react-query": "^5.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "date-fns": "^3.x",
    "sonner": "^1.x",
    "next-themes": "^0.x",
    "iyzipay": "^2.x"
  }
}
```

### 8.2 Dev Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "eslint": "^8.x",
    "eslint-config-next": "14.x",
    "prettier": "^3.x",
    "prettier-plugin-tailwindcss": "^0.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

---

## 9. shadcn/ui Bileşenleri

### 9.1 Kullanılacak Bileşenler

| Kategori | Bileşenler |
|:---------|:-----------|
| **Form** | Button, Input, Textarea, Select, Checkbox, Radio, Label, Form |
| **Feedback** | Alert, Toast (Sonner), Progress, Skeleton |
| **Layout** | Card, Separator, Tabs, Accordion |
| **Navigation** | Navigation Menu, Dropdown Menu, Command (Search) |
| **Overlay** | Dialog, Sheet, Popover, Tooltip |
| **Data Display** | Avatar, Badge, Table |

### 9.2 Kurulum Komutu

```bash
# shadcn/ui init
npx shadcn-ui@latest init

# Bileşen ekleme
npx shadcn-ui@latest add button input card dialog
```

---

## 10. Proje Yapısı

```
kampus-market/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth sayfaları (login, register)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (main)/              # Ana uygulama sayfaları
│   │   │   ├── page.tsx         # Ana sayfa
│   │   │   ├── listings/        # İlan sayfaları
│   │   │   ├── messages/        # Mesajlaşma
│   │   │   ├── profile/         # Profil
│   │   │   └── layout.tsx
│   │   ├── admin/               # Admin panel
│   │   │   ├── dashboard/
│   │   │   ├── listings/
│   │   │   ├── users/
│   │   │   └── layout.tsx
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/
│   │   │   ├── listings/
│   │   │   ├── payments/
│   │   │   └── webhooks/
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui bileşenleri
│   │   ├── forms/               # Form bileşenleri
│   │   ├── layout/              # Header, Footer, Sidebar
│   │   ├── listings/            # İlan bileşenleri
│   │   ├── messages/            # Mesaj bileşenleri
│   │   └── shared/              # Ortak bileşenler
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   ├── middleware.ts    # Auth middleware
│   │   │   └── types.ts         # Database types
│   │   ├── iyzico/
│   │   │   ├── client.ts        # Iyzico client
│   │   │   └── types.ts
│   │   ├── validations/         # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── listing.ts
│   │   │   └── payment.ts
│   │   └── utils.ts             # Utility fonksiyonlar
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-listings.ts
│   │   ├── use-messages.ts
│   │   └── use-notifications.ts
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── cart-store.ts
│   │   └── notification-store.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── database.ts          # Supabase generated types
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   └── constants/               # Sabitler
│       ├── categories.ts
│       ├── config.ts
│       └── routes.ts
│
├── public/                      # Static files
│   ├── images/
│   └── icons/
│
├── supabase/                    # Supabase local config
│   ├── migrations/              # Database migrations
│   ├── seed.sql                 # Seed data
│   └── config.toml
│
├── .env.local                   # Environment variables
├── .env.example                 # Example env file
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 11. Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Iyzico
IYZICO_API_KEY=xxx
IYZICO_SECRET_KEY=xxx
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com  # Production: https://api.iyzipay.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KampüsMarket

# Email (optional)
RESEND_API_KEY=xxx
```

---

## 12. Kurulum Adımları

```bash
# 1. Proje oluştur
npx create-next-app@latest kampus-market --typescript --tailwind --eslint --app

# 2. Dizine git
cd kampus-market

# 3. Bağımlılıkları yükle
npm install @supabase/supabase-js @supabase/ssr zustand react-hook-form zod @hookform/resolvers @tanstack/react-query lucide-react clsx tailwind-merge date-fns sonner next-themes iyzipay

# 4. Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss

# 5. shadcn/ui kur
npx shadcn-ui@latest init

# 6. Gerekli bileşenleri ekle
npx shadcn-ui@latest add button input card dialog form label select textarea tabs avatar badge dropdown-menu sheet toast separator skeleton table

# 7. Supabase types oluştur
npx supabase gen types typescript --project-id "your-project-id" > src/types/database.ts

# 8. Geliştirme sunucusunu başlat
npm run dev
```

---

## 13. Alternatif Teknolojiler (Gelecek için)

| Mevcut | Alternatif | Ne Zaman |
|:-------|:-----------|:---------|
| Supabase | Firebase, PlanetScale | Ölçekleme gerektiğinde |
| Iyzico | Stripe | Global expansion |
| Vercel | Railway, Fly.io | Maliyet optimizasyonu |
| Zustand | Jotai, Redux Toolkit | Karmaşık state gerekirse |
| shadcn/ui | Radix UI, Headless UI | Daha fazla customization |

---

## 14. Performans Hedefleri

| Metrik | Hedef | Ölçüm |
|:-------|:------|:------|
| **LCP** | < 2.5s | Lighthouse |
| **FID** | < 100ms | Lighthouse |
| **CLS** | < 0.1 | Lighthouse |
| **TTFB** | < 600ms | Vercel Analytics |
| **Bundle Size** | < 200KB (initial) | next build |

---

[[CLAUDE.md]]
