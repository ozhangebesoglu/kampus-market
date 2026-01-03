# 🚀 KampüsMarket MVP Planı

> Minimum Viable Product - İlk çalışan versiyon
> 
> Son Güncelleme: 2 Ocak 2026

---

## 📋 İçindekiler

1. [MVP Kapsamı](#1-mvp-kapsamı)
2. [MVP Dışı Özellikler](#2-mvp-dışı-özellikler)
3. [Sprint Planı](#3-sprint-planı)
4. [Veritabanı (MVP)](#4-veritabanı-mvp)
5. [Sayfalar ve Rotalar](#5-sayfalar-ve-rotalar)
6. [API Endpoints](#6-api-endpoints)
7. [Başarı Kriterleri](#7-başarı-kriterleri)

---

## 1. MVP Kapsamı

### ✅ MVP'de Olacak Özellikler

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MVP KAPSAMI                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  🔐 AUTH                    📦 İLANLAR                  💬 MESAJLAŞMA          │
│  ├─ Kayıt (.edu.tr)         ├─ İlan oluştur            ├─ Konuşma başlat       │
│  ├─ Giriş                   ├─ İlan listele            ├─ Mesaj gönder         │
│  ├─ Çıkış                   ├─ İlan detay              └─ Mesaj listele        │
│  ├─ Email doğrulama         ├─ İlan düzenle                                    │
│  └─ Şifre sıfırlama         ├─ İlan sil                                        │
│                             ├─ Görsel yükleme (max 5)                          │
│                             └─ Kategori seçimi                                 │
│                                                                                 │
│  👤 PROFİL                  🔍 ARAMA                   👨‍💼 ADMİN               │
│  ├─ Profil görüntüle        ├─ Basit arama             ├─ İlan onaylama        │
│  ├─ Profil düzenle          ├─ Kategori filtresi       ├─ İlan reddetme        │
│  ├─ Avatar yükleme          └─ Fiyat sıralaması        ├─ Kullanıcı listesi    │
│  └─ Kendi ilanlarım                                    └─ Basit dashboard      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 📊 Özellik Detayları

| Modül | Özellik | Öncelik | Zorluk | Story Point |
|:------|:--------|:-------:|:------:|:-----------:|
| **Auth** | Email/şifre kayıt | P0 | Kolay | 3 |
| **Auth** | .edu.tr doğrulama | P0 | Kolay | 2 |
| **Auth** | Email verification | P0 | Orta | 3 |
| **Auth** | Giriş/Çıkış | P0 | Kolay | 2 |
| **Auth** | Şifre sıfırlama | P1 | Orta | 3 |
| **İlan** | İlan oluşturma | P0 | Orta | 5 |
| **İlan** | Görsel yükleme | P0 | Orta | 5 |
| **İlan** | İlan listeleme | P0 | Kolay | 3 |
| **İlan** | İlan detay | P0 | Kolay | 3 |
| **İlan** | İlan düzenleme | P0 | Orta | 3 |
| **İlan** | İlan silme | P0 | Kolay | 2 |
| **Kategori** | Kategori listesi | P0 | Kolay | 2 |
| **Kategori** | Kategoriye göre filtre | P0 | Kolay | 2 |
| **Arama** | Basit text arama | P1 | Orta | 3 |
| **Arama** | Fiyat sıralaması | P1 | Kolay | 2 |
| **Mesaj** | Konuşma başlatma | P0 | Orta | 3 |
| **Mesaj** | Mesaj gönderme | P0 | Orta | 5 |
| **Mesaj** | Mesaj listeleme | P0 | Orta | 3 |
| **Profil** | Profil görüntüleme | P0 | Kolay | 2 |
| **Profil** | Profil düzenleme | P1 | Kolay | 3 |
| **Profil** | Kendi ilanlarım | P0 | Kolay | 2 |
| **Admin** | İlan onay/red | P0 | Orta | 5 |
| **Admin** | Kullanıcı listesi | P1 | Kolay | 2 |
| **Admin** | Dashboard stats | P2 | Kolay | 3 |
| **UI** | Responsive tasarım | P0 | Orta | 5 |
| **UI** | Dark mode | P2 | Kolay | 2 |

**Toplam: ~73 Story Point**

---

## 2. MVP Dışı Özellikler

### ❌ V1.1'e Ertelenen Özellikler

| Özellik | Neden Ertelendi | Tahmini Sprint |
|:--------|:----------------|:---------------|
| 💳 Ödeme sistemi (Iyzico) | Kompleks, yasal süreç | Sprint 4-5 |
| 📦 Kargo entegrasyonu | API entegrasyonu gerekli | Sprint 5-6 |
| 🚚 Teslimat takip sistemi | Ödeme sistemine bağlı | Sprint 6 |
| ⭐ Favoriler | Kritik değil | Sprint 3 |
| 🔔 Gerçek zamanlı bildirimler | Optimizasyon sonrası | Sprint 4 |
| 🚨 Şikayet/raporlama | Admin paneli sonrası | Sprint 4 |
| 🏫 Üniversite yönetimi | Admin paneli sonrası | Sprint 5 |
| 📊 Gelişmiş istatistikler | Veri toplandıktan sonra | Sprint 6 |
| 🔍 Gelişmiş arama (Elasticsearch) | Ölçekleme gerektiğinde | Sprint 7+ |
| 📱 PWA / Mobile app | Web stabilize olduktan sonra | V2.0 |

---

## 3. Sprint Planı

### 🏃 Sprint 0: Altyapı (1 hafta)

```
[ ] Proje kurulumu (Next.js 14 + TypeScript)
[ ] Supabase projesi oluşturma
[ ] Veritabanı şeması ve migration'lar
[ ] shadcn/ui kurulumu
[ ] Temel layout (header, footer)
[ ] Environment variables
[ ] Git repo + branch stratejisi
```

**Çıktı:** Boş ama çalışan proje altyapısı

---

### 🏃 Sprint 1: Auth + Temel Yapı (1 hafta)

```
[ ] Supabase Auth entegrasyonu
[ ] Kayıt sayfası + .edu.tr validasyonu
[ ] Giriş sayfası
[ ] Email doğrulama akışı
[ ] Auth middleware (protected routes)
[ ] Basit profil sayfası
[ ] User store (Zustand)
```

**Çıktı:** Kullanıcılar kayıt olup giriş yapabilir

---

### 🏃 Sprint 2: İlan Sistemi (1.5 hafta)

```
[ ] Kategori sabitleri
[ ] İlan oluşturma formu
[ ] Görsel yükleme (Supabase Storage)
[ ] İlan listeleme sayfası
[ ] İlan detay sayfası
[ ] İlan düzenleme
[ ] İlan silme (soft delete)
[ ] Kendi ilanlarım sayfası
[ ] İlan skeleton loading
```

**Çıktı:** Kullanıcılar ilan oluşturup görüntüleyebilir

---

### 🏃 Sprint 3: Arama + Mesajlaşma (1.5 hafta)

```
[ ] Basit text arama
[ ] Kategori filtresi
[ ] Fiyat sıralaması
[ ] Konuşma oluşturma
[ ] Mesaj gönderme
[ ] Mesaj listeleme
[ ] Konuşmalar sayfası
[ ] Realtime mesajlaşma (Supabase Realtime)
```

**Çıktı:** Kullanıcılar arama yapıp mesajlaşabilir

---

### 🏃 Sprint 4: Admin Panel + Polish (1 hafta)

```
[ ] Admin layout
[ ] Bekleyen ilanlar listesi
[ ] İlan onay/red işlemi
[ ] Kullanıcı listesi
[ ] Basit dashboard (stats)
[ ] Hata sayfaları (404, 500)
[ ] Loading states
[ ] Empty states
[ ] Toast notifications
[ ] Responsive düzeltmeleri
```

**Çıktı:** Admin ilanları yönetebilir, UI polish

---

### 📅 Toplam Süre: ~5 Hafta

```
Sprint 0: ████████░░ (Altyapı)
Sprint 1: ████████░░ (Auth)
Sprint 2: ████████████░░ (İlanlar)
Sprint 3: ████████████░░ (Arama + Mesaj)
Sprint 4: ████████░░ (Admin + Polish)
          ─────────────────────────────
          Toplam: ~5 Hafta
```

---

## 4. Veritabanı (MVP)

### 📊 MVP Tabloları (8 Tablo)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MVP VERİTABANI ŞEMASI                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                            ┌─────────────┐                                      │
│                            │  categories │                                      │
│                            └──────┬──────┘                                      │
│                                   │                                             │
│  ┌─────────────┐           ┌──────▼──────┐                                      │
│  │    users    │◄──────────│  listings   │                                      │
│  └──────┬──────┘           └──────┬──────┘                                      │
│         │                         │                                             │
│         │                         │                                             │
│         ▼                         ▼                                             │
│  ┌─────────────┐           ┌─────────────┐                                      │
│  │conversations│◄──────────│   images    │                                      │
│  └──────┬──────┘           └─────────────┘                                      │
│         │                                                                       │
│         ▼                                                                       │
│  ┌─────────────┐                                                                │
│  │  messages   │                                                                │
│  └─────────────┘                                                                │
│                                                                                 │
│  Opsiyonel MVP:                                                                 │
│  ┌─────────────┐           ┌─────────────┐                                      │
│  │notifications│           │   reports   │  (Sprint 4)                         │
│  └─────────────┘           └─────────────┘                                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 📋 Tablo Listesi

| # | Tablo | Amaç | Sprint |
|:-:|:------|:-----|:------:|
| 1 | `users` | Kullanıcı bilgileri | 0 |
| 2 | `categories` | Sabit kategoriler | 0 |
| 3 | `listings` | İlanlar | 0 |
| 4 | `listing_images` | İlan görselleri | 0 |
| 5 | `conversations` | Mesaj konuşmaları | 0 |
| 6 | `messages` | Mesajlar | 0 |
| 7 | `notifications` | Bildirimler (basit) | 4 |
| 8 | `reports` | Şikayetler (opsiyonel) | 4 |

---

## 5. Sayfalar ve Rotalar

### 🌐 MVP Sayfaları

```
/                           # Ana sayfa (ilan listesi)
├── /login                  # Giriş
├── /register               # Kayıt
├── /verify                 # Email doğrulama
├── /forgot-password        # Şifre sıfırlama
│
├── /listings               # İlan listesi
│   ├── /[id]              # İlan detay
│   ├── /create            # İlan oluştur
│   └── /edit/[id]         # İlan düzenle
│
├── /categories             # Kategori listesi
│   └── /[slug]            # Kategoriye göre ilanlar
│
├── /search                 # Arama sonuçları
│
├── /messages               # Konuşmalar
│   └── /[conversationId]  # Mesaj detay
│
├── /profile                # Kendi profilim
│   ├── /settings          # Profil düzenleme
│   └── /listings          # Kendi ilanlarım
│
├── /u/[username]           # Public profil
│
└── /admin                  # Admin panel
    ├── /listings          # İlan yönetimi
    │   └── /pending       # Bekleyen ilanlar
    └── /users             # Kullanıcı listesi
```

### 📊 Sayfa Sayısı

| Kategori | Sayfa Sayısı |
|:---------|:------------:|
| Auth | 4 |
| İlanlar | 4 |
| Mesajlar | 2 |
| Profil | 4 |
| Admin | 3 |
| **Toplam** | **17** |

---

## 6. API Endpoints

### 🔌 MVP API Routes

```
/api
├── /auth
│   ├── POST /callback      # OAuth callback
│   └── POST /confirm       # Email confirmation
│
├── /listings
│   ├── GET  /              # Liste (pagination, filters)
│   ├── POST /              # Oluştur
│   ├── GET  /[id]          # Detay
│   ├── PUT  /[id]          # Güncelle
│   └── DELETE /[id]        # Sil
│
├── /upload
│   └── POST /              # Görsel yükleme
│
├── /messages
│   ├── GET  /conversations         # Konuşmalar
│   ├── POST /conversations         # Yeni konuşma
│   ├── GET  /conversations/[id]    # Mesajlar
│   └── POST /conversations/[id]    # Mesaj gönder
│
├── /users
│   ├── GET  /me            # Kendi profil
│   ├── PUT  /me            # Profil güncelle
│   └── GET  /[id]          # Public profil
│
└── /admin
    ├── GET  /listings/pending     # Bekleyen ilanlar
    ├── POST /listings/[id]/approve # Onayla
    ├── POST /listings/[id]/reject  # Reddet
    └── GET  /users                 # Kullanıcı listesi
```

---

## 7. Başarı Kriterleri

### ✅ MVP Tamamlanma Kriterleri

| # | Kriter | Ölçüm |
|:-:|:-------|:------|
| 1 | Kullanıcı .edu.tr ile kayıt olabilmeli | ✓/✗ |
| 2 | Email doğrulama çalışmalı | ✓/✗ |
| 3 | Kullanıcı ilan oluşturabilmeli | ✓/✗ |
| 4 | İlana 5 görsel yüklenebilmeli | ✓/✗ |
| 5 | İlanlar listelenebilmeli | ✓/✗ |
| 6 | Kategoriye göre filtreleme çalışmalı | ✓/✗ |
| 7 | Basit arama çalışmalı | ✓/✗ |
| 8 | Kullanıcılar mesajlaşabilmeli | ✓/✗ |
| 9 | Admin ilanları onaylayabilmeli | ✓/✗ |
| 10 | Mobil responsive çalışmalı | ✓/✗ |

### 📈 Performans Hedefleri

| Metrik | Hedef |
|:-------|:------|
| Lighthouse Performance | > 80 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Largest Contentful Paint | < 2.5s |

### 🐛 Kabul Edilebilir Bug Sayısı

| Seviye | MVP'de Max |
|:-------|:----------:|
| Critical | 0 |
| Major | 2 |
| Minor | 10 |

---

## 8. Teknoloji Özeti (MVP)

```
Frontend:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
├── React Hook Form + Zod
├── Zustand
└── TanStack Query

Backend:
├── Supabase Auth
├── Supabase Database (PostgreSQL)
├── Supabase Storage
├── Supabase Realtime (mesajlar için)
└── Next.js API Routes

Deployment:
├── Vercel (Frontend)
└── Supabase (Backend)
```

---

## 9. Hemen Başlayalım! 🚀

### İlk Adım: Veritabanı

```bash
# 1. Supabase projesi oluştur (dashboard'dan)
# 2. Migration dosyalarını çalıştır
# 3. RLS politikalarını ekle
# 4. Seed data ekle (test için)
```

---

[[plan/SOLID ve Design Patterns.md]] | [[plan/Klasör Yapısı.md]] | [[Teknoloji Stack.md]]
