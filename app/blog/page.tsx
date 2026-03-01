import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    created_at: string;
}

async function getBlogs(): Promise<Blog[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export const metadata = {
    title: 'Blog — PakSolarTech',
    description: 'Read the latest articles about solar energy, installation tips, and industry insights from PakSolarTech.',
};

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24">
                {/* Header */}
                <section className="section-padding pb-8">
                    <div className="mx-auto max-w-7xl text-center">
                        <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                            <Newspaper className="h-3.5 w-3.5" />
                            Our Blog
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Solar Energy <span className="text-gradient">Insights</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Stay updated with the latest news, tips, and insights about solar energy technology and industry trends.
                        </p>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="section-padding pt-8">
                    <div className="mx-auto max-w-7xl">
                        {blogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Newspaper className="h-8 w-8 text-primary opacity-50" />
                                </div>
                                <p className="text-lg font-medium text-muted-foreground">No blog posts yet</p>
                                <p className="mt-1 text-sm text-muted-foreground">Check back soon for new articles!</p>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
                                {blogs.map((blog) => (
                                    <Link
                                        key={blog.id}
                                        href={`/blog/${blog.slug}`}
                                        className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5 animate-slide-up"
                                    >
                                        {/* Cover Image */}
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            {blog.cover_image ? (
                                                <img
                                                    src={blog.cover_image}
                                                    alt={blog.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-chart-2/10">
                                                    <Newspaper className="h-12 w-12 text-primary/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(blog.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                            <h2 className="mb-2 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                                                {blog.title}
                                            </h2>
                                            {blog.excerpt && (
                                                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                    {blog.excerpt}
                                                </p>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                                                Read More
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
