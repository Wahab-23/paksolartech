import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/public/ProductCard';
import { getCategoryBySlug, getAllProducts, getAllCategories } from '@/app/models/product.model';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Filter } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} | PakSolarTech`,
    description: category.meta_description || category.description || `Browse our high-quality ${category.name} solutions.`,
    keywords: category.meta_keywords || `${category.name}, solar panels Pakistan, renewable energy`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const allProducts = await getAllProducts({ activeOnly: true });
  const categoryProducts = allProducts.filter((p) => p.category_id === category.id);
  const categories = await getAllCategories();

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Banner Section */}
        <div className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 sm:py-24">
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
            <div className="absolute right-1/4 bottom-1/4 h-[250px] w-[250px] rounded-full bg-chart-2/5 blur-[70px]" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-primary">
                <span className="text-lg">{category.icon || '☀️'}</span>
                Explore Product Range
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {category.description || `Discover our selection of premium ${category.name.toLowerCase()} designed for Pakistan's environment.`}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border/50 pb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{categoryProducts.length} Products Available</h2>
            </div>
            
            {/* Simple Category Filter Pill */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-2 self-center">Categories:</span>
              {categories.map((c) => (
                <a 
                  key={c.id} 
                  href={`/categories/${c.slug}`}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    c.slug === slug 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-border/50 bg-muted/20">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground max-w-xs">
                We couldn&apos;t find any active products in this category at the moment. Please check back soon.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
