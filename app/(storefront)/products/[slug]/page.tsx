import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getCategoryById } from '@/app/models/product.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Zap, Shield, CheckCircle2, ChevronRight,
  MapPin, Phone, MessageSquare, Info
} from 'lucide-react';
import Link from 'next/link';
import ProductImage from '@/components/public/ProductImage';
import { LexicalRenderer } from '@/components/lexical/LexicalRenderer';
import { ImageGallery } from '../../../../components/public/ImageGallery';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.meta_title || `${product.name} | PakSolarTech`,
    description: product.meta_description || product.short_desc || `Detailed specifications for ${product.name}.`,
    keywords: product.meta_keywords || `${product.name}, solar energy Pakistan, ${product.brand}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = product.category_id ? await getCategoryById(product.category_id) : null;

  // Handle specs (JSON)
  let specs = [];
  try {
    specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : (product.specs || []);
  } catch (e) {
    specs = [];
  }

  // Handle images (JSON)
  let images = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
  } catch (e) {
    images = [];
  }

  // If no multiple images found, fallback to legacy image_url
  if (images.length === 0 && product.image_url) {
    images = [product.image_url];
  }

  return (
    <>
      <main className="min-h-screen bg-background pt-20">
        {/* Breadcrumbs */}
        <nav className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link href={`/categories/${category.slug}`} className="hover:text-primary transition-colors">
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="font-medium text-foreground truncate">{product.name}</span>
          </div>
        </nav>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — Image Gallery */}
            <ImageGallery images={images} productName={product.name} />

            {/* Right — Details */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-3">
                  <Badge className="bg-primary/15 text-primary border-primary/20">
                    {product.brand || 'Premium'}
                  </Badge>
                  {product.badge && (
                    <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5">
                      {product.badge}
                    </Badge>
                  )}
                  {product.wattage && (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-yellow-500">
                      <Zap className="h-4 w-4" />
                      {product.wattage}W
                    </div>
                  )}
                </div>

                <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.short_desc || 'Optimized for high-performance energy generation.'}
                </p>
              </div>

              <div className="mb-8 rounded-2xl border border-primary/10 bg-primary/5 p-6 md:p-8">
                <p className="mb-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Price Estimate
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-primary">Rs. {(product.price_from ?? 0).toLocaleString()}</span>
                  {product.price_to && (
                    <span className="text-xl text-muted-foreground border-l border-border/50 pl-2">
                      to Rs. {(product.price_to ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  * Prices vary based on system size and installation complexity.
                  <span className="block mt-1">Get a custom quote for better pricing.</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mb-10 flex flex-wrap gap-4">
                <Link href="/#contact" className="flex-1 min-w-[200px]">
                  <Button size="lg" className="w-full gap-2 h-14 text-lg">
                    <MessageSquare className="h-5 w-5" /> Request a Quote
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="flex-1 min-w-[200px] h-14 text-lg gap-2">
                  <Phone className="h-5 w-5" /> Call for Inquiry
                </Button>
              </div>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-border/50 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">Warranty Covered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Pakistan Wide Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specs Tabs */}
          <div className="mt-20">
            <div className="mb-8 border-b border-border/50">
              <div className="flex gap-8">
                <button className="relative pb-4 text-lg font-bold text-primary">
                  Features & Details
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-primary rounded-full" />
                </button>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {/* Main Text */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="h-6 w-6 text-primary" />
                  Product Story
                </h3>
                <div className="text-muted-foreground text-lg leading-relaxed">
                  {product.description && product.description.includes('{') ? (
                    <div className="prose prose-invert max-w-none">
                      <LexicalRenderer data={product.description} />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {product.description || 'Detailed description coming soon...'}
                    </p>
                  )}
                </div>{/* 

                <ul className="mt-8 space-y-4">
                  {[
                    'High conversion efficiency for maximum output',
                    'Durable build quality for Pakistan\'s climate',
                    'Minimal maintenance required',
                    '24/7 technical support from PakSolarTech'
                  ].map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul> */}
              </div>

              {/* Specs Sidebar */}
              <div className="rounded-3xl border border-border/50 bg-card/30 p-8 self-start">
                <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
                <div className="space-y-4">
                  {specs.length > 0 ? (
                    specs.map((spec: any, i: number) => (
                      <div key={i} className="flex flex-col border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{spec.label}</span>
                        <span className="text-lg font-semibold">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No specifications listed.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
