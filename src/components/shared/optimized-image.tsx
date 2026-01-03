"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallback?: React.ReactNode;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback,
  ...props
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      fallback || (
        <div
          className={cn(
            "bg-muted flex items-center justify-center",
            className
          )}
        >
          <User className="h-1/3 w-1/3 text-muted-foreground" />
        </div>
      )
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
