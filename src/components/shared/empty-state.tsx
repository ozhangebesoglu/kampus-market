import { LucideIcon, PackageSearch, MessageSquare, Heart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      {children}
    </div>
  );
}

// Pre-configured empty states
export function EmptyListings() {
  return (
    <EmptyState
      icon={PackageSearch}
      title="Henüz ilan bulunmuyor"
      description="Aradığınız kriterlere uygun ilan bulunamadı. Filtreleri değiştirmeyi deneyin."
    />
  );
}

export function EmptyMessages() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Henüz mesajınız yok"
      description="Bir ilan sahibiyle iletişime geçtiğinizde mesajlarınız burada görünecek."
    />
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={Heart}
      title="Favorileriniz boş"
      description="Beğendiğiniz ilanları favorilere ekleyerek daha sonra kolayca bulabilirsiniz."
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="Bildirim yok"
      description="Yeni bildirimleriniz burada görünecek."
    />
  );
}
