import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // Admin kontrolü
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r hidden lg:block">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Yönetim Paneli</p>
          </div>
          <nav className="px-4 space-y-1">
            <a
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/admin/listings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              İlan Onay
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Kullanıcılar
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
