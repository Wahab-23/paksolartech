import { Metadata } from 'next';
import ProductCard from '@/components/public/ProductCard';
import { getAllProducts, getAllCategories } from '@/app/models/product.model';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Products | PakSolarTech',
  description: 'Browse our complete range of solar panels, inverters, batteries, and accessories.',
};

export default async function AllProductsPage() {
  const products = await getAllProducts({ activeOnly: true });
  const categories = await getAllCategories();

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 sm:py-24">
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
            <div className="absolute right-1/4 bottom-1/4 h-[250px] w-[250px] rounded-full bg-chart-2/5 blur-[70px]" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
              <ShoppingBag className="h-3.5 w-3.5" />
              Complete Catalog
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Our <span className="text-gradient">Solar Solutions</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Premium solar equipment from global Tier-1 manufacturers, optimized for Pakistan&apos;s climate and energy needs.
            </p>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link 
              href="/products"
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-primary text-primary-foreground"
            >
              All Products
            </Link>
            {categories.map((c) => (
              <Link 
                key={c.id} 
                href={`/categories/${c.slug}`}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-10 border-b border-border/50 pb-6">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">{products.length} Products Found</h2>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
