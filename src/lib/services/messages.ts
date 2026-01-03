import { createClient } from "@/lib/supabase/client";
import type { Conversation, ConversationWithDetails, Message, MessageWithSender } from "@/types";

const supabase = createClient();

// ============================================
// Konuşmalar
// ============================================

/**
 * Kullanıcının tüm konuşmalarını getir
 */
export async function getConversations(userId: string): Promise<ConversationWithDetails[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      listing:listings!listing_id(id, title, price, status),
      buyer:users!buyer_id(id, full_name, avatar_url),
      seller:users!seller_id(id, full_name, avatar_url)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw new Error(error.message);
  }

  return (data as ConversationWithDetails[]) || [];
}

/**
 * Tek bir konuşmayı getir
 */
export async function getConversation(conversationId: string): Promise<ConversationWithDetails | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      listing:listings!listing_id(id, title, price, status),
      buyer:users!buyer_id(id, full_name, avatar_url),
      seller:users!seller_id(id, full_name, avatar_url)
    `)
    .eq("id", conversationId)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }

  return data as ConversationWithDetails;
}

/**
 * İlana ait mevcut konuşmayı bul veya yeni oluştur
 */
export async function getOrCreateConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<Conversation> {
  // Önce mevcut konuşmayı ara
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .single();

  if (existing) {
    return existing as Conversation;
  }

  // Yeni konuşma oluştur
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw new Error(error.message);
  }

  return data as Conversation;
}

// ============================================
// Mesajlar
// ============================================

/**
 * Konuşmadaki mesajları getir
 */
export async function getMessages(conversationId: string): Promise<MessageWithSender[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:users!sender_id(id, full_name, avatar_url)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error(error.message);
  }

  return (data as MessageWithSender[]) || [];
}

/**
 * Yeni mesaj gönder
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      status: "sent",
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }

  // Konuşmayı güncelle
  await supabase
    .from("conversations")
    .update({
      last_message_id: data.id,
      last_message_at: data.created_at,
      last_message_preview: content.slice(0, 100),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  return data as Message;
}

/**
 * Mesajları okundu olarak işaretle
 */
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  // Karşı taraftan gelen mesajları okundu yap
  const { error } = await supabase
    .from("messages")
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .is("read_at", null);

  if (error) {
    console.error("Error marking messages as read:", error);
  }

  // Konuşmadaki okunmamış sayısını sıfırla
  const { data: conversation } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id")
    .eq("id", conversationId)
    .single();

  if (conversation) {
    const updateField =
      conversation.buyer_id === userId
        ? { buyer_unread_count: 0 }
        : { seller_unread_count: 0 };

    await supabase
      .from("conversations")
      .update(updateField)
      .eq("id", conversationId);
  }
}

/**
 * Realtime mesaj subscription
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
}

/**
 * Realtime konuşma subscription (yeni mesaj geldiğinde liste güncellemesi için)
 */
export function subscribeToConversations(
  userId: string,
  callback: (conversation: Conversation) => void
) {
  return supabase
    .channel(`conversations:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations",
        filter: `buyer_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Conversation);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations",
        filter: `seller_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Conversation);
      }
    )
    .subscribe();
}
