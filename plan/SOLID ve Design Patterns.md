# SOLID Prensipleri ve Design Patterns

> KampüsMarket projesi için mimari prensipler ve tasarım kalıpları rehberi.
> 
> Son Güncelleme: 2 Ocak 2026

---

## 📋 İçindekiler

1. [SOLID Prensipleri](#1-solid-prensipleri)
2. [Kullanılacak Design Patterns](#2-kullanılacak-design-patterns)
3. [Next.js App Router Patterns](#3-nextjs-app-router-patterns)
4. [React Patterns](#4-react-patterns)
5. [Supabase Patterns](#5-supabase-patterns)
6. [Anti-Patterns (Kaçınılması Gerekenler)](#6-anti-patterns)

---

## 1. SOLID Prensipleri

### 1.1 Single Responsibility Principle (SRP) - Tek Sorumluluk

> **"Bir sınıf/modül sadece tek bir işten sorumlu olmalı."**

#### ✅ Doğru Uygulama

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # SADECE browser client oluşturma
│   │   ├── server.ts          # SADECE server client oluşturma
│   │   └── admin.ts           # SADECE admin client oluşturma
│   │
│   ├── validations/
│   │   ├── auth.ts            # SADECE auth validation
│   │   ├── listing.ts         # SADECE ilan validation
│   │   └── payment.ts         # SADECE ödeme validation
│   │
│   └── services/
│       ├── auth.service.ts    # SADECE auth işlemleri
│       ├── listing.service.ts # SADECE ilan işlemleri
│       └── payment.service.ts # SADECE ödeme işlemleri
```

#### ❌ Yanlış Uygulama

```typescript
// ❌ YANLIŞ: Her şeyi tek dosyada yapmak
// lib/api.ts
export function login() { ... }
export function createListing() { ... }
export function processPayment() { ... }
export function sendNotification() { ... }
```

#### 📝 Proje Örnekleri

| Dosya/Modül | Tek Sorumluluğu |
|:------------|:----------------|
| `hooks/use-auth.ts` | Sadece authentication state yönetimi |
| `hooks/use-listings.ts` | Sadece ilan CRUD işlemleri |
| `stores/cart-store.ts` | Sadece sepet state yönetimi |
| `components/ui/Button.tsx` | Sadece buton render etme |

---

### 1.2 Open/Closed Principle (OCP) - Açık/Kapalı

> **"Yazılım varlıkları genişletmeye açık, değişikliğe kapalı olmalı."**

#### ✅ Doğru Uygulama

```typescript
// ✅ DOĞRU: Yeni tip eklemek için mevcut kodu değiştirmiyoruz

// types/delivery.ts
type DeliveryType = 'hand_to_hand' | 'cargo';

// strategies/delivery-strategy.ts
interface DeliveryStrategy {
  calculateFee(distance: number): number;
  getEstimatedTime(): string;
  validate(order: Order): boolean;
}

class HandToHandDelivery implements DeliveryStrategy {
  calculateFee() { return 0; }
  getEstimatedTime() { return "Anlaşmalı süre"; }
  validate(order) { return order.sameLocation; }
}

class CargoDelivery implements DeliveryStrategy {
  calculateFee(distance) { return distance * 0.5; }
  getEstimatedTime() { return "2-3 iş günü"; }
  validate(order) { return true; }
}

// Yeni teslimat tipi eklemek için:
// Sadece yeni class oluştur, mevcut koda dokunma
class DroneDelivery implements DeliveryStrategy {
  calculateFee() { return 25; }
  getEstimatedTime() { return "1 saat"; }
  validate(order) { return order.weight < 5; }
}
```

#### 📝 Proje Örnekleri

| Senaryo | Genişletme Yöntemi |
|:--------|:-------------------|
| Yeni kategori ekleme | `constants/categories.ts`'e ekle |
| Yeni bildirim tipi | `NotificationStrategy` interface'i |
| Yeni ödeme yöntemi | `PaymentGateway` interface'i |
| Yeni kargo firması | Konfigürasyona ekle |

---

### 1.3 Liskov Substitution Principle (LSP) - Liskov Yerine Geçme

> **"Alt sınıflar, üst sınıfların yerine kullanılabilmeli."**

#### ✅ Doğru Uygulama

```typescript
// ✅ DOĞRU: Tüm Button varyantları aynı props'u kabul eder

// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = ({ variant = 'default', size = 'md', ...props }: ButtonProps) => {
  // Her variant aynı şekilde kullanılabilir
}

// Kullanım: Her yerde aynı interface
<Button variant="default">Kaydet</Button>
<Button variant="destructive">Sil</Button>
<Button variant="outline">İptal</Button>
```

#### 📝 Proje Örnekleri

| Base Component | Varyantlar |
|:---------------|:-----------|
| `BaseCard` | `ListingCard`, `UserCard`, `NotificationCard` |
| `BaseInput` | `TextInput`, `SearchInput`, `PasswordInput` |
| `BaseModal` | `ConfirmModal`, `FormModal`, `AlertModal` |

---

### 1.4 Interface Segregation Principle (ISP) - Arayüz Ayrımı

> **"İstemciler kullanmadıkları interface'lere bağımlı olmamalı."**

#### ✅ Doğru Uygulama

```typescript
// ✅ DOĞRU: Küçük, odaklı interface'ler

// types/user.ts
interface Identifiable {
  id: string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  fullName: string;
  avatarUrl?: string;
  bio?: string;
}

interface UserAuth {
  email: string;
  isVerified: boolean;
}

interface UserModeration {
  isBanned: boolean;
  banReason?: string;
  banUntil?: Date;
}

// Tam kullanıcı tipi - ihtiyaca göre birleştir
type User = Identifiable & Timestamped & UserProfile & UserAuth;
type AdminUser = User & UserModeration & { isAdmin: true };
```

#### ❌ Yanlış Uygulama

```typescript
// ❌ YANLIŞ: Dev interface, her yerde her şey gerekli değil
interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  phone: string;
  bio: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  banReason: string;
  banUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  // ... 20 alan daha
}
```

---

### 1.5 Dependency Inversion Principle (DIP) - Bağımlılık Tersine Çevirme

> **"Üst seviye modüller alt seviye modüllere bağımlı olmamalı. Her ikisi de soyutlamalara bağımlı olmalı."**

#### ✅ Doğru Uygulama

```typescript
// ✅ DOĞRU: Soyutlamaya bağımlılık

// lib/storage/storage.interface.ts
interface StorageProvider {
  upload(file: File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

// lib/storage/supabase-storage.ts
class SupabaseStorage implements StorageProvider {
  async upload(file: File, path: string) {
    // Supabase Storage implementasyonu
  }
  // ...
}

// lib/storage/s3-storage.ts (gelecekte)
class S3Storage implements StorageProvider {
  async upload(file: File, path: string) {
    // AWS S3 implementasyonu
  }
  // ...
}

// hooks/use-upload.ts - Soyutlamaya bağımlı
function useUpload(storage: StorageProvider) {
  const uploadImage = async (file: File) => {
    return await storage.upload(file, `images/${Date.now()}`);
  };
  return { uploadImage };
}
```

#### 📝 Proje Örnekleri

| Soyutlama | Mevcut Implementasyon | Olası Alternatif |
|:----------|:----------------------|:-----------------|
| `StorageProvider` | SupabaseStorage | S3Storage, CloudinaryStorage |
| `PaymentGateway` | IyzicoPayment | StripePayment |
| `NotificationSender` | SupabaseRealtime | Firebase, Pusher |
| `EmailProvider` | ResendEmail | SendGrid, Mailgun |

---

## 2. Kullanılacak Design Patterns

### 2.1 Repository Pattern

> Veri erişim mantığını soyutla.

```typescript
// lib/repositories/listing.repository.ts
interface ListingRepository {
  findById(id: string): Promise<Listing | null>;
  findByUser(userId: string): Promise<Listing[]>;
  create(data: CreateListingDTO): Promise<Listing>;
  update(id: string, data: UpdateListingDTO): Promise<Listing>;
  delete(id: string): Promise<void>;
  search(query: SearchQuery): Promise<PaginatedResult<Listing>>;
}

class SupabaseListingRepository implements ListingRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // ... diğer metodlar
}
```

**Kullanım Yerleri:**
- `ListingRepository` - İlan işlemleri
- `UserRepository` - Kullanıcı işlemleri
- `TransactionRepository` - İşlem/satış işlemleri
- `MessageRepository` - Mesaj işlemleri

---

### 2.2 Service Layer Pattern

> İş mantığını controller'lardan ayır.

```typescript
// lib/services/listing.service.ts
class ListingService {
  constructor(
    private listingRepo: ListingRepository,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {}
  
  async createListing(userId: string, data: CreateListingDTO) {
    // 1. Validation
    const validated = listingSchema.parse(data);
    
    // 2. Görselleri yükle
    const imageUrls = await Promise.all(
      data.images.map(img => this.storageService.upload(img))
    );
    
    // 3. İlanı kaydet
    const listing = await this.listingRepo.create({
      ...validated,
      userId,
      images: imageUrls,
      status: 'pending_approval'
    });
    
    // 4. Admin'e bildirim gönder
    await this.notificationService.notifyAdmins('new_listing', listing);
    
    return listing;
  }
}
```

---

### 2.3 Factory Pattern

> Nesne oluşturmayı merkezi yönet.

```typescript
// lib/factories/notification.factory.ts
type NotificationType = 
  | 'new_message'
  | 'order_placed' 
  | 'order_shipped'
  | 'order_delivered'
  | 'listing_approved';

interface NotificationData {
  title: string;
  body: string;
  action_url?: string;
}

class NotificationFactory {
  static create(type: NotificationType, data: Record<string, any>): NotificationData {
    switch (type) {
      case 'new_message':
        return {
          title: 'Yeni Mesaj',
          body: `${data.senderName} size mesaj gönderdi`,
          action_url: `/messages/${data.conversationId}`
        };
        
      case 'order_placed':
        return {
          title: 'Yeni Sipariş! 🎉',
          body: `${data.buyerName} "${data.listingTitle}" ürününü satın aldı`,
          action_url: `/orders/${data.orderId}`
        };
        
      case 'order_shipped':
        return {
          title: 'Kargoya Verildi 📦',
          body: `Siparişiniz kargoya verildi. Takip No: ${data.trackingNumber}`,
          action_url: `/orders/${data.orderId}`
        };
        
      // ... diğer tipler
    }
  }
}
```

---

### 2.4 Strategy Pattern

> Algoritmaları değiştirilebilir yap.

```typescript
// lib/strategies/pricing.strategy.ts
interface PricingStrategy {
  calculateFinalPrice(basePrice: number, context: PricingContext): number;
}

class StandardPricing implements PricingStrategy {
  calculateFinalPrice(basePrice: number) {
    const commissionRate = 0.05; // %5 komisyon
    return basePrice * (1 + commissionRate);
  }
}

class PromotionalPricing implements PricingStrategy {
  constructor(private discountRate: number) {}
  
  calculateFinalPrice(basePrice: number) {
    return basePrice * (1 - this.discountRate);
  }
}

class BulkPricing implements PricingStrategy {
  calculateFinalPrice(basePrice: number, context: PricingContext) {
    if (context.quantity >= 5) return basePrice * 0.9; // %10 indirim
    if (context.quantity >= 3) return basePrice * 0.95; // %5 indirim
    return basePrice;
  }
}

// Kullanım
class PricingService {
  constructor(private strategy: PricingStrategy) {}
  
  setStrategy(strategy: PricingStrategy) {
    this.strategy = strategy;
  }
  
  calculate(basePrice: number, context: PricingContext) {
    return this.strategy.calculateFinalPrice(basePrice, context);
  }
}
```

---

### 2.5 Observer Pattern (Event-Driven)

> Supabase Realtime ile event-driven mimari.

```typescript
// lib/events/order-events.ts
type OrderEvent = 
  | { type: 'ORDER_CREATED'; payload: Order }
  | { type: 'ORDER_PAID'; payload: { orderId: string; transactionId: string } }
  | { type: 'ORDER_SHIPPED'; payload: { orderId: string; trackingNumber: string } }
  | { type: 'ORDER_DELIVERED'; payload: { orderId: string; confirmedAt: Date } };

// hooks/use-order-subscription.ts
function useOrderSubscription(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          // Observer pattern: Değişiklik olunca otomatik güncelle
          setOrder(payload.new as Order);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);
  
  return order;
}
```

---

### 2.6 Adapter Pattern

> Harici servisleri adapte et.

```typescript
// lib/adapters/payment.adapter.ts
interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  error?: string;
}

interface PaymentAdapter {
  initiate(amount: number, metadata: Record<string, any>): Promise<string>;
  confirm(token: string): Promise<PaymentResult>;
  refund(transactionId: string, amount?: number): Promise<PaymentResult>;
}

// Iyzico Adapter
class IyzicoAdapter implements PaymentAdapter {
  private client: Iyzipay;
  
  constructor() {
    this.client = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY!,
      secretKey: process.env.IYZICO_SECRET_KEY!,
      uri: process.env.IYZICO_BASE_URL!
    });
  }
  
  async initiate(amount: number, metadata: Record<string, any>) {
    // Iyzico'nun API'sine özel request formatı
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: metadata.orderId,
      price: amount.toString(),
      paidPrice: amount.toString(),
      // ... Iyzico özel alanları
    };
    
    return new Promise((resolve, reject) => {
      this.client.checkoutFormInitialize.create(request, (err, result) => {
        if (err) reject(err);
        else resolve(result.checkoutFormContent);
      });
    });
  }
  
  // ... diğer metodlar
}
```

---

### 2.7 Singleton Pattern (Supabase Client)

> Tek instance'ı paylaş.

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
}

// Alternatif: Module pattern (Next.js için önerilen)
// lib/supabase/client.ts
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 3. Next.js App Router Patterns

### 3.1 Server Components (Default)

```typescript
// app/listings/page.tsx (Server Component)
async function ListingsPage() {
  // Direkt veritabanından çek - no client JS
  const listings = await getListings();
  
  return (
    <div>
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
```

### 3.2 Client Components (Etkileşim Gerektiğinde)

```typescript
// components/listings/listing-actions.tsx
'use client';

import { useState } from 'react';

export function ListingActions({ listingId }: { listingId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleFavorite = async () => {
    // Client-side interactivity
    setIsFavorite(!isFavorite);
    await toggleFavorite(listingId);
  };
  
  return (
    <Button onClick={handleFavorite}>
      {isFavorite ? '❤️' : '🤍'}
    </Button>
  );
}
```

### 3.3 Composition Pattern

```typescript
// Server ve Client component'leri birleştir
// app/listings/[id]/page.tsx (Server)
async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  
  return (
    <div>
      {/* Server-rendered içerik */}
      <ListingInfo listing={listing} />
      
      {/* Client component island */}
      <ListingActions listingId={listing.id} />
      
      {/* Realtime mesaj kutusu */}
      <MessageBox conversationId={listing.conversationId} />
    </div>
  );
}
```

### 3.4 Parallel Data Fetching

```typescript
// app/dashboard/page.tsx
async function DashboardPage() {
  // Paralel fetch - SRP + Performance
  const [listings, messages, notifications, stats] = await Promise.all([
    getUserListings(),
    getRecentMessages(),
    getNotifications(),
    getDashboardStats()
  ]);
  
  return (
    <Dashboard
      listings={listings}
      messages={messages}
      notifications={notifications}
      stats={stats}
    />
  );
}
```

---

## 4. React Patterns

### 4.1 Custom Hooks (Logic Reuse)

```typescript
// hooks/use-listings.ts
export function useListings(filters?: ListingFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
}

// hooks/use-create-listing.ts
export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success('İlan oluşturuldu!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
```

### 4.2 Compound Components

```typescript
// components/ui/card.tsx
const Card = ({ children, className }: CardProps) => (
  <div className={cn("rounded-lg border bg-card", className)}>
    {children}
  </div>
);

Card.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b">{children}</div>
);

Card.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

Card.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-t bg-muted/50">{children}</div>
);

// Kullanım
<Card>
  <Card.Header>Başlık</Card.Header>
  <Card.Body>İçerik</Card.Body>
  <Card.Footer>Aksiyonlar</Card.Footer>
</Card>
```

### 4.3 Render Props / Children as Function

```typescript
// components/auth/auth-guard.tsx
interface AuthGuardProps {
  children: (user: User) => React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <Skeleton />;
  if (!user) return fallback ?? <LoginPrompt />;
  
  return <>{children(user)}</>;
}

// Kullanım
<AuthGuard fallback={<LoginPage />}>
  {(user) => (
    <Dashboard user={user} />
  )}
</AuthGuard>
```

---

## 5. Supabase Patterns

### 5.1 Row Level Security (RLS) Patterns

```sql
-- Kullanıcı kendi verilerine erişebilir
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Herkes aktif ilanları görebilir
CREATE POLICY "Anyone can view active listings"
ON listings FOR SELECT
USING (status = 'active' AND is_deleted = false);

-- Sadece ilan sahibi düzenleyebilir
CREATE POLICY "Owners can update their listings"
ON listings FOR UPDATE
USING (auth.uid() = seller_id);
```

### 5.2 Database Functions

```sql
-- İlan görüntülenme sayısını artır
CREATE OR REPLACE FUNCTION increment_view_count(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE listings 
  SET view_count = view_count + 1 
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.3 Realtime Subscriptions

```typescript
// hooks/use-realtime-messages.ts
export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // Initial fetch
    fetchMessages(conversationId).then(setMessages);
    
    // Realtime subscription
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);
  
  return messages;
}
```

---

## 6. Anti-Patterns (Kaçınılması Gerekenler)

### ❌ Prop Drilling

```typescript
// ❌ YANLIŞ
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>

// ✅ DOĞRU: Context veya Zustand kullan
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

// Component'te
const user = useUserStore((state) => state.user);
```

### ❌ God Component

```typescript
// ❌ YANLIŞ: Her şeyi yapan component
function ListingPage() {
  // 500+ satır kod
  // Auth, fetch, form, validation, modal, toast...
}

// ✅ DOĞRU: Küçük, odaklı component'ler
function ListingPage() {
  return (
    <ListingProvider>
      <ListingHeader />
      <ListingGallery />
      <ListingInfo />
      <ListingActions />
      <SellerInfo />
      <MessageBox />
    </ListingProvider>
  );
}
```

### ❌ useEffect İçinde Her Şey

```typescript
// ❌ YANLIŞ
useEffect(() => {
  fetchUser();
  fetchListings();
  setupSubscriptions();
  trackAnalytics();
  // ... 50 satır daha
}, []);

// ✅ DOĞRU: Custom hook'lara ayır
function useDashboard() {
  const user = useUser();
  const listings = useListings();
  const notifications = useNotifications();
  
  return { user, listings, notifications };
}
```

### ❌ Direct Database Calls in Components

```typescript
// ❌ YANLIŞ: Component içinde direkt DB çağrısı
function ListingCard({ id }) {
  const [listing, setListing] = useState(null);
  
  useEffect(() => {
    supabase.from('listings').select('*').eq('id', id)
      .then(({ data }) => setListing(data));
  }, [id]);
}

// ✅ DOĞRU: Repository + Hook katmanı
function ListingCard({ id }) {
  const { data: listing } = useListing(id);
  // ...
}
```

---

## 📎 Referanslar

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [React Patterns](https://reactpatterns.com/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [Patterns.dev](https://www.patterns.dev/)

---

[[plan/Klasör Yapısı.md]] | [[Teknoloji Stack.md]]
