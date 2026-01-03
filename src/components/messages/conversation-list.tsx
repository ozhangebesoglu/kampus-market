"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";
import type { ConversationWithDetails } from "@/types";

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  currentUserId: string;
  activeConversationId?: string;
}

export function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-muted-foreground">Henüz mesajınız yok.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          currentUserId={currentUserId}
          isActive={conversation.id === activeConversationId}
        />
      ))}
    </div>
  );
}

interface ConversationItemProps {
  conversation: ConversationWithDetails;
  currentUserId: string;
  isActive?: boolean;
}

function ConversationItem({ conversation, currentUserId, isActive }: ConversationItemProps) {
  // Karşı tarafı belirle
  const isBuyer = conversation.buyer_id === currentUserId;
  const otherParticipant = isBuyer ? conversation.seller : conversation.buyer;
  const unreadCount = isBuyer ? conversation.buyer_unread_count : conversation.seller_unread_count;
  const hasUnread = unreadCount > 0;

  const timeAgo = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), {
        addSuffix: true,
        locale: tr,
      })
    : "";

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
        isActive && "bg-muted",
        hasUnread && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={otherParticipant?.avatar_url || ""} />
        <AvatarFallback>
          {getInitials(otherParticipant?.full_name || "?")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn("font-medium truncate", hasUnread && "font-semibold")}>
            {otherParticipant?.full_name || "Kullanıcı"}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo}
          </span>
        </div>

        {conversation.listing && (
          <p className="text-xs text-primary truncate mb-1">
            {conversation.listing.title}
          </p>
        )}

        <p
          className={cn(
            "text-sm truncate",
            hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {conversation.last_message_preview || "Henüz mesaj yok"}
        </p>
      </div>

      {hasUnread && (
        <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full text-xs">
          !
        </Badge>
      )}
    </Link>
  );
}
