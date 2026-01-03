import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

// ============================================
// Auth Store
// ============================================

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

// ============================================
// UI Store
// ============================================

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));

// ============================================
// Filter Store (for listings)
// ============================================

interface FilterState {
  category: string | null;
  conditions: string[];
  minPrice: number | null;
  maxPrice: number | null;
  search: string;
  sortBy: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
  setCategory: (category: string | null) => void;
  setConditions: (conditions: string[]) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSearch: (search: string) => void;
  setSortBy: (
    sortBy: "newest" | "oldest" | "price_asc" | "price_desc" | "popular"
  ) => void;
  resetFilters: () => void;
}

const initialFilterState = {
  category: null,
  conditions: [],
  minPrice: null,
  maxPrice: null,
  search: "",
  sortBy: "newest" as const,
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialFilterState,
  setCategory: (category) => set({ category }),
  setConditions: (conditions) => set({ conditions }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialFilterState),
}));

// ============================================
// Notification Store
// ============================================

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  clearUnread: () => set({ unreadCount: 0 }),
}));

// ============================================
// Message Store
// ============================================

interface MessageState {
  unreadCount: number;
  activeConversationId: string | null;
  setUnreadCount: (count: number) => void;
  setActiveConversation: (id: string | null) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  unreadCount: 0,
  activeConversationId: null,
  setUnreadCount: (count) => set({ unreadCount: count }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
}));

// ============================================
// Favorites Store (with persistence)
// ============================================

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setFavorites: (ids: string[]) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (id) =>
        set((state) => ({
          favoriteIds: [...state.favoriteIds, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        })),
      isFavorite: (id) => get().favoriteIds.includes(id),
      setFavorites: (ids) => set({ favoriteIds: ids }),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: "kampus-market-favorites",
    }
  )
);
