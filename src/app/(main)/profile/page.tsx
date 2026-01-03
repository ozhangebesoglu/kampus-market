"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Package, Loader2 } from "lucide-react";
import { ProfileForm, SecurityForm, MyListings } from "@/components/profile";
import { useAuth } from "@/hooks/use-auth";
import type { User as UserType } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Giriş yapmamış kullanıcıları login'e yönlendir
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  // Kullanıcı güncellendiğinde
  const handleUserUpdate = (updatedUser: UserType) => {
    if (updatedUser) {
      refreshUser();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profilim</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">İlanlarım</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Güvenlik</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Profil Bilgileri</h2>
              <ProfileForm user={user} onUpdate={handleUserUpdate} />
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">İlanlarım</h2>
              <MyListings userId={user.id} />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <SecurityForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
