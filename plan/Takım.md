# 🎯 KampüsMarket - Takım İş Bölümü

> Son Güncelleme: 2 Ocak 2026

---

## 👥 Takım Üyeleri


| # | İsim      | Rol                          |
| :-: | :--------- | :--------------------------- |
| 1 | **Özhan** | Takım Lideri / Koordinatör |
| 2 | **Eren**   | Takım Üyesi                |
| 3 | **Safi**   | Takım Üyesi                |
| 4 | **Burak**  | Takım Üyesi                |
| 5 | **Seyit**  | Takım Üyesi                |

---

## � GitHub Commit İş Bölümü

> Her takım üyesi kendi dosyalarını commit edip push edecek.

### 📦 Commit Komutları

```bash
# 1. Önce repo'yu clone'la (ilk seferlik)
git clone https://github.com/[repo-url].git
cd kampus-market

# 2. Güncel kodu çek
git pull origin main

# 3. Kendi dosyalarını ekle (aşağıdaki tabloya göre)
git add plan/[dosya-adı].md

# 4. Commit at
git commit -m "docs: [dosya adı] eklendi - [isim]"

# 5. Push et
git push origin main
```

---

## 📋 Kim Hangi Dosyayı Commit Edecek?

### 1️⃣ ÖZHAN (Takım Lideri)

> Projenin temel tanımları ve paydaş ilişkileri


| Dosya                                            | Commit Mesajı                                               |
| :----------------------------------------------- | :----------------------------------------------------------- |
| `plan/1. Problem Tanımı ve Paydaş Analizi.md` | `docs: problem tanımı ve paydaş analizi eklendi - Özhan` |
| `plan/2. Aktörler (Actors).md`                  | `docs: aktörler eklendi - Özhan`                           |

```bash
git add "plan/1. Problem Tanımı ve Paydaş Analizi.md" "plan/2. Aktörler (Actors).md"
git commit -m "docs: problem tanımı, paydaş analizi ve aktörler eklendi - Özhan"
git push origin main
```

---

### 2️⃣ EREN

> Sistem gereksinimleri


| Dosya                                                | Commit Mesajı                                   |
| :--------------------------------------------------- | :----------------------------------------------- |
| `plan/3. Fonksiyonel Gereksinimler.md`               | `docs: fonksiyonel gereksinimler eklendi - Eren` |
| `plan/4. Fonksiyonel Olmayan Gereksinimler (NFR).md` | `docs: NFR eklendi - Eren`                       |

```bash
git add "plan/3. Fonksiyonel Gereksinimler.md" "plan/4. Fonksiyonel Olmayan Gereksinimler (NFR).md"
git commit -m "docs: fonksiyonel ve fonksiyonel olmayan gereksinimler eklendi - Eren"
git push origin main
```

---

### 3️⃣ SAFİ

> Sistem kısıtlamaları ve kullanım senaryoları


| Dosya                                       | Commit Mesajı                                        |
| :------------------------------------------ | :---------------------------------------------------- |
| `plan/5. Kısıtlamalar ve Varsayımlar.md` | `docs: kısıtlamalar ve varsayımlar eklendi - Safi` |
| `plan/6. Use Case Diyagramı.md`            | `docs: use case diyagramı eklendi - Safi`            |

```bash
git add "plan/5. Kısıtlamalar ve Varsayımlar.md" "plan/6. Use Case Diyagramı.md"
git commit -m "docs: kısıtlamalar, varsayımlar ve use case diyagramı eklendi - Safi"
git push origin main
```

---

### 4️⃣ BURAK

> Teknik detaylar ve veri yapısı


| Dosya                                               | Commit Mesajı                            |
| :-------------------------------------------------- | :---------------------------------------- |
| `plan/7. Senaryo Detayları (Sequence Diagrams).md` | `docs: sequence diagrams eklendi - Burak` |
| `plan/8. Veri Sözlüğü (Data Dictionary).md`     | `docs: veri sözlüğü eklendi - Burak`  |

```bash
git add "plan/7. Senaryo Detayları (Sequence Diagrams).md" "plan/8. Veri Sözlüğü (Data Dictionary).md"
git commit -m "docs: senaryo detayları ve veri sözlüğü eklendi - Burak"
git push origin main
```

---

### 5️⃣ SEYİT

> İş mantığı ve kullanıcı hikayeleri


| Dosya                                               | Commit Mesajı                         |
| :-------------------------------------------------- | :------------------------------------- |
| `plan/9. İş Kuralları (Business Rules).md`       | `docs: iş kuralları eklendi - Seyit` |
| `plan/10. Kullanıcı Hikayeleri (User Stories).md` | `docs: user stories eklendi - Seyit`   |

```bash
git add "plan/9. İş Kuralları (Business Rules).md" "plan/10. Kullanıcı Hikayeleri (User Stories).md"
git commit -m "docs: iş kuralları ve kullanıcı hikayeleri eklendi - Seyit"
git push origin main
```

---

## 📊 Commit Durumu


| Kişi  | Dosya 1           | Dosya 2          | Durum |
| :----- | :---------------- | :--------------- | :---: |
| Özhan | Problem Tanımı  | Aktörler        |  ⏳  |
| Eren   | Fonksiyonel Ger.  | NFR              |  ⏳  |
| Safi   | Kısıtlamalar    | Use Case         |  ⏳  |
| Burak  | Sequence Diagrams | Veri Sözlüğü |  ⏳  |
| Seyit  | İş Kuralları   | User Stories     |  ⏳  |

---

## ⚠️ Önemli Kurallar

1. **Commit atmadan önce `git pull` yap!** (Conflict önlemek için)
2. **Sadece kendi dosyalarını commit et!**
3. **Commit mesajı formatı:** `docs: [açıklama] - [isim]`
4. **Sorun olursa gruba yaz, force push YAPMA!**

---

## 🔄 Conflict Olursa Ne Yapılır?

```bash
# 1. Güncel kodu çek
git pull origin main

# 2. Conflict varsa dosyayı aç, düzelt, kaydet

# 3. Tekrar commit at
git add .
git commit -m "fix: conflict çözüldü - [isim]"
git push origin main
```

---

## 📝 Ortak Dosyalar (Özhan Yükleyecek)

Bu dosyalar proje kurulumunda zaten mevcut:


| Dosya                              | Açıklama               |
| :--------------------------------- | :----------------------- |
| `CLAUDE.md`                        | Ana proje rehberi        |
| `README.md`                        | Proje tanıtımı        |
| `plan/Teknoloji Stack.md`          | Kullanılan teknolojiler |
| `plan/MVP Planı.md`               | MVP özeti               |
| `plan/SOLID ve Design Patterns.md` | Tasarım desenleri       |
| `plan/Klasör Yapısı.md`         | Proje yapısı           |

---

## 🛠️ AŞAMA 2: Proje Kaynak Kodları

> Plan dosyaları yüklendikten sonra, kaynak kodları aşağıdaki iş bölümüne göre yüklenecek.

### 📁 Proje Yapısı Özeti

```
kampus-market/
├── src/
│   ├── app/              # Sayfalar (routes)
│   ├── components/       # React bileşenleri
│   ├── lib/              # Yardımcı fonksiyonlar
│   ├── hooks/            # Custom hooks
│   ├── stores/           # State yönetimi
│   ├── types/            # TypeScript tipleri
│   └── constants/        # Sabitler
├── supabase/             # Veritabanı migration'ları
├── public/               # Statik dosyalar
└── [config files]        # Konfigürasyon dosyaları
```

---

### 1️⃣ ÖZHAN - Proje Temeli & Konfigürasyon

> Ana yapı, layout, konfigürasyon dosyaları


| Klasör/Dosya             | Açıklama                           |
| :------------------------ | :----------------------------------- |
| `package.json`            | Proje bağımlılıkları            |
| `next.config.ts`          | Next.js konfigürasyonu              |
| `tsconfig.json`           | TypeScript ayarları                 |
| `tailwind.config.ts`      | Tailwind CSS ayarları               |
| `postcss.config.mjs`      | PostCSS ayarları                    |
| `eslint.config.mjs`       | ESLint ayarları                     |
| `components.json`         | shadcn/ui ayarları                  |
| `.env.example`            | Örnek environment dosyası          |
| `src/app/layout.tsx`      | Ana layout                           |
| `src/app/globals.css`     | Global stiller                       |
| `src/components/ui/*`     | UI bileşenleri (shadcn)             |
| `src/components/layout/*` | Layout bileşenleri (header, footer) |
| `src/lib/utils.ts`        | Yardımcı fonksiyonlar              |
| `public/*`                | Logo, favicon, görseller            |

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs components.json .env.example
git add src/app/layout.tsx src/app/globals.css
git add src/components/ui/ src/components/layout/
git add src/lib/utils.ts public/
git commit -m "feat: proje temeli ve konfigürasyon - Özhan"
git push origin main
```

---

### 2️⃣ EREN - Kimlik Doğrulama (Auth)

> Giriş, kayıt, şifre sıfırlama, email doğrulama


| Klasör/Dosya           | Açıklama                                                                 |
| :---------------------- | :------------------------------------------------------------------------- |
| `src/app/(auth)/*`      | Auth sayfaları (login, register, verify, forgot-password, reset-password) |
| `src/components/auth/*` | Auth bileşenleri (login-form, register-form, vb.)                         |
| `src/lib/supabase/*`    | Supabase client, server, middleware                                        |
| `src/lib/validations/*` | Form validasyonları                                                       |
| `src/middleware.ts`     | Route koruması                                                            |

```bash
git add "src/app/(auth)/"
git add src/components/auth/
git add src/lib/supabase/ src/lib/validations/
git add src/middleware.ts
git commit -m "feat: kimlik doğrulama sistemi - Eren"
git push origin main
```

---

### 3️⃣ SAFİ - İlanlar (Listings)

> İlan listeleme, detay, oluşturma, düzenleme


| Klasör/Dosya                 | Açıklama                                    |
| :---------------------------- | :-------------------------------------------- |
| `src/app/(main)/page.tsx`     | Ana sayfa (ilan listesi)                      |
| `src/app/(main)/listings/*`   | İlan sayfaları (detay, yeni, düzenle)      |
| `src/app/(main)/categories/*` | Kategori sayfaları                           |
| `src/app/(main)/search/*`     | Arama sayfası                                |
| `src/components/listings/*`   | İlan bileşenleri (card, grid, form, filter) |
| `src/components/shared/*`     | Ortak bileşenler                             |

```bash
git add "src/app/(main)/page.tsx"
git add "src/app/(main)/listings/" "src/app/(main)/categories/" "src/app/(main)/search/"
git add src/components/listings/ src/components/shared/
git commit -m "feat: ilan sistemi - Safi"
git push origin main
```

---

### 4️⃣ BURAK - Veritabanı & API

> Supabase migration'ları, servisler, tipler


| Klasör/Dosya           | Açıklama                 |
| :---------------------- | :------------------------- |
| `supabase/migrations/*` | Veritabanı şeması (SQL) |
| `supabase/seed.sql`     | Örnek veriler             |
| `src/lib/services/*`    | API servisleri             |
| `src/types/*`           | TypeScript tip tanımları |
| `src/constants/*`       | Sabit değerler            |
| `src/app/api/*`         | API route'ları (varsa)    |

```bash
git add supabase/
git add src/lib/services/ src/types/ src/constants/
git add src/app/api/ 2>/dev/null || true
git commit -m "feat: veritabanı ve API servisleri - Burak"
git push origin main
```

---

### 5️⃣ SEYİT - Mesajlaşma & Profil & Bildirimler

> Mesajlar, profil yönetimi, favoriler, bildirimler


| Klasör/Dosya                    | Açıklama             |
| :------------------------------- | :--------------------- |
| `src/app/(main)/messages/*`      | Mesajlaşma sayfaları |
| `src/app/(main)/profile/*`       | Profil sayfası        |
| `src/app/(main)/favorites/*`     | Favoriler sayfası     |
| `src/app/(main)/notifications/*` | Bildirimler sayfası   |
| `src/components/messages/*`      | Mesaj bileşenleri     |
| `src/hooks/*`                    | Custom hooks           |
| `src/stores/*`                   | Zustand store'ları    |

```bash
git add "src/app/(main)/messages/" "src/app/(main)/profile/" "src/app/(main)/favorites/" "src/app/(main)/notifications/"
git add src/components/messages/
git add src/hooks/ src/stores/
git commit -m "feat: mesajlaşma, profil ve bildirimler - Seyit"
git push origin main
```

---

## 📊 Kaynak Kod Commit Durumu


| Kişi  | Alan                          | Durum |
| :----- | :---------------------------- | :---: |
| Özhan | Proje Temeli & Konfigürasyon |  ⏳  |
| Eren   | Kimlik Doğrulama (Auth)      |  ⏳  |
| Safi   | İlanlar (Listings)           |  ⏳  |
| Burak  | Veritabanı & API             |  ⏳  |
| Seyit  | Mesajlaşma & Profil          |  ⏳  |

---

## 🔢 Yükleme Sırası (ÖNEMLİ!)

> **Sırayla yükleyin, paralel yükleme YAPMAYIN!**


| Sıra | Kişi      | Alan                 | Neden Önce?                 |
| :---: | :--------- | :------------------- | :--------------------------- |
|   1   | **Özhan** | Proje Temeli         | Diğer her şey buna bağlı |
|   2   | **Burak**  | Veritabanı & API    | Tipler ve servisler gerekli  |
|   3   | **Eren**   | Auth                 | Kimlik doğrulama gerekli    |
|   4   | **Safi**   | İlanlar             | Ana özellik                 |
|   5   | **Seyit**  | Mesajlaşma & Profil | Son özellikler              |

---

## ⚠️ Yükleme Öncesi Kontrol Listesi

Her kişi yüklemeden önce:

- [ ]  `git pull origin main` yaptım
- [ ]  Dosyalarımı kontrol ettim
- [ ]  Önceki kişi yüklemeyi bitirdi
- [ ]  Conflict yok

---

> **📢 Koordinasyon:** Özhan
>
> **Soru varsa gruba yazın!**
