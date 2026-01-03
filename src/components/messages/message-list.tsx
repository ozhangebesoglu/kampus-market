"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import type { MessageWithSender } from "@/types";

interface MessageListProps {
  messages: MessageWithSender[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Yeni mesaj geldiğinde scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
        <p>Henüz mesaj yok. İlk mesajı gönderin!</p>
      </div>
    );
  }

  // Mesajları tarihe göre grupla
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          <div className="flex items-center justify-center mb-4">
            <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
              {date}
            </span>
          </div>
          <div className="space-y-3">
            {dayMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface MessageBubbleProps {
  message: MessageWithSender;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = format(new Date(message.created_at), "HH:mm", { locale: tr });

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatar_url || ""} />
          <AvatarFallback>
            {getInitials(message.sender?.full_name || "?")}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[70%] px-4 py-2 rounded-2xl",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-xs",
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {time}
          </span>
          {isOwn && message.status === "read" && (
            <span className="text-xs text-primary-foreground/70">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

function groupMessagesByDate(messages: MessageWithSender[]): Record<string, MessageWithSender[]> {
  const groups: Record<string, MessageWithSender[]> = {};

  messages.forEach((message) => {
    const date = format(new Date(message.created_at), "d MMMM yyyy", {
      locale: tr,
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
}
