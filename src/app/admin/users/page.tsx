import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/admin/users-table";
import { User } from "@/types";

export const metadata: Metadata = {
  title: "Kullanıcılar",
  description: "Tüm kullanıcıları yönet",
};

async function getUsers(): Promise<User[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return (data as User[]) || [];
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Kullanıcılar</h1>
        <p className="text-muted-foreground mt-1">
          Tüm kayıtlı kullanıcıları görüntüleyin
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
