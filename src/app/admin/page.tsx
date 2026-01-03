import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Clock, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Yönetim paneli",
};

async function getStats() {
  const supabase = await createClient();

  // Toplam kullanıcı sayısı
  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Toplam ilan sayısı
  const { count: listingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  // Bekleyen ilanlar
  const { count: pendingCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Aktif ilanlar
  const { count: activeCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  return {
    users: usersCount || 0,
    listings: listingsCount || 0,
    pending: pendingCount || 0,
    active: activeCount || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kullanıcı
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İlan</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.listings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Onay Bekleyen
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif İlan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.active}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
