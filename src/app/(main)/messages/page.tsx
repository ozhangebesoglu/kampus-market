"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { ConversationList } from "@/components/messages/conversation-list";
import { useAuth } from "@/hooks/use-auth";
import { getConversations, subscribeToConversations } from "@/lib/services/messages";
import type { ConversationWithDetails } from "@/types";

export default function MessagesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth kontrolü
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/messages");
    }
  }, [authLoading, isAuthenticated, router]);

  // Konuşmaları yükle
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const data = await getConversations(user.id);
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Realtime subscription
    const channel = subscribeToConversations(user.id, () => {
      // Konuşma güncellendiğinde yeniden yükle
      fetchConversations();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (authLoading || isLoading) {
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
        <h1 className="text-3xl font-bold mb-6">Mesajlar</h1>

        <div className="bg-card rounded-lg border shadow-sm min-h-[500px]">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Henüz mesajınız yok</h2>
              <p className="text-muted-foreground max-w-sm">
                Bir ilan hakkında satıcıyla iletişime geçtiğinizde mesajlarınız burada görünecek.
              </p>
            </div>
          ) : (
            <ConversationList conversations={conversations} currentUserId={user.id} />
          )}
        </div>
      </div>
    </div>
  );
}
