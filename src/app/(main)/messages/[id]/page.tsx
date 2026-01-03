"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageList } from "@/components/messages/message-list";
import { MessageInput } from "@/components/messages/message-input";
import { useAuth } from "@/hooks/use-auth";
import {
  getConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from "@/lib/services/messages";
import { formatPrice, getInitials } from "@/lib/utils";
import type { ConversationWithDetails, MessageWithSender, Message } from "@/types";

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth kontrolü
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/messages");
    }
  }, [authLoading, isAuthenticated, router]);

  // Konuşma ve mesajları yükle
  const loadData = useCallback(async () => {
    if (!user || !conversationId) return;

    try {
      const [conv, msgs] = await Promise.all([
        getConversation(conversationId),
        getMessages(conversationId),
      ]);

      if (!conv) {
        router.push("/messages");
        return;
      }

      // Yetkisiz erişim kontrolü
      if (conv.buyer_id !== user.id && conv.seller_id !== user.id) {
        router.push("/messages");
        return;
      }

      setConversation(conv);
      setMessages(msgs);

      // Mesajları okundu olarak işaretle
      await markMessagesAsRead(conversationId, user.id);
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Konuşma yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Realtime mesaj subscription
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = subscribeToMessages(conversationId, async (newMessage: Message) => {
      // Yeni mesajı listeye ekle (sender bilgisi ile)
      if (newMessage.sender_id !== user.id) {
        // Karşı taraftan gelen mesaj
        const messageWithSender: MessageWithSender = {
          ...newMessage,
          sender: conversation?.buyer_id === newMessage.sender_id
            ? conversation.buyer
            : conversation?.seller || { id: newMessage.sender_id, full_name: "Kullanıcı", avatar_url: null } as any,
        };
        setMessages((prev) => [...prev, messageWithSender]);
        
        // Okundu olarak işaretle
        await markMessagesAsRead(conversationId, user.id);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, user, conversation]);

  // Mesaj gönder
  const handleSendMessage = async (content: string) => {
    if (!user || !conversationId) return;

    try {
      const newMessage = await sendMessage(conversationId, user.id, content);
      
      // Mesajı listeye ekle
      const messageWithSender: MessageWithSender = {
        ...newMessage,
        sender: {
          id: user.id,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
        } as any,
      };
      setMessages((prev) => [...prev, messageWithSender]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Mesaj gönderilemedi");
      throw error;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user || !conversation) {
    return null;
  }

  // Karşı tarafı belirle
  const isBuyer = conversation.buyer_id === user.id;
  const otherParticipant = isBuyer ? conversation.seller : conversation.buyer;

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg border shadow-sm flex flex-col h-[calc(100vh-12rem)]">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParticipant?.avatar_url || ""} />
              <AvatarFallback>
                {getInitials(otherParticipant?.full_name || "?")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">
                {otherParticipant?.full_name || "Kullanıcı"}
              </h2>
              {conversation.listing && (
                <Link
                  href={`/listings/${conversation.listing.id}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <span className="truncate">{conversation.listing.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </Link>
              )}
            </div>

            {/* Listing preview */}
            {conversation.listing && (
              <Link
                href={`/listings/${conversation.listing.id}`}
                className="hidden sm:block shrink-0"
              >
                <div className="bg-muted rounded-lg p-2 text-right">
                  <p className="text-xs text-muted-foreground">İlan Fiyatı</p>
                  <p className="font-bold text-primary">
                    {formatPrice(conversation.listing.price)}
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* Messages */}
          <MessageList messages={messages} currentUserId={user.id} />

          {/* Input */}
          <MessageInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
