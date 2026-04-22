import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    tags?: string[];
    created_at: string;
    published_at: string | null;
}


import { getAllBlogs } from '@/app/models/blog.model';

async function getBlogs(): Promise<Blog[]> {
    return await getAllBlogs({ publishedOnly: true }) as Blog[];
}



export const metadata = {
    title: 'Solar Energy Blog — Tips, Guides & Industry News',
    description: 'Expert articles on solar panel installation, NEPRA net metering, energy savings tips, and industry updates for homes and businesses in Pakistan.',
    keywords: 'solar energy blog Pakistan, solar panel guides, net metering tips, solar installation articles, NEPRA updates',
    openGraph: {
        title: 'Solar Energy Blog — PakSolarTech',
        description: 'Expert solar energy articles, guides, and industry insights from Pakistan\'s leading solar installer.',
    },
    alternates: {
        canonical: '/blog',
    },
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://paksolartech.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://paksolartech.com/blog" }
    ]
};


export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <main className="min-h-screen pt-32">

                {/* Header */}
                <section className="px-4 sm:px-6 lg:px-8 mb-12">
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
                <section className="px-4 sm:px-6 lg:px-8 pb-24">
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
                                        <div className="relative aspect-[7/5] overflow-hidden bg-muted">
                                            {blog.cover_image ? (
                                                <Image
                                                    src={blog.cover_image}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                                                {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
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
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {blog.tags.slice(0, 2).map((tag, i) => (
                                                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
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
        </>
    );
}
