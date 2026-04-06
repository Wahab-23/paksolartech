"use client";

import { useState } from "react";
import { Sun } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [error, setError] = useState(false);

  // If no source is provided or there was an error loading the image
  if (!src || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/50 border border-border/50 rounded-2xl ${className}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
          <Sun className="h-6 w-6 text-primary opacity-40" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 text-center">
          Image Not Available
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
