"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageSchema, SendMessageFormData } from "@/lib/validations";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Mesajınızı yazın...",
}: MessageInputProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageFormData>({
    resolver: zodResolver(sendMessageSchema),
  });

  const onSubmit = async (data: SendMessageFormData) => {
    setIsLoading(true);
    try {
      await onSend(data.content);
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-end gap-2 p-4 border-t bg-background"
    >
      <div className="flex-1">
        <Textarea
          placeholder={placeholder}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
          {...register("content")}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
        />
        {errors.content && (
          <p className="text-xs text-destructive mt-1">
            {errors.content.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={disabled || isLoading}
        className="shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
