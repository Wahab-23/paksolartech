"use client";

import { useState } from "react";
import Image from "next/image";
import { Sun } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({ src, alt, className = "", priority = false }: ProductImageProps) {
  const [error, setError] = useState(false);

  // If no source is provided or there was an error loading the image
  if (!src || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/30 border border-border/50 rounded-2xl ${className}`}>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-3 animate-pulse-glow">
          <Sun className="h-10 w-10 text-primary opacity-40" />
          {/* Minimalist SVG Logo Placeholder */}
          <svg
            className="absolute inset-0 h-full w-full opacity-10"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10L90 30V70L50 90L10 70V30L50 10Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold px-4 text-center leading-tight">
          PakSolarTech<br />Product
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        priority={priority}
        onError={() => setError(true)}
      />
    </div>
  );
}
