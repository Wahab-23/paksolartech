"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Fallback if no images
    if (!images || images.length === 0) {
        return (
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-muted/30 aspect-4/3">
                <ProductImage
                    src={null}
                    alt={productName}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-muted/30 aspect-4/3 relative group">
                <ProductImage
                    src={images[activeIndex]}
                    alt={`${productName} - View ${activeIndex + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                                activeIndex === i 
                                    ? "border-primary ring-2 ring-primary/20" 
                                    : "border-border/50 hover:border-primary/50"
                            )}
                        >
                            <img
                                src={url}
                                alt={`${productName} thumbnail ${i + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
