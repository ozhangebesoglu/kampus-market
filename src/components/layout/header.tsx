"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  Plus,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Settings,
  Package,
  Heart,
  Shield,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore, useMessageStore, useNotificationStore } from "@/stores";
import { APP_NAME, CATEGORIES } from "@/constants";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { unreadCount: messageCount } = useMessageStore();
  const { unreadCount: notificationCount } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold sm:inline-block">{APP_NAME}</span>
        </Link>

        {/* Kategoriler - Desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden md:flex">
              Kategoriler
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Tüm Kategoriler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORIES.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link href={`/categories/${category.slug}`}>
                  {category.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/listings" className="font-medium">
                Tüm İlanlar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Arama - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center px-6 md:flex md:max-w-md lg:max-w-lg"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="İlan ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Sağ taraf - Desktop */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/search")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <>
              {/* İlan Ver */}
              <Button asChild className="hidden sm:flex">
                <Link href="/listings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  İlan Ver
                </Link>
              </Button>

              {/* Mesajlar */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/messages">
                  <MessageSquare className="h-5 w-5" />
                  {messageCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {messageCount > 9 ? "9+" : messageCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Bildirimler */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Profil Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user?.avatar_url || undefined}
                        alt={user?.full_name}
                      />
                      <AvatarFallback>
                        {user?.full_name ? getInitials(user.full_name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.full_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profilim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=listings">
                      <Package className="mr-2 h-4 w-4" />
                      İlanlarım
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorilerim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=security">
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlar
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Kayıt Ol</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menü</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                <Link
                  href="/"
                  className="text-lg font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                
                <div className="border-t pt-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Kategoriler
                  </p>
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {isAuthenticated && (
                  <div className="border-t pt-4">
                    <Button asChild className="w-full">
                      <Link
                        href="/listings/new"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        İlan Ver
                      </Link>
                    </Button>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="border-t pt-4 space-y-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Giriş Yap
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Kayıt Ol
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
