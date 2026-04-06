'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import ProductImage from '@/components/public/ProductImage';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    short_desc: string | null;
    image_url: string | null;
    images?: any;
    price_from: number;
    badge: string | null;
    brand: string | null;
    wattage: number | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-4 top-4 z-10">
          <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
            {product.badge}
          </Badge>
        </div>
      )}

      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-muted">
        {(() => {
          let displayImage = product.image_url;
          if (!displayImage && product.images) {
            try {
              const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
              if (Array.isArray(images) && images.length > 0) {
                displayImage = images[0];
              }
            } catch (e) {}
          }
          return (
            <ProductImage
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          );
        })()}
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-primary/70">
            {product.brand || 'Premium Quality'}
          </span>
          {product.wattage && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-yellow-400" />
              {product.wattage}W
            </div>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-1 text-lg font-bold group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {product.short_desc || 'High-performance solar solution for your energy needs.'}
        </p>

        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Starting from</p>
            <p className="text-xl font-bold text-primary">
              Rs. {product.price_from.toLocaleString()}
            </p>
          </div>
          <Link href={`/products/${product.slug}`}>
            <Button size="sm" variant="outline" className="group/btn h-9 gap-2 border-primary/20 hover:bg-primary/10">
              Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hover glow accent */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
