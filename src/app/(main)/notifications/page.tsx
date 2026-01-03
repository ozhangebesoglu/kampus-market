"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Loader2, Package, MessageSquare, AlertCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "message" | "listing_approved" | "listing_rejected" | "listing_sold" | "system";
  title: string;
  body: string;
  is_read: boolean;
  action_url: string | null;
  related_listing_id: string | null;
  created_at: string;
}

const notificationIcons = {
  message: MessageSquare,
  listing_approved: Check,
  listing_rejected: AlertCircle,
  listing_sold: Package,
  system: Info,
};

const notificationColors = {
  message: "text-blue-500",
  listing_approved: "text-green-500",
  listing_rejected: "text-red-500",
  listing_sold: "text-purple-500",
  system: "text-gray-500",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }
        setUserId(user.id);

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error("Notifications fetch error:", error);
        toast.error("Bildirimler yüklenirken hata oluştu");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, [supabase]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("Tüm bildirimler okundu olarak işaretlendi");
    } catch (error) {
      console.error("Mark all as read error:", error);
      toast.error("İşlem sırasında hata oluştu");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Bell className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Giriş Yapın</h2>
          <p className="text-muted-foreground mb-4">
            Bildirimlerinizi görmek için giriş yapmanız gerekiyor.
          </p>
          <Button asChild>
            <Link href="/login?redirect=/notifications">Giriş Yap</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Bildirimler</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} yeni</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Tümünü Okundu İşaretle
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Henüz bildiriminiz yok</h3>
            <p className="text-muted-foreground">
              İlanlarınız onaylandığında veya mesaj aldığınızda burada görünecek.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell;
            const iconColor = notificationColors[notification.type] || "text-gray-500";

            const content = (
              <Card
                className={cn(
                  "transition-colors cursor-pointer hover:bg-muted/50",
                  !notification.is_read && "bg-primary/5 border-primary/20"
                )}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={cn("mt-1", iconColor)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("font-medium", !notification.is_read && "text-primary")}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );

            if (notification.action_url) {
              return (
                <Link key={notification.id} href={notification.action_url}>
                  {content}
                </Link>
              );
            }

            return <div key={notification.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}
